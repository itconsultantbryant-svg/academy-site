import bcrypt from 'bcryptjs'
import { User } from '../../db/orm.js'
import { signAccessToken } from '../lib/jwt.js'
import { AppError } from '../lib/AppError.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

/**
 * @param {unknown} body
 * @returns {{ email: string, password: string }}
 */
function parseLoginBody(body) {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid JSON body', 400)
  }
  const b = /** @type {Record<string, unknown>} */ (body)
  const email = b.email
  const password = b.password
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new AppError('Email and password are required', 400)
  }
  if (!email.trim() || !password) {
    throw new AppError('Email and password are required', 400)
  }
  return { email: email.trim().toLowerCase(), password }
}

export const postLogin = asyncHandler(async (req, res) => {
  const { email, password } = parseLoginBody(req.body)
  const user = await User.findByEmail(email)
  if (!user || typeof user.password !== 'string') {
    throw new AppError('Invalid email or password', 401)
  }
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    throw new AppError('Invalid email or password', 401)
  }
  const role = String(user.role)
  const id = Number(user.id)
  const token = signAccessToken({ id, email: String(user.email), role })
  res.json({
    token,
    user: { id, email: String(user.email), role },
  })
})

export const getSession = asyncHandler(async (req, res) => {
  res.json({ user: req.user })
})
