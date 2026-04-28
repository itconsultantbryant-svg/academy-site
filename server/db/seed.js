import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDatabase, closeDatabase } from './connection.js'
import { User } from './orm.js'

const isProd = (process.env.NODE_ENV ?? 'development') === 'production'
const emailRaw =
  process.env.ADMIN_EMAIL || (isProd ? '' : 'admin@prinstineacademy.org')
const password = process.env.ADMIN_PASSWORD || (isProd ? '' : 'Admin@PrinstineAcademy2026')
const email = emailRaw.trim().toLowerCase()

async function main() {
  await connectDatabase()
  if (isProd && (!email || !password)) {
    console.error(
      'Refusing to seed in production without ADMIN_EMAIL and ADMIN_PASSWORD set',
    )
    process.exit(1)
  }
  const existing = await User.findByEmail(email)
  if (existing) {
    console.log('Admin user already exists:', email)
    await closeDatabase()
    return
  }
  const hash = await bcrypt.hash(password, 10)
  await User.create({ email, password: hash, role: 'admin' })
  console.log('Seeded admin user:', email)
  await closeDatabase()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
