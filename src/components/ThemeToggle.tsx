'use client'

import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { springConfig, tapScale } from '@/lib/motion'

const STORAGE_KEY = 'one-voize-theme'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
const getSnapshot = () => document.documentElement.dataset.theme === 'dark'
const getServerSnapshot = () => false

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const shouldReduce = useReducedMotion()

  function toggleTheme() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  const label = dark ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={shouldReduce ? {} : tapScale}
      className="theme-toggle"
      aria-label={label}
      title={label}
    >
      <motion.div
        key={dark ? 'dark' : 'light'}
        initial={shouldReduce ? false : { rotate: -35, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 35, opacity: 0, scale: 0.7 }}
        transition={springConfig.snappy}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </motion.button>
  )
}
