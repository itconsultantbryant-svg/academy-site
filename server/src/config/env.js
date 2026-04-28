/**
 * Centralized environment. Load `import 'dotenv/config'` in `index.js` before other local imports.
 */
function parseCorsOrigin() {
  const raw = process.env.CORS_ORIGIN
  if (raw == null || raw === '') {
    return true
  }
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (list.length === 0) {
    return true
  }
  if (list.length === 1) {
    return list[0]
  }
  return list
}

const port = Number.parseInt(process.env.PORT ?? '3000', 10)
const nodeEnv = process.env.NODE_ENV ?? 'development'

export const env = {
  port: Number.isFinite(port) ? port : 3000,
  nodeEnv,
  isDev: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  /** `true` = reflect request origin, `string` or `string[]` = allowed origins (cors) */
  corsOrigin: parseCorsOrigin(),
  databaseUrl: process.env.DATABASE_URL || null,
  sqlitePath: process.env.SQLITE_PATH || null,
  jwtSecret: process.env.JWT_SECRET || '',
  /** e.g. `7d`, `24h` — see jsonwebtoken `expiresIn` */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}
