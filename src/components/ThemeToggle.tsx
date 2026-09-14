'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(() => typeof window !== 'undefined' && (window.localStorage.getItem('one-voize-theme') === 'dark' || (!window.localStorage.getItem('one-voize-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)))

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    window.localStorage.setItem('one-voize-theme', next ? 'dark' : 'light')
  }

  return <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
}
