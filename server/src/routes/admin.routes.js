import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listSubscribers } from '../controllers/subscriberController.js'
import { listRegistrations } from '../controllers/registrationController.js'

/**
 * All routes under `/api/admin` require a valid JWT and `role: "admin"`.
 */
export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)

adminRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    res.json({ user: req.user })
  })
)

adminRouter.get('/subscribers', listSubscribers)
adminRouter.get('/registrations', listRegistrations)
