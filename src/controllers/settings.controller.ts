import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { gameModel } from 'src/models/game.model'
import { z } from 'zod'

const router = Router()

router.post('/speed', async (req, res) => {
    const zBody = z.object({
        gameId: z.string(),
        speed: z.number(),
    })

    const update = zBody.safeParse(req.body)
    if (update.error) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Malformed request body',
        })
        return
    }

    const { gameId, speed } = update.data

    if (
        isNaN(speed) ||
        speed < gameModel.DEFAULT_MINIMUM_GAME_SPEED ||
        speed > gameModel.DEFAULT_MAXIMUM_GAME_SPEED
    ) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: `Game speeds must integers between ${gameModel.DEFAULT_MINIMUM_GAME_SPEED} and ${gameModel.DEFAULT_MAXIMUM_GAME_SPEED}.`,
        })
        return
    }

    const result = await gameModel.updateSpeed(Number(speed), gameId)
    if (!result) {
        res.status(HttpStatusCode.InternalServerError).json({
            status: 'error',
            message: 'Error updating game speed setting',
        })
        return
    }

    res.status(HttpStatusCode.Ok).json({
        status: 'success',
        message: `Game #${gameId} speed set to ${speed}`,
    })
})

router.post('/infinite', async (req, res) => {
    const zUpdate = z.object({
        gameId: z.string(),
        infinite: z.boolean(),
    })

    const update = zUpdate.safeParse(req.body)
    if (update.error) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Malformed request body',
        })
        return
    }

    const { gameId, infinite } = update.data

    const infiniteNumber = Number(infinite)

    if (isNaN(infiniteNumber) && infiniteNumber !== 0 && infiniteNumber !== 1) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: `Infinite setting must be true or false.`,
        })
        return
    }

    const result = await gameModel.updateInfinite(infiniteNumber, gameId)
    if (!result) {
        res.status(HttpStatusCode.InternalServerError).json({
            status: 'error',
            message: 'Error updating game infinite setting',
        })
        return
    }

    res.status(HttpStatusCode.Ok).json({
        status: 'success',
        message: `Game #${gameId} infinite set to ${infinite}`,
    })
})

module.exports = router
