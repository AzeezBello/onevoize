'use client'

import Link from 'next/link'
import { Menu, X, ArrowRight, Heart } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { springConfig, tapScale } from '@/lib/motion'

const links = [
  ['Home', '/'],
  ['About us', '/about'],
  ['Campaigns', '/campaigns'],
  ['Events', '/events'],
  ['Exco / Leadership', '/exco'],
  ['Gallery & Videos', '/gallery'],
  ['Join the club', '/membership'],
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const shouldReduce = useReducedMotion()

  return (
    <div className="mobile-nav-wrap">
      <motion.button
        type="button"
        className="mobile-menu-button"
        onClick={() => setOpen(!open)}
        whileTap={shouldReduce ? {} : tapScale}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? 'close' : 'menu'}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={springConfig.snappy}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={springConfig.snappy}
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {links.map(([label, href], index) => (
                <motion.div
                  key={href}
                  initial={shouldReduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springConfig.smooth, delay: index * 0.03 }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    <span>{label}</span>
                    <ArrowRight size={14} className="text-muted-foreground opacity-60" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mobile-nav-actions pt-3 border-t border-border/60 flex items-center justify-between gap-3">
              <ThemeToggle />
              <Button asChild size="sm" className="gap-1.5 flex-1">
                <Link href="/donate" onClick={() => setOpen(false)}>
                  <Heart size={14} className="fill-current" />
                  Donate
                </Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
