import { Router } from 'express'
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { postImageOptional } from '../middleware/uploadImage.js'

const router = Router()

function withOptionalPostImage(req, res, next) {
  if (req.is('application/json')) {
    return next()
  }
  return postImageOptional(req, res, next)
}

router.get('/', listPosts)
router.get('/:id', getPost)
router.post('/', requireAuth, requireAdmin, withOptionalPostImage, createPost)
router.put('/:id', requireAuth, requireAdmin, withOptionalPostImage, updatePost)
router.delete('/:id', requireAuth, requireAdmin, deletePost)

export const postRouter = router
