import axios from 'axios'
import { appendFile } from 'fs'
import { parse } from 'node-html-parser'
import removeAccents from 'remove-accents'
import SQL from 'sql-template-strings'
import { jeopardyQuery } from 'src/database/database'

export type Clue = {
    answer: string
    clueText: string
    value: number
    category: string
    showNumber: number
    airdate: string
}

const TEST_OUTPUT_FILE = './src/bin/output.txt' as const

const JEOPARDY_ARCHIVE_URL = 'https://www.j-archive.com/showgame.php' as const

// scraping classes and ids
const GAME_TITLE_ID = '#game_title' as const
const JEOPARDY_ROUND_ID = '#jeopardy_round' as const
const DOUBLE_JEOPARDY_ROUND_ID = '#double_jeopardy_round' as const
const CATEGORY_CLASS = '.category_name' as const
const CLUE_CLASS = '.clue' as const
const CLUE_VALUE = '.clue_value' as const
const CLUE_TEXT = '.clue_text' as const
const CORRECT_RESPONSE = '.correct_response' as const

const HTML_REGEX = /<(?:.|\n)*?>/gm

const dateFormatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
})

void main()
    .then(async () => {
        console.log('Finished scraping clues')
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(2)
    })

async function main() {
    let gameId = 50
    while (true) {
        gameId++
        console.log(`Started scraping gameId ${gameId}`)

        const existingRecords = await jeopardyQuery(
            SQL`SELECT * FROM clues WHERE jArchiveGameId=${gameId} LIMIT 1;`
        )
        if ('error' in existingRecords) {
            console.error(
                `Error querying database for existing records with jArchiveGameId of ${gameId}`,
                existingRecords.error
            )
            continue
        }

        if (existingRecords.length > 0) {
            console.log(`Clues already fetched for jArchiveGameId of ${gameId}`)
            continue
        }

        const page = await fetchPageHtml(gameId)
        const root = parse(page) as unknown as HTMLElement
        const [showNumber, airDate] = parseTitle(root)

        if (!showNumber || !airDate) {
            console.error(`Could parse title for jArchiveGameId ${gameId}`)
            continue
        }

        const jeopardyRoundHtml = root.querySelector(
            JEOPARDY_ROUND_ID
        ) as unknown as Element
        const jeopardyClues = parseClues(jeopardyRoundHtml, showNumber, airDate)

        const doubleJeopardyRoundHtml = root.querySelector(
            DOUBLE_JEOPARDY_ROUND_ID
        ) as unknown as Element
        const doubleJeopardyClues = parseClues(
            doubleJeopardyRoundHtml,
            showNumber,
            airDate
        )

        jeopardyClues
            .map((clue) => JSON.stringify(clue))
            .forEach((clue) => {
                appendFile(TEST_OUTPUT_FILE, clue + '\n', (error) => {
                    if (error) console.log('error', error)
                })
            })

        doubleJeopardyClues
            .map((clue) => JSON.stringify(clue))
            .forEach((clue) => {
                appendFile(TEST_OUTPUT_FILE, clue + '\n', (error) => {
                    if (error) console.log('error', error)
                })
            })

        console.log(`Finished scraping gameId ${gameId}`)
        await sleep(5000)
    }
}

function parseTitle(rootHtml: HTMLElement): [string, string] | [] {
    const gameTitle = rootHtml.querySelector(GAME_TITLE_ID)
    const titleParts = gameTitle?.innerHTML.replace(HTML_REGEX, '').split('-')

    if (titleParts && titleParts.length > 1) {
        const showNumber = titleParts[0].split('#')[1].trim()
        const airdate = titleParts[1].trim()
        return [showNumber, dateFormatter.format(new Date(airdate))]
    }

    return []
}

function parseClues(
    roundHtml: Element,
    showNumber: string,
    airdate: string
): Clue[] {
    const categoryElements = roundHtml?.querySelectorAll(CATEGORY_CLASS)
    const clueElements = roundHtml?.querySelectorAll(CLUE_CLASS)

    const clues: Clue[] = []

    if (categoryElements && clueElements) {
        const categoriesText: string[] = []

        for (const category of categoryElements) {
            categoriesText.push(category.innerHTML)
        }

        for (const [index, clue] of clueElements.entries()) {
            const rawAnswer = clue.querySelector(CORRECT_RESPONSE)
                ?.innerHTML as string
            const answer = sanitizeText(rawAnswer)
            const rawClueText = clue.querySelector(CLUE_TEXT)
                ?.innerHTML as string
            const clueText = sanitizeText(rawClueText)
            const rawValue = clue.querySelector(CLUE_VALUE)?.innerHTML as string
            const value = sanitizeValue(rawValue)
            const category = categoriesText[index % 6]
            const newClue: Clue = {
                answer,
                clueText,
                value: Number(value),
                category,
                showNumber: Number(showNumber),
                airdate,
            }
            const isValid = isValidClue(newClue)

            if (!isValid) continue

            clues.push(newClue)
        }
    }

    return clues
}

/**
 * Check if the clue is one we want to save. We don't save music, video, image, or any other clues that don't make sense
 * in a text based context.
 */
function isValidClue({
    answer,
    clueText,
    value,
    category,
    showNumber,
    airdate,
}: Clue): boolean {
    if (
        !answer ||
        answer.includes('----') ||
        answer == '=' ||
        !clueText ||
        clueText === 'null' ||
        clueText.trim() === '' ||
        clueText == '=' ||
        clueText.includes('video clue') ||
        clueText.includes('audio clue') ||
        clueText.includes('seen here') ||
        clueText.includes('.mp3') ||
        clueText.includes('.mp4') ||
        clueText.includes('.jpg') ||
        !value ||
        !category ||
        !showNumber ||
        !airdate
    ) {
        return false
    }

    return true
}

/**
 * Fetch a game from J-Archive.
 */
async function fetchPageHtml(gameId: number): Promise<string> {
    const page = await axios({
        method: 'GET',
        url: `${JEOPARDY_ARCHIVE_URL}?game_id=${gameId}`,
    })

    if (page.status === 200) {
        return page.data
    }

    return ''
}

/**
 * Remove special characters from text.
 */
function sanitizeText(text: string): string {
    if (text) {
        text = text
            .replaceAll('&amp;', '&')
            .replace(HTML_REGEX, '')
            .toLowerCase()
            .trim()
        text = removeAccents(text)
    }

    return text
}

/**
 * Remove special characters and daily double symbol from dollar value.
 */
function sanitizeValue(value: string): string {
    if (value) {
        value = value.replace('$', '').replace('DD:', '').trim()
    }

    return value
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
