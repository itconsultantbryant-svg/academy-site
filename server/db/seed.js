import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDatabase, closeDatabase } from './connection.js'
import { User } from './orm.js'

const emailRaw = process.env.ADMIN_EMAIL || 'admin@prinstineacademy.org'
const password = process.env.ADMIN_PASSWORD || 'Admin@PrinstineAcademy2026'
const email = emailRaw.trim().toLowerCase()

async function main() {
  await connectDatabase()
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
