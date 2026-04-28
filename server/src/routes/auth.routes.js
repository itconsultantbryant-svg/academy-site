import { Router } from 'express'
import { postLogin, getSession } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = Router()

authRouter.post('/login', postLogin)
/** Any authenticated role (admin, user, …) */
authRouter.get('/me', requireAuth, getSession)
