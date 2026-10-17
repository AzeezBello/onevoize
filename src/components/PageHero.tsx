'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { tapScale, springConfig } from '@/lib/motion'

type PageHeroProps = {
  eyebrow: string
  title: string
  text: string
  action?: { label: string; href: string }
  id?: string
}

export function PageHero({ eyebrow, title, text, action, id }: PageHeroProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section className="page-hero" id={id}>
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.smooth, delay: 0.05 }}
            className="eyebrow page-hero-eyebrow"
          >
            {eyebrow}
          </motion.div>

          <motion.h1
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.smooth, delay: 0.1 }}
            className="serif"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={shouldReduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.smooth, delay: 0.15 }}
          >
            {text}
          </motion.p>

          {action && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig.smooth, delay: 0.2 }}
              whileHover={shouldReduce ? {} : { scale: 1.02 }}
              whileTap={shouldReduce ? {} : tapScale}
              className="inline-block mt-2"
            >
              <Link href={action.href} className="btn btn-gold page-hero-action">
                {action.label} <ArrowRight size={17} />
              </Link>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springConfig.smooth, delay: 0.18 }}
          className="page-hero-mark"
          aria-hidden="true"
        >
          <span>ONE</span>
          <strong>VOIZE</strong>
          <small>FRIENDS CLUB OF LAGOS</small>
        </motion.div>
      </div>
    </section>
  )
}
