import { answerModel } from 'src/models/answer.model'
import { compareTwoStrings } from 'string-similarity'

class AnswerService {
    private readonly PREPENDED_QUESTION_REGEX =
        /^(what is|what are|whats|what's|where is|where are|wheres|where's|who is|who are|whos|who's|when is|when are|whens|when's|why is|why are|whys|why's) /i
    private readonly USER_ANSWER_REGEX = /\<.*\>/
    private readonly ENGLISH_ARTICLES = ['the', 'a', 'an']
    private readonly ANSWER_PARENTHESES_REGEX = /\(([^)]+)\)/
    private readonly REPLACE_PARENTHESES_REGEX = /[()]/g

    private readonly SIMILARITY_THRESHOLD = 0.6

    evaluateAnswer = async ({
        gameId,
        contestantId,
        clueId,
        userAnswerText,
        correctAnswerText,
    }: {
        gameId: string
        contestantId: string
        clueId: string
        userAnswerText: string
        correctAnswerText: string
    }): Promise<boolean> => {
        const isCorrect = await this.isCorrectAnswer(
            userAnswerText,
            correctAnswerText
        )

        await answerModel.insert({
            gameId,
            contestantId,
            clueId,
            answerText: userAnswerText,
            isCorrect,
        })

        return isCorrect
    }

    isQuestionFormat = (answerText: string): boolean => {
        const isMatch = answerText
            .replace(/[^\w\s]/i, '')
            .match(this.PREPENDED_QUESTION_REGEX)

        return Boolean(isMatch)
    }

    private isCorrectAnswer = (
        userAnswerText: string,
        correctAnswerText: string
    ): boolean => {
        userAnswerText = userAnswerText
            .toLowerCase()
            .replace(this.USER_ANSWER_REGEX, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(this.PREPENDED_QUESTION_REGEX, '')
            .trim()

        correctAnswerText = correctAnswerText.toLowerCase()

        if (this.ANSWER_PARENTHESES_REGEX.test(correctAnswerText)) {
            const matches =
                this.ANSWER_PARENTHESES_REGEX.exec(correctAnswerText)
            const cleanedMatches =
                matches?.map((match) =>
                    match.replace(this.REPLACE_PARENTHESES_REGEX, '')
                ) || []

            if (
                this.isCorrectAnswer(cleanedMatches[0], correctAnswerText) ||
                this.isCorrectAnswer(cleanedMatches[1], correctAnswerText)
            ) {
                return true
            }
        }

        this.ENGLISH_ARTICLES.forEach((article: string) => {
            if (userAnswerText.indexOf(article + ' ') === 0) {
                userAnswerText = userAnswerText.substring(article.length + 1)
            } else if (userAnswerText.indexOf(' ' + article + ' ') === 0) {
                userAnswerText = userAnswerText.substring(article.length + 2)
            } else if (correctAnswerText.indexOf(article + ' ') === 0) {
                correctAnswerText = correctAnswerText.substring(
                    article.length + 1
                )
            } else if (correctAnswerText.indexOf(' ' + article + ' ') === 0) {
                correctAnswerText = correctAnswerText.substring(
                    article.length + 2
                )
            } else {
                return
            }

            if (this.isCorrectAnswer(userAnswerText, correctAnswerText)) {
                return true
            }
        })

        return (
            compareTwoStrings(userAnswerText, correctAnswerText) >
            this.SIMILARITY_THRESHOLD
        )
    }
}

export const answerService = new AnswerService()
