import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { clueModel } from 'src/models/clue.model'
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
        isCorrect: z.boolean(),
    })

    const query = zQuery.safeParse(req.query)
    const body = zBody.safeParse(req.body)

    if (query.error || body.error) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Maformed request',
        })
        return
    }

    res.status(HttpStatusCode.NotImplemented).json({
        status: 'error',
        message: 'not implemented',
    })
})

module.exports = router
