import { useEffect } from 'react'

const SCRIPT_ID = 'structured-data-json-ld'

export default function useStructuredData(schema) {
  useEffect(() => {
    if (!schema) return undefined

    let script = document.getElementById(SCRIPT_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }

    script.textContent = JSON.stringify(schema)

    return () => {
      const current = document.getElementById(SCRIPT_ID)
      if (current) current.remove()
    }
  }, [schema])
}
