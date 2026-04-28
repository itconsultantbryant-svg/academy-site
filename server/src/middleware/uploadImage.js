import multer from 'multer'
import { AppError } from '../lib/AppError.js'

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (allowed.has(file.mimetype)) return cb(null, true)
    return cb(
      new AppError('Invalid file type. Allowed: JPEG, PNG, WebP, GIF', 400)
    )
  },
})

export const courseImageOptional = upload.single('image')
export const postImageOptional = upload.single('image')
export const heroImageOptional = upload.single('image')
