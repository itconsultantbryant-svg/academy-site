import { Post } from '../../db/orm.js'
import { AppError } from '../lib/AppError.js'
import { removeUploadedAsset, uploadImageFile } from '../lib/mediaStorage.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

/**
 * `content` is stored as plain text and can contain rich-text HTML/Markdown.
 * Render it in the frontend editor/viewer as needed.
 * @param {Record<string, unknown>} row
 */
function postToDto(row) {
  return {
    id: Number(row.id),
    title: String(row.title),
    content: row.content == null ? '' : String(row.content),
    image: row.image == null || row.image === '' ? null : String(row.image),
    author: {
      id: Number(row.author_id),
      email: row.author_email == null ? null : String(row.author_email),
      role: row.author_role == null ? null : String(row.author_role),
    },
  }
}

/**
 * @param {import('express').Request} req
 * @param {boolean} isCreate
 */
function parsePostBody(req, isCreate) {
  const b =
    req.body && typeof req.body === 'object'
      ? /** @type {Record<string, unknown>} */ (req.body)
      : {}
  const titleRaw = b.title
  const title =
    typeof titleRaw === 'string' ? titleRaw.trim() : String(titleRaw ?? '').trim()
  const contentRaw = b.content
  if (isCreate && !title) {
    throw new AppError('title is required', 400)
  }
  if (isCreate && typeof contentRaw !== 'string') {
    throw new AppError('content is required (rich text string)', 400)
  }
  return {
    hasTitle: b.title !== undefined,
    title,
    hasContent: b.content !== undefined,
    content:
      contentRaw == null
        ? ''
        : typeof contentRaw === 'string'
          ? contentRaw
          : String(contentRaw),
  }
}

export const listPosts = asyncHandler(async (_req, res) => {
  const rows = await Post.listWithAuthor()
  res.json({ posts: rows.map((r) => postToDto(r)) })
})

export const getPost = asyncHandler(async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (!Number.isFinite(id) || id < 1) {
    throw new AppError('Invalid id', 400)
  }
  const row = await Post.findWithAuthor(id)
  if (!row) {
    throw new AppError('Post not found', 404)
  }
  res.json({ post: postToDto(row) })
})

export const createPost = asyncHandler(async (req, res) => {
  const body = parsePostBody(req, true)
  const imagePath = req.file
    ? (await uploadImageFile(req.file, { folder: 'posts' })).url
    : null
  const row = await Post.create({
    title: body.title,
    content: body.content,
    image: imagePath,
    authorId: req.user.id,
  })
  if (!row) {
    throw new AppError('Could not create post', 500)
  }
  const full = await Post.findWithAuthor(Number(row.id))
  res.status(201).json({ post: postToDto(full) })
})

export const updatePost = asyncHandler(async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (!Number.isFinite(id) || id < 1) {
    throw new AppError('Invalid id', 400)
  }
  const existing = await Post.findById(id)
  if (!existing) {
    throw new AppError('Post not found', 404)
  }
  const body = parsePostBody(req, false)
  let title = String(existing.title)
  if (body.hasTitle) {
    if (!body.title) {
      throw new AppError('title cannot be empty', 400)
    }
    title = body.title
  }
  let content = existing.content == null ? '' : String(existing.content)
  if (body.hasContent) {
    content = body.content
  }
  let image =
    existing.image == null || existing.image === '' ? null : String(existing.image)
  if (req.file) {
    if (image) {
      await removeUploadedAsset(image)
    }
    image = (await uploadImageFile(req.file, { folder: 'posts' })).url
  } else {
    const strip =
      req.body &&
      (req.body.remove_image === 'true' ||
        req.body.remove_image === true ||
        req.body.removeImage === 'true' ||
        req.body.removeImage === true)
    if (strip) {
      await removeUploadedAsset(image)
      image = null
    }
  }
  const updated = await Post.update(id, { title, content, image })
  if (!updated) {
    throw new AppError('Could not update post', 500)
  }
  const full = await Post.findWithAuthor(id)
  res.json({ post: postToDto(full) })
})

export const deletePost = asyncHandler(async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (!Number.isFinite(id) || id < 1) {
    throw new AppError('Invalid id', 400)
  }
  const existing = await Post.findById(id)
  if (!existing) {
    throw new AppError('Post not found', 404)
  }
  if (existing.image) {
    await removeUploadedAsset(String(existing.image))
  }
  const ok = await Post.deleteById(id)
  if (!ok) {
    throw new AppError('Could not delete post', 500)
  }
  res.status(204).send()
})
