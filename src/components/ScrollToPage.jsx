import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export function ScrollToPage() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    const scroll = () => {
      const target = document.getElementById(hash.slice(1))
      if (!target) return false
      target.scrollIntoView({ block: 'start' })
      return true
    }
    if (scroll()) return
    const observer = new MutationObserver(() => { if (scroll()) observer.disconnect() })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname, hash])
  return null
}
