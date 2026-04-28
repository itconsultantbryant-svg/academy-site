import { Router } from 'express'
import { createRegistration } from '../controllers/registrationController.js'

export const registrationRouter = Router()

registrationRouter.post('/', createRegistration)
