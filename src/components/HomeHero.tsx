'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { tapScale, springConfig } from '@/lib/motion'

type HeroAction = { label: string; href: string }

export type HomeHeroProps = {
  eyebrow?: string
  title: string
  titleHighlight?: string
  text?: string
  badgeText?: string
  badgeSubtext?: string
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  globeSrc?: string
  rotationDuration?: number
  rotate?: boolean
  highlightColor?: string
  background?: string
  keywords?: string[]
  scrollLabel?: string
  className?: string
}

export function HomeHero({
  eyebrow,
  title,
  titleHighlight,
  text,
  badgeText,
  badgeSubtext,
  primaryAction,
  secondaryAction,
  globeSrc = '/images/globeImage.png',
  rotationDuration = 90,
  rotate = true,
  highlightColor,
  background,
  keywords = [],
  scrollLabel,
  className = '',
}: HomeHeroProps) {
  const shouldReduce = useReducedMotion()

  const style = {
    '--globe-duration': `${rotationDuration}s`,
    ...(highlightColor ? { '--hero-highlight': highlightColor } : {}),
    ...(background ? { '--hero-bg': background } : {}),
  } as CSSProperties

  const showFooter = keywords.length > 0 || scrollLabel

  return (
    <section className={`home-hero ${rotate ? '' : 'no-spin'} ${className}`.trim()} style={style}>
      <div className="home-hero-bg" aria-hidden="true" />

      <div className="container home-hero-inner">
        <div className="home-hero-copy">
          {eyebrow && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig.smooth, delay: 0.05 }}
              className="home-hero-eyebrow"
            >
              {eyebrow}
            </motion.div>
          )}

          <motion.h1
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.smooth, delay: 0.1 }}
            className="home-hero-title serif"
          >
            <span className="home-hero-title-white">{title}</span>
            {titleHighlight && <span className="home-hero-title-gold">{titleHighlight}</span>}
          </motion.h1>

          {text && (
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig.smooth, delay: 0.15 }}
              className="home-hero-text"
            >
              {text}
            </motion.p>
          )}

          {(badgeText || badgeSubtext) && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springConfig.smooth, delay: 0.2 }}
              className="home-hero-badge"
            >
              <div className="home-hero-badge-dot" />
              <div className="home-hero-badge-content">
                {badgeText && <div className="home-hero-badge-label">{badgeText}</div>}
                {badgeSubtext && <div className="home-hero-badge-subtext">{badgeSubtext}</div>}
              </div>
            </motion.div>
          )}

          {(primaryAction || secondaryAction) && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig.smooth, delay: 0.25 }}
              className="home-hero-actions"
            >
              {primaryAction && (
                <motion.div whileHover={shouldReduce ? {} : { scale: 1.02 }} whileTap={shouldReduce ? {} : tapScale}>
                  <Link href={primaryAction.href} className="btn btn-gold">
                    {primaryAction.label}
                    <ArrowRight size={17} />
                  </Link>
                </motion.div>
              )}
              {secondaryAction && (
                <motion.div whileHover={shouldReduce ? {} : { scale: 1.02 }} whileTap={shouldReduce ? {} : tapScale}>
                  <Link href={secondaryAction.href} className="btn btn-ghost">
                    {secondaryAction.label}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springConfig.smooth, delay: 0.18 }}
          className="home-hero-visual"
          aria-hidden="true"
        >
          <div className="home-hero-aura" />
          <div className="home-hero-orbit" />
          <div className="home-hero-globe">
            <Image
              src={globeSrc}
              alt=""
              width={1093}
              height={1092}
              priority
              sizes="(max-width: 640px) 70vw, (max-width: 900px) 360px, 560px"
            />
          </div>
        </motion.div>
      </div>

      {showFooter && (
        <div className="container home-hero-footer">
          {keywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
          {scrollLabel && <span className="home-hero-scroll">{scrollLabel}</span>}
        </div>
      )}
    </section>
  )
}
