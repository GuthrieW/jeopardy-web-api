import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { gameModel } from 'src/models/game.model'

const router = Router()

router.post('/speed', async (req, res) => {
    const gameId = req.body.gameId as string
    const newSpeed = req.body.speed as string

    if (!gameId) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Please provide a game ID',
        })
        return
    }

    if (!newSpeed) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Please provide a new game speed',
        })
        return
    }

    const newSpeedNumber = Number(newSpeed)

    if (
        isNaN(newSpeedNumber) ||
        newSpeedNumber < gameModel.DEFAULT_MINIMUM_GAME_SPEED ||
        newSpeedNumber > gameModel.DEFAULT_MAXIMUM_GAME_SPEED
    ) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: `Game speeds must integers between ${gameModel.DEFAULT_MINIMUM_GAME_SPEED} and ${gameModel.DEFAULT_MAXIMUM_GAME_SPEED}.`,
        })
        return
    }

    const result = await gameModel.updateSpeed(Number(newSpeed), gameId)
    if (!result) {
        res.status(HttpStatusCode.InternalServerError).json({
            status: 'error',
            message: 'Error updating game speed setting',
        })
        return
    }

    res.status(HttpStatusCode.NotImplemented).json({
        status: 'success',
        message: `Game #${gameId} speed set to ${newSpeed}`,
    })
})

router.post('/infinite', async (req, res) => {
    const gameId = req.body.gameId as string
    const infinite = Boolean(req.body.speed) as boolean

    if (!gameId) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: 'Please provide a game ID',
        })
        return
    }

    const infiniteNumber = Number(infinite)

    if (isNaN(infiniteNumber) && infiniteNumber !== 0 && infiniteNumber !== 1) {
        res.status(HttpStatusCode.BadRequest).json({
            status: 'error',
            message: `Infinite setting must be 1 or 0.`,
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

    res.status(HttpStatusCode.NotImplemented).json({
        status: 'success',
        message: `Game #${gameId} infinite set to ${infinite}`,
    })
})

module.exports = router
