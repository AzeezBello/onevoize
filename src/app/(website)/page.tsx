import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, HeartHandshake, Users, ShieldCheck, type LucideIcon } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { featuredTrustees, portraitAlt } from '@/lib/people'
import { HomeHero } from '@/components/HomeHero'
import { HomeGallerySlider } from '@/components/HomeGallerySlider'
import { AnniversaryBanner } from '@/components/AnniversaryBanner'

const values: Array<[string, string, LucideIcon]> = [
  ['Mutual support', 'We uplift ourselves and stand together through life\'s important moments.', Users],
  ['Service', 'We give time, resources and care to less privileged people in Africa.', HeartHandshake],
  ['Responsibility', 'We represent Global Voize with integrity wherever we are invited.', ShieldCheck],
]

export default function Home() {
  return <>
    <HomeHero
      eyebrow={siteConfig.displayName}
      title="One club."
      titleHighlight="One voize."
      text="Friendship, mutual support and practical service for a community that shows up together."
      badgeText="Since 2025"
      badgeSubtext="One organisation. One voice."
      primaryAction={{ label: 'Join the club', href: '/membership' }}
      secondaryAction={{ label: 'Support our work', href: '/donate' }}
      keywords={['Friendship', 'Service', 'Unity']}
      scrollLabel="Explore the club ↓"
    />

    <section className="home-intro section">
      <div className="container home-intro-grid">
        <div><div className="eyebrow">Our purpose</div><h2 className="serif">Good friendship becomes meaningful service.</h2></div>
        <div><p className="home-lead">We are a not-for-profit and non-political club committed to integrity, unity, peace and progress.</p><p className="home-muted">From member support to charitable giving, Global Voize creates a dependable community where people contribute, connect and leave a positive mark.</p><Link href="/about" className="text-link" style={{ marginTop: 18 }}>Learn about the club <ArrowRight size={16}/></Link></div>
      </div>
    </section>

    <section className="section home-values">
      <div className="container">
        <div className="home-section-heading"><div><div className="eyebrow">What guides us</div><h2 className="serif">Our values are lived together.</h2></div><Link href="/constitution" className="text-link">Read the constitution <ArrowRight size={16}/></Link></div>
        <div className="home-value-grid">{values.map(([title, description, Icon]) => <article key={title} className="home-value-card"><div className="home-icon"><Icon size={22}/></div><h3 className="serif">{title}</h3><p>{description}</p></article>)}</div>
      </div>
    </section>

    <section className="section home-community">
      <div className="container home-community-grid">
        <div className="home-community-photo"><Image src="/images/club/members-at-event.jpeg" alt="Three club members in white polo shirts in front of the Global Voize anniversary banner" fill sizes="(max-width: 800px) 100vw, 50vw"/></div>
        <div className="home-community-copy"><div className="eyebrow">The club in motion</div><h2 className="serif">Connection is part of the work.</h2><p>Our outings, celebrations and gatherings make room for friendship, belonging and the shared responsibility to give back.</p><div className="home-link-row"><Link href="/gallery" className="btn btn-primary">View the gallery <ArrowRight size={17}/></Link><Link href="/gallery#club-videos" className="text-link">Watch club videos <ArrowRight size={16}/></Link></div></div>
      </div>
    </section>

    <AnniversaryBanner action={{ label: 'See the celebration', href: '/gallery' }}/>

    <section className="section home-gallery">
      <div className="container"><HomeGallerySlider/></div>
    </section>

    <section className="section home-leadership">
      <div className="container"><div className="home-section-heading"><div><div className="eyebrow">Leadership</div><h2 className="serif">People entrusted to serve.</h2></div><Link href="/about#exco-members" className="text-link">Meet the Exco <ArrowRight size={16}/></Link></div><div className="home-trustee-grid">{featuredTrustees.map((person) => <Link href="/about#exco-members" className="home-trustee" key={person.name}><div className="home-trustee-image"><Image src={person.image} alt={portraitAlt(person)} fill sizes="(max-width: 640px) 100vw, (max-width: 800px) 50vw, 33vw"/></div><strong>{person.name}</strong><span>{person.role}</span></Link>)}</div></div>
    </section>

    <section className="home-cta"><div className="container home-cta-inner"><div><div className="eyebrow">Your place in the club</div><h2 className="serif">Show up for something that matters.</h2></div><div className="home-actions"><Link href="/membership" className="btn btn-gold">Join the club <ArrowRight size={17}/></Link><Link href="/donate" className="btn btn-ghost">Donate</Link></div></div></section>

    <div className="sr-only">{siteConfig.displayName}: {siteConfig.description}</div>
  </>
}
