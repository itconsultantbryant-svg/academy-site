import { mkdirSync, existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import sqlite3mod from 'sqlite3'

const __dirname = dirname(fileURLToPath(import.meta.url))

const Database = sqlite3mod.Database
const OPEN_READWRITE = sqlite3mod.OPEN_READWRITE
const OPEN_CREATE = sqlite3mod.OPEN_CREATE

let pool
let sqliteDb
let dialect = 'sqlite'

function toPostgresParams(sql, params = []) {
  if (!params.length) {
    return [sql, []]
  }
  let n = 0
  const text = sql.replace(/\?/g, () => `$${++n}`)
  return [text, params]
}

function sqliteQuery(db, sql, params) {
  const trimmed = sql.trim()
  const isSelect = /^\s*select/i.test(trimmed)
  const hasReturning = /\breturning\b/i.test(sql)
  if (isSelect) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve({ rows: rows || [], rowCount: (rows || []).length })
      })
    })
  }
  if (hasReturning) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve({ rows: row ? [row] : [], rowCount: row ? 1 : 0 })
      })
    })
  }
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err)
      else resolve({ rows: [], rowCount: this.changes })
    })
  })
}

/**
 * @param {string} sql  Use `?` placeholders (works for both engines).
 * @param {unknown[]} [params]
 * @returns {Promise<{ rows: Record<string, unknown>[], rowCount: number }>}
 */
export async function query(sql, params = []) {
  if (dialect === 'postgres') {
    const [text, values] = toPostgresParams(sql, params)
    const r = await pool.query(text, values)
    return { rows: r.rows, rowCount: r.rowCount ?? 0 }
  }
  return sqliteQuery(sqliteDb, sql, params)
}

export function getDialect() {
  return dialect
}

/**
 * JSON column: object on Postgres, string on SQLite; normalize to object.
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function parseJsonContent(value) {
  if (value == null) {
    return {}
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return /** @type {Record<string, unknown>} */ (value)
  }
  if (typeof value === 'string') {
    try {
      return /** @type {Record<string, unknown>} */ (JSON.parse(value))
    } catch {
      return {}
    }
  }
  return {}
}

/**
 * @returns {string} For inserts: dialect-specific JSON literal handling is done in SQL or stringify for SQLite.
 */
export function serializeJsonForDb(obj) {
  if (dialect === 'postgres') {
    return JSON.stringify(obj ?? {})
  }
  return JSON.stringify(obj ?? {})
}

/**
 * @param {object} [options]
 * @param {string} [options.databaseUrl]  Defaults to process.env.DATABASE_URL
 * @param {string} [options.sqlitePath]  Defaults to process.env.SQLITE_PATH or data/app.db under server
 */
export async function connectDatabase(options = {}) {
  if (pool) {
    return { dialect: 'postgres' }
  }
  if (sqliteDb) {
    const serverRoot = join(__dirname, '..')
    return {
      dialect: 'sqlite',
      path:
        process.env.SQLITE_PATH ?? join(serverRoot, 'data', 'app.db'),
    }
  }
  const databaseUrl = options.databaseUrl ?? process.env.DATABASE_URL
  if (databaseUrl) {
    dialect = 'postgres'
    pool = new pg.Pool({ connectionString: databaseUrl })
    const c = await pool.connect()
    c.release()
    return { dialect: 'postgres' }
  }
  dialect = 'sqlite'
  const serverRoot = join(__dirname, '..')
  const defaultSqlite = join(serverRoot, 'data', 'app.db')
  const sqlitePath = options.sqlitePath ?? process.env.SQLITE_PATH ?? defaultSqlite
  const dir = dirname(sqlitePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  await new Promise((resolve, reject) => {
    const db = new Database(sqlitePath, OPEN_READWRITE | OPEN_CREATE, (err) => {
      if (err) {
        reject(err)
        return
      }
      db.run('PRAGMA foreign_keys = ON', (e) => {
        if (e) {
          db.close()
          reject(e)
          return
        }
        sqliteDb = db
        resolve(null)
      })
    })
  })
  return { dialect: 'sqlite', path: sqlitePath }
}

export async function closeDatabase() {
  if (dialect === 'postgres' && pool) {
    await pool.end()
    pool = undefined
  }
  if (dialect === 'sqlite' && sqliteDb) {
    await new Promise((resolve, reject) => {
      sqliteDb.close((err) => (err ? reject(err) : resolve(null)))
    })
    sqliteDb = undefined
  }
}

function splitPostgresStatements(sql) {
  const noComments = sql.replace(/--[^\n]*/g, '')
  return noComments
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Run a full schema script (create tables). For PostgreSQL, splits on `;`.
 */
export async function runSchemaScript(sql) {
  if (dialect === 'postgres') {
    const client = await pool.connect()
    try {
      const statements = splitPostgresStatements(sql)
      await client.query('BEGIN')
      for (const st of statements) {
        await client.query(st)
      }
      await client.query('COMMIT')
    } catch (e) {
      try {
        await client.query('ROLLBACK')
      } catch {
        // ignore
      }
      throw e
    } finally {
      client.release()
    }
    return
  }
  if (!sqliteDb) {
    throw new Error('SQLite not connected')
  }
  await new Promise((resolve, reject) => {
    sqliteDb.exec(sql, (err) => (err ? reject(err) : resolve(null)))
  })
}

/**
 * Load and apply the bundled schema for the current dialect.
 */
export async function applyBundledSchema() {
  const file =
    getDialect() === 'postgres' ? 'schema.postgres.sql' : 'schema.sqlite.sql'
  const p = join(__dirname, file)
  const sql = readFileSync(p, 'utf8')
  await runSchemaScript(sql)
}
