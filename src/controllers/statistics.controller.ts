import { HttpStatusCode } from 'axios'
import { Router } from 'express'

const router = Router()

router.get('/leaderboard/:id', async (req, res) => {
    res.status(HttpStatusCode.NotImplemented).json({
        status: 'error',
        message: 'not implemented',
    })
})

module.exports = router
