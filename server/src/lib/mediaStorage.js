import { mkdir, unlink, writeFile } from 'fs/promises'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import { v2 as cloudinary } from 'cloudinary'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serverRoot = join(__dirname, '../..')
const uploadDir = join(serverRoot, 'uploads')

const hasCloudinary =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET)

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

/**
 * @param {string} mimetype
 */
function extFromMimetype(mimetype) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  }
  return map[mimetype] || '.img'
}

/**
 * @param {Express.Multer.File} file
 * @param {{ folder: string }} options
 * @returns {Promise<{ url: string }>}
 */
export async function uploadImageFile(file, options) {
  if (!file) {
    throw new Error('file is required')
  }
  if (hasCloudinary) {
    const folder = options.folder || 'uploads'
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          use_filename: false,
          unique_filename: true,
        },
        (err, uploaded) => {
          if (err) reject(err)
          else resolve(uploaded)
        }
      )
      stream.end(file.buffer)
    })
    return { url: result.secure_url }
  }

  await mkdir(uploadDir, { recursive: true })
  const ext = extFromMimetype(file.mimetype)
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`
  const full = join(uploadDir, name)
  await writeFile(full, file.buffer)
  return { url: `/uploads/${name}` }
}

/**
 * Remove uploaded asset for local or cloudinary URL.
 * @param {string | null | undefined} url
 */
export async function removeUploadedAsset(url) {
  if (!url || typeof url !== 'string') return

  if (url.startsWith('/uploads/')) {
    const name = url.split('/').pop()
    if (!name || name.includes('..') || name.includes('/')) return
    const full = join(uploadDir, name)
    if (!full.startsWith(uploadDir)) return
    try {
      await unlink(full)
    } catch {
      // ignore missing file
    }
    return
  }

  if (hasCloudinary && /res\.cloudinary\.com/.test(url)) {
    try {
      const noQuery = url.split('?')[0]
      const marker = '/upload/'
      const i = noQuery.indexOf(marker)
      if (i === -1) return
      const tail = noQuery.slice(i + marker.length)
      const parts = tail.split('/').filter(Boolean)
      if (!parts.length) return
      if (/^v\d+$/.test(parts[0])) {
        parts.shift()
      }
      if (!parts.length) return
      const last = parts[parts.length - 1]
      parts[parts.length - 1] = last.replace(extname(last), '')
      const publicId = parts.join('/')
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
    } catch {
      // ignore cleanup failure
    }
  }
}
