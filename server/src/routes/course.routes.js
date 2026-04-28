import { Router } from 'express'
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { courseImageOptional } from '../middleware/uploadImage.js'

const router = Router()

function withOptionalCourseImage(req, res, next) {
  if (req.is('application/json')) {
    return next()
  }
  return courseImageOptional(req, res, next)
}

router.get('/', listCourses)
router.get('/:id', getCourse)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  withOptionalCourseImage,
  createCourse
)
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  withOptionalCourseImage,
  updateCourse
)
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  deleteCourse
)

export const courseRouter = router
