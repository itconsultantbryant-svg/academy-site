import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from '../db/connection.js'
import { User } from '../db/orm.js'

async function ensureAdminAccess() {
  const email = (process.env.ADMIN_EMAIL || 'admin@prinstineacademy.org').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'Admin@PrinstineAcademy2026'
  const existing = await User.findByEmail(email)
  if (existing) return
  const hash = await bcrypt.hash(password, 10)
  await User.create({ email, password: hash, role: 'admin' })
}

const app = createApp()
await connectDatabase()
await ensureAdminAccess()
app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`)
})
