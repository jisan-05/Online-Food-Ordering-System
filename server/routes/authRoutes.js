import { Router } from 'express'
import { createJwtToken, getCurrentUser } from '../controllers/authController.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.post('/jwt', createJwtToken)
router.get('/me', verifyJwt, getCurrentUser)

export default router
