import express from 'express'
import cors from 'cors'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { notFoundHandler } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiRouter } from './routes/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serverRoot = join(__dirname, '..')

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  )
  app.use(express.json({ limit: '1mb' }))

  app.use('/uploads', express.static(join(serverRoot, 'uploads')))

  app.use('/api', apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
