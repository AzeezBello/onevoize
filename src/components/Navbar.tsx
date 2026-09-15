'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileNav } from '@/components/MobileNav'

/** Routes that open with a dark hero, where the navbar can stay transparent at the top. */
const heroRoutes = ['/', '/about', '/gallery', '/exco', '/committee']

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const hasHero = heroRoutes.some((route) => (route === '/' ? pathname === '/' : pathname.startsWith(route)))
  const solid = scrolled || !hasHero

  return (
    <header className={`site-navbar ${solid ? 'is-solid' : ''}`}>
      <div className="container site-navbar-inner">
        <Link href="/" aria-label="One Voize Friends Club of Lagos home" className="site-logo">
          <Image src="/images/ONE VOICE LOGO 1.png" alt="One Voize Friends Club of Lagos logo" width={118} height={37} priority />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} href="/">Home</Link>
          <details className="nav-dropdown">
            <summary className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About us</summary>
            <div className="nav-dropdown-menu">
              <Link href="/about#about-us">About us</Link>
              <Link href="/about#exco-members">Exco / members</Link>
              <Link href="/about#club-committee">Club committee</Link>
            </div>
          </details>
          <Link className={`nav-link ${isActive('/gallery') ? 'active' : ''}`} href="/gallery">Gallery</Link>
          <Link className={`nav-link ${isActive('/membership') ? 'active' : ''}`} href="/membership">Join us</Link>
          <Link className="btn btn-primary" href="/donate">Donate</Link>
          <ThemeToggle />
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}
