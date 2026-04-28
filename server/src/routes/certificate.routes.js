import { Router } from 'express'
import {
  addCertificate,
  verifyCertificate,
} from '../controllers/certificateController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Public verification endpoint
router.get('/verify', verifyCertificate)

// Admin-managed certificate creation
router.post('/', requireAuth, requireAdmin, addCertificate)

export const certificateRouter = router
