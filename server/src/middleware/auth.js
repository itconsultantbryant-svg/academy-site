import { AppError } from '../lib/AppError.js'
import { verifyAccessToken } from '../lib/jwt.js'

/**
 * Requires `Authorization: Bearer <token>`. Sets `req.user`.
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401))
  }
  const token = header.slice(7).trim()
  if (!token) {
    return next(new AppError('Authentication required', 401))
  }
  try {
    const payload = verifyAccessToken(token)
    const sub = Number.parseInt(/** @type {string} */ (payload.sub), 10)
    if (!Number.isFinite(sub)) {
      return next(new AppError('Invalid or expired token', 401))
    }
    req.user = {
      id: sub,
      email: String(payload.email ?? ''),
      role: String(payload.role ?? ''),
    }
    return next()
  } catch {
    return next(new AppError('Invalid or expired token', 401))
  }
}

/**
 * Must run after `requireAuth` (or another middleware that sets `req.user`).
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function requireAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403))
  }
  return next()
}
