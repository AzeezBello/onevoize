'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Heart } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileNav } from '@/components/MobileNav'
import { Button } from '@/components/ui/button'
import { tapScale } from '@/lib/motion'

/** Routes that open with a dark hero, where the navbar can stay transparent at the top. */
const heroRoutes = ['/', '/about', '/gallery', '/exco', '/committee']

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const hasHero = heroRoutes.some((route) => (route === '/' ? pathname === '/' : pathname.startsWith(route)))
  const solid = scrolled || !hasHero

  if (pathname?.startsWith('/dashboard')) return null

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
              <Link href="/about">About us</Link>
              <Link href="/exco">Exco & Leadership</Link>
              <Link href="/about#club-committee">Club Committee</Link>
            </div>
          </details>
          <Link className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`} href="/campaigns">Campaigns</Link>
          <Link className={`nav-link ${isActive('/events') ? 'active' : ''}`} href="/events">Events</Link>
          <Link className={`nav-link ${isActive('/gallery') ? 'active' : ''}`} href="/gallery">Gallery</Link>
          <Link className={`nav-link ${isActive('/membership') ? 'active' : ''}`} href="/membership">Join us</Link>

          <motion.div whileTap={shouldReduce ? {} : tapScale}>
            <Button asChild size="sm" className="gap-1.5 shadow-sm">
              <Link href="/donate">
                <Heart size={13} className="fill-current" />
                Donate
              </Link>
            </Button>
          </motion.div>

          <ThemeToggle />
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}
