import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'

type HeroAction = { label: string; href: string }

export type HomeHeroProps = {
  /** Small uppercase line above the title */
  eyebrow?: string
  /** First line of the title, rendered in white */
  title: string
  /** Second line of the title, rendered in the highlight colour */
  titleHighlight?: string
  /** Supporting paragraph */
  text?: string
  /** Frosted-glass badge, e.g. "Since 2025" */
  badgeText?: string
  badgeSubtext?: string
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Path to the globe image (transparent PNG works best) */
  globeSrc?: string
  /** Seconds for one full 360° turn of the globe */
  rotationDuration?: number
  /** Turn the rotation off entirely */
  rotate?: boolean
  /** Any CSS colour; defaults to the site gold */
  highlightColor?: string
  /** Any CSS background; defaults to the deep blue gradient */
  background?: string
  /** Short keywords shown along the bottom edge */
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
          {eyebrow && <div className="home-hero-eyebrow">{eyebrow}</div>}

          <h1 className="home-hero-title serif">
            <span className="home-hero-title-white">{title}</span>
            {titleHighlight && <span className="home-hero-title-gold">{titleHighlight}</span>}
          </h1>

          {text && <p className="home-hero-text">{text}</p>}

          {(badgeText || badgeSubtext) && (
            <div className="home-hero-badge">
              <div className="home-hero-badge-dot" />
              <div className="home-hero-badge-content">
                {badgeText && <div className="home-hero-badge-label">{badgeText}</div>}
                {badgeSubtext && <div className="home-hero-badge-subtext">{badgeSubtext}</div>}
              </div>
            </div>
          )}

          {(primaryAction || secondaryAction) && (
            <div className="home-hero-actions">
              {primaryAction && (
                <Link href={primaryAction.href} className="btn btn-gold">
                  {primaryAction.label}
                  <ArrowRight size={17} />
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href} className="btn btn-ghost">
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="home-hero-visual" aria-hidden="true">
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
        </div>
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
