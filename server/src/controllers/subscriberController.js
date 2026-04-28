import { Subscriber } from '../../db/orm.js'
import { AppError } from '../lib/AppError.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

function parseSubscriberBody(body) {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid JSON body', 400)
  }
  const b = /** @type {Record<string, unknown>} */ (body)
  const name = String(b.name ?? '').trim()
  const email = String(b.email ?? '').trim().toLowerCase()

  if (!name || !email) {
    throw new AppError('Name and email are required', 400)
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    throw new AppError('Provide a valid email address', 400)
  }
  return { name, email }
}

export const createSubscriber = asyncHandler(async (req, res) => {
  const payload = parseSubscriberBody(req.body)
  try {
    const created = await Subscriber.create(payload)
    res.status(201).json({
      message: 'Subscription received',
      subscriber: created,
    })
  } catch (e) {
    if (String(e?.message || '').toLowerCase().includes('unique')) {
      throw new AppError('This email is already subscribed', 409)
    }
    throw e
  }
})

export const listSubscribers = asyncHandler(async (_req, res) => {
  const rows = await Subscriber.list()
  res.json(rows)
})
