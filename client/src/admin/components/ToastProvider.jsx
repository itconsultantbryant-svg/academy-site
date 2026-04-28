import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)

let seq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message, type = 'info', duration = 2600) => {
    const id = seq++
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      dismiss(id)
    }, duration)
  }, [dismiss])

  const api = useMemo(
    () => ({
      show,
      success: (msg) => show(msg, 'success'),
      error: (msg) => show(msg, 'error', 3600),
      info: (msg) => show(msg, 'info'),
    }),
    [show]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] grid gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={[
                'pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-soft backdrop-blur',
                toast.type === 'success'
                  ? 'border-emerald-300/40 bg-emerald-500/20 text-emerald-100'
                  : toast.type === 'error'
                    ? 'border-rose-300/40 bg-rose-500/20 text-rose-100'
                    : 'border-cyan-300/40 bg-cyan-500/20 text-cyan-100',
              ].join(' ')}
            >
              <div className="flex items-start gap-2">
                <p>{toast.message}</p>
                <button
                  type="button"
                  className="rounded px-1 text-xs opacity-80 hover:opacity-100"
                  onClick={() => dismiss(toast.id)}
                >
                  x
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return ctx
}
