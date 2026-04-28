import { asyncHandler } from '../middleware/asyncHandler.js'
import { env } from '../config/env.js'

export const getHealth = asyncHandler(async (_req, res) => {
  res.json({
    ok: true,
    service: 'server',
    environment: env.nodeEnv,
  })
})
