import { Router } from 'express'
import { createSubscriber } from '../controllers/subscriberController.js'

export const subscriberRouter = Router()

subscriberRouter.post('/', createSubscriber)
