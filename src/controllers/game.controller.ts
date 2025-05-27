import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { clueService } from 'src/services/clue/clue.service'

const router = Router()

router.post('/clue', async (req, res) => {
    const clue = await clueService.getClue()

    if (!clue) {
        throw new Error('Error fetching clue')
    }

    res.status(HttpStatusCode.Ok).json({
        status: 'success',
        payload: clue,
    })
})

router.post('/clue/:id', async (req, res) => {
    res.status(HttpStatusCode.NotImplemented).json({
        status: 'error',
        message: 'not implemented',
    })
})

module.exports = router
