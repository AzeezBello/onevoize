'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

const links = [
  ['Home', '/'],
  ['About us', '/about'],
  ['Exco / members', '/exco'],
  ['Club committee', '/committee'],
  ['Gallery / past events / videos', '/gallery'],
  ['Membership form', '/membership'],
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return <div className="mobile-nav-wrap">
    <button type="button" className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open}>
      {open ? <X size={22}/> : <Menu size={22}/>} 
    </button>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">
      {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <div className="mobile-nav-actions"><ThemeToggle/><Link href="/donate" className="btn btn-primary" onClick={() => setOpen(false)}>Donation / support / pay dues</Link></div>
    </nav>}
  </div>
}
