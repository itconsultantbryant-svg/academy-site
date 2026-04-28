import { AppError } from '../lib/AppError.js'
import { env } from '../config/env.js'

/**
 * @param {unknown} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = 500
  if (typeof err === 'object' && err && 'code' in err) {
    const code = /** @type {{ code?: string }} */ (err).code
    if (code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: { message: 'File too large (max 5MB)' },
      })
    }
  }
  if (err instanceof AppError) {
    status = err.statusCode
  } else if (typeof err === 'object' && err) {
    const o = /** @type {{ statusCode?: number, status?: number }} */ (err)
    if (typeof o.statusCode === 'number') {
      status = o.statusCode
    } else if (typeof o.status === 'number') {
      status = o.status
    }
  }
  if (status < 400 || status > 599) {
    status = 500
  }

  const message = err instanceof Error ? err.message : 'Internal Server Error'
  if (status >= 500) {
    console.error(err)
  }

  const body = {
    error: {
      message: status === 500 && !env.isDev ? 'Internal Server Error' : message,
    },
  }
  if (env.isDev && status >= 500 && err instanceof Error && err.stack) {
    body.error.stack = err.stack
  }
  res.status(status).json(body)
}
