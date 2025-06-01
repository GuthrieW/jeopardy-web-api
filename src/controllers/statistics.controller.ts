import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { ListOptions } from 'src/models/list-options'
import { statisticModel } from 'src/models/statistic.model'
import { z } from 'zod'

const router = Router()

router.get('/leaderboard', async (req, res) => {
    const zBody = z.object({
        limit: z.number().nullable(),
        offset: z.number().nullable(),
        sort: z.string().nullable(),
        order: z.enum(['ASC', 'DESC']).nullable(),
    })

    const body = zBody.safeParse(req.body)

    if (body.error) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Malformed request',
        })
        return
    }

    const leaderboard = await statisticModel.fetchGlobalLeaderboard(
        new ListOptions(body.data)
    )

    res.status(HttpStatusCode.Ok).json({
        status: 'success',
        payload: leaderboard,
    })
})

router.get('/leaderboard/:id', async (req, res) => {
    const zQuery = z.object({
        id: z.string(),
    })
    const zBody = z.object({
        limit: z.number().nullable(),
        offset: z.number().nullable(),
        sort: z.string().nullable(),
        order: z.enum(['ASC', 'DESC']).nullable(),
    })

    const query = zQuery.safeParse(req.query)
    const body = zBody.safeParse(req.body)

    if (query.error || body.error) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Malformed request',
        })
        return
    }

    const leaderboard = await statisticModel.fetchLeaderboardByGameId(
        query.data.id,
        new ListOptions(body.data)
    )

    res.status(HttpStatusCode.Ok).json({
        status: 'success',
        payload: leaderboard,
    })
})

module.exports = router
