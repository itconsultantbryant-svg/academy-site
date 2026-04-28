import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

let warnedInsecure = false

function getSecret() {
  if (env.jwtSecret) {
    return env.jwtSecret
  }
  if (env.isDev) {
    if (!warnedInsecure) {
      warnedInsecure = true
      console.warn(
        '[auth] JWT_SECRET is missing; using insecure dev default. Set JWT_SECRET in .env',
      )
    }
    return '__insecure_dev_only__'
  }
  throw new Error('JWT_SECRET is required in production')
}

/**
 * @param {{ id: number, email: string, role: string }} user
 * @returns {string}
 */
export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    },
    getSecret(),
    { expiresIn: env.jwtExpiresIn }
  )
}

/**
 * @param {string} token
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, getSecret())
}
