import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { validateProductionBoot } from './config/validateProduction.js'
import { connectDatabase, getDialect } from '../db/connection.js'
import { User } from '../db/orm.js'

async function ensureAdminAccess() {
  const defaultEmail = 'admin@prinstineacademy.org'
  const defaultPassword = 'Admin@PrinstineAcademy2026'
  const emailRaw = process.env.ADMIN_EMAIL || defaultEmail
  const password = process.env.ADMIN_PASSWORD || defaultPassword
  const email = emailRaw.trim().toLowerCase()
  if (env.isProduction && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
    console.warn(
      '[boot] ADMIN_EMAIL / ADMIN_PASSWORD not fully set; using default admin credentials. Set both env vars to override.',
    )
  }
  const existing = await User.findByEmail(email)
  if (existing) return
  const hash = await bcrypt.hash(password, 10)
  await User.create({ email, password: hash, role: 'admin' })
}

validateProductionBoot()
const app = createApp()
await connectDatabase()
await ensureAdminAccess()
const corsOrigins =
  env.corsOrigin === true
    ? ['* (reflect request origin)']
    : Array.isArray(env.corsOrigin)
      ? env.corsOrigin
      : [env.corsOrigin]
console.log(
  `[boot] env=${env.nodeEnv} db=${getDialect()} cors=${corsOrigins.join(', ')}`,
)
app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`)
})
