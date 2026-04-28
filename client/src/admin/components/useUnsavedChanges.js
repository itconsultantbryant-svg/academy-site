import { useEffect } from 'react'

export function useUnsavedChanges(hasChanges) {
  useEffect(() => {
    window.__adminHasUnsavedChanges = Boolean(hasChanges)

    function onBeforeUnload(event) {
      if (!hasChanges) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.__adminHasUnsavedChanges = false
    }
  }, [hasChanges])
}

export function useSaveShortcut(onSave, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    function onKeyDown(event) {
      const isSave = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's'
      if (!isSave) return
      event.preventDefault()
      onSave()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, onSave])
}
