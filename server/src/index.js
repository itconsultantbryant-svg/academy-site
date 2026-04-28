import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { validateProductionBoot } from './config/validateProduction.js'
import { connectDatabase } from '../db/connection.js'
import { User } from '../db/orm.js'

async function ensureAdminAccess() {
  const isProd = env.isProduction
  const emailRaw =
    process.env.ADMIN_EMAIL || (isProd ? '' : 'admin@prinstineacademy.org')
  const password = process.env.ADMIN_PASSWORD || (isProd ? '' : 'Admin@PrinstineAcademy2026')
  const email = emailRaw.trim().toLowerCase()
  if (!email || !password) {
    if (isProd) {
      console.warn(
        '[boot] Skipping admin creation: set ADMIN_EMAIL and ADMIN_PASSWORD to provision the first admin user',
      )
    }
    return
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
app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`)
})
