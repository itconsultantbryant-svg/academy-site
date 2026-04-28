import { AppError } from '../lib/AppError.js'

/**
 * 404 for unmatched routes. Mount after all routers.
 * @param {import('express').Request} _req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function notFoundHandler(_req, _res, next) {
  next(new AppError('Not found', 404))
}
