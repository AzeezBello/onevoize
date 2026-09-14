import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type PageHeroProps = {
  eyebrow: string
  title: string
  titleHighlight?: string // For "ONE VOIZE" in yellow
  text: string
  badgeText?: string
  badgeSubtext?: string
  action?: { label: string; href: string }
}

export function PageHero({
  eyebrow,
  title,
  titleHighlight,
  text,
  badgeText,
  badgeSubtext,
  action,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-container">
        <div className="page-hero-copy">
          {eyebrow && <div className="page-hero-eyebrow">{eyebrow}</div>}
          
          <h1 className="page-hero-title">
            <span className="page-hero-title-part-white">{title}</span>
            {titleHighlight && (
              <span className="page-hero-title-part-highlight">{titleHighlight}</span>
            )}
          </h1>

          {text && <p className="page-hero-text">{text}</p>}

          {(badgeText || badgeSubtext) && (
            <div className="page-hero-badge">
              <div className="page-hero-badge-dot" />
              <div className="page-hero-badge-content">
                {badgeText && <div className="page-hero-badge-label">{badgeText}</div>}
                {badgeSubtext && (
                  <div className="page-hero-badge-subtext">{badgeSubtext}</div>
                )}
              </div>
            </div>
          )}

          {action && (
            <div className="page-hero-actions">
              <Link href={action.href} className="page-hero-btn">
                {action.label}
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}