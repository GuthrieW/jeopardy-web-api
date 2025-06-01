import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { clueModel } from 'src/models/clue.model'
import { statisticModel } from 'src/models/statistic.model'
import { answerService } from 'src/services/answer-service'
import { z } from 'zod'

const router = Router()

router.post('/clue/random', async (req, res) => {
    const clue = await clueModel.fetchRandom()

    if (!clue) {
        throw new Error('Error fetching clue')
    }

    res.status(HttpStatusCode.Ok).json({
        status: 'success',
        payload: clue,
    })
})

router.post('/clue/:id', async (req, res) => {
    const zQuery = z.object({
        id: z.string().uuid(),
    })
    const zBody = z.object({
        gameId: z.string().uuid(),
        contestantId: z.string().uuid(),
        answerText: z.string(),
    })

    const query = zQuery.safeParse(req.query)
    const body = zBody.safeParse(req.body)

    if (query.error || body.error) {
        res.status(HttpStatusCode.BadRequest)
            .json({
                status: 'error',
                message: 'Maformed request',
            })
            .end()
        return
    }

    if (!answerService.isQuestionFormat(body.data.answerText)) {
        res.status(HttpStatusCode.BadRequest)
            .json({
                status: 'error',
                message: 'Answer not in question format',
            })
            .end()
        return
    }

    const clue = await clueModel.fetchById(query.data.id)

    if (!clue) {
        res.status(HttpStatusCode.BadRequest)
            .json({
                status: 'error',
                message: 'Clue does not exist',
            })
            .end()
        return
    }

    const isCorrect = await answerService.evaluateAnswer({
        gameId: body.data.gameId,
        contestantId: body.data.contestantId,
        clueId: query.data.id,
        userAnswerText: body.data.answerText,
        correctAnswerText: clue?.answerText,
    })

    const statistic = await statisticModel.upsert({
        gameId: body.data.gameId,
        contestantId: body.data.contestantId,
        value: clue.value,
        isCorrect,
    })

    res.status(HttpStatusCode.NotImplemented).json({
        status: 'success',
        payload: {
            isCorrect,
            statistic,
            clue,
        },
    })
})

module.exports = router
