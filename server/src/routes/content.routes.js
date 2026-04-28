import { Router } from 'express'
import {
  getSectionContent,
  putSectionContent,
  putSectionImage,
} from '../controllers/contentController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { heroImageOptional } from '../middleware/uploadImage.js'

const router = Router()

router.get('/:section', getSectionContent)
router.put('/:section', requireAuth, requireAdmin, putSectionContent)
router.put(
  '/:section/image',
  requireAuth,
  requireAdmin,
  heroImageOptional,
  putSectionImage
)

export const contentRouter = router
