import {
  connectDatabase,
  applyBundledSchema,
  closeDatabase,
  getDialect,
} from './connection.js'

async function main() {
  await connectDatabase()
  await applyBundledSchema()
  console.log(`Migrations applied (${getDialect()})`)
  await closeDatabase()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
