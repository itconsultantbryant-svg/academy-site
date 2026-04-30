const STORAGE_KEY = 'prinstine_pending_registrations_v1'
const MAX_ITEMS = 40

function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeQueue(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota / private mode */
  }
}

/**
 * Persist a registration payload when the live POST could not complete (offline, timeout, etc.).
 * Flushed automatically on next visit / when the browser goes online.
 */
export function enqueuePendingRegistration(payload) {
  const list = readQueue()
  list.push({ payload, enqueuedAt: Date.now() })
  if (list.length > MAX_ITEMS) {
    list.splice(0, list.length - MAX_ITEMS)
  }
  writeQueue(list)
}

/**
 * @param {(data: object) => Promise<unknown>} submitFn same contract as `submitRegistration`
 */
export async function flushPendingRegistrations(submitFn) {
  const items = readQueue()
  if (items.length === 0) return
  const failed = []
  for (const item of items) {
    if (!item?.payload || typeof item.payload !== 'object') continue
    try {
      await submitFn(item.payload)
    } catch {
      failed.push(item)
    }
  }
  writeQueue(failed)
}
