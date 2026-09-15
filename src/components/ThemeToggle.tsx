'use client'

import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'one-voize-theme'

// The <html data-theme> attribute is the single source of truth. The inline
// script in layout.tsx sets it before first paint, so the server snapshot
// (light) never causes a visible flash or a hydration mismatch.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
const getSnapshot = () => document.documentElement.dataset.theme === 'dark'
const getServerSnapshot = () => false

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggleTheme() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  const label = dark ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={label} title={label}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
