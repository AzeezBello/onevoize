import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type PageHeroProps = {
  eyebrow: string
  title: string
  text: string
  action?: { label: string; href: string }
  id?: string
}

export function PageHero({ eyebrow, title, text, action, id }: PageHeroProps) {
  return (
    <section className="page-hero" id={id}>
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <div className="eyebrow page-hero-eyebrow">{eyebrow}</div>
          <h1 className="serif">{title}</h1>
          <p>{text}</p>
          {action && (
            <Link href={action.href} className="btn btn-gold page-hero-action">
              {action.label} <ArrowRight size={17} />
            </Link>
          )}
        </div>
        <div className="page-hero-mark" aria-hidden="true">
          <span>ONE</span>
          <strong>VOIZE</strong>
          <small>FRIENDS CLUB OF LAGOS</small>
        </div>
      </div>
    </section>
  )
}
