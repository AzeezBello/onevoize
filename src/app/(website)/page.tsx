import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, HeartHandshake, Users, ShieldCheck, type LucideIcon } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { HomeGallerySlider } from '@/components/HomeGallerySlider'

const trustees = [
  ['Olaiya Ibrahim Olatunbosun', 'President', '/images/trustee-portraits/olaiya-ibrahim.jpeg'],
  ['Kabiru Adesanya', 'Public Relations Officer', '/images/trustee-portraits/kabiru-adesanya.jpeg'],
  ['Waleade Idowu Aseniyi', 'Social Secretary', '/images/trustee-portraits/waleade-idowu.jpeg'],
]

const values: Array<[string, string, LucideIcon]> = [
  ['Mutual support', 'We uplift ourselves and stand together through life\'s important moments.', Users],
  ['Service', 'We give time, resources and care to less privileged people in Africa.', HeartHandshake],
  ['Responsibility', 'We represent Global Voize with integrity wherever we are invited.', ShieldCheck],
]

export default function Home() {
  return <main>
    <section className="home-hero">
      <video className="home-hero-video" autoPlay muted loop playsInline poster="/images/club/members-group.jpeg" aria-hidden="true"><source src="/images/club/events.mp4" type="video/mp4"/></video>
      <div className="home-hero-overlay"/>
      <div className="container home-hero-inner">
        <div className="home-hero-copy">
          <div className="eyebrow home-eyebrow">GLOBAL VOIZE CLUB · LAGOS</div>
          <h1 className="serif">One club.<br/><span>One voize.</span></h1>
          <p>Friendship, mutual support and practical service for a community that shows up together.</p>
          <div className="home-actions"><Link href="/membership" className="btn home-primary-action">Join the club <ArrowRight size={17}/></Link><Link href="/donate" className="btn home-secondary-action">Support our work</Link></div>
        </div>
        <div className="home-hero-rail"><div className="home-hero-badge"><span>Since</span><strong>2025</strong><small>One organisation.<br/>One voice.</small></div><div className="home-hero-status"><span className="home-live-dot"/>Community in motion</div></div>
      </div>
      <div className="container home-hero-footer"><span>Friendship</span><span>Service</span><span>Unity</span><span className="home-hero-scroll">Explore the club ↓</span></div>
    </section>

    <section className="home-intro section">
      <div className="container home-intro-grid">
        <div><div className="eyebrow">Our purpose</div><h2 className="serif">Good friendship becomes meaningful service.</h2></div>
        <div><p className="home-lead">We are a not-for-profit and non-political club committed to integrity, unity, peace and progress.</p><p className="home-muted">From member support to charitable giving, Global Voize creates a dependable community where people contribute, connect and leave a positive mark.</p><Link href="/about" className="text-link">Learn about the club <ArrowRight size={16}/></Link></div>
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
        <div className="home-community-photo"><Image src="/images/club/members-at-event.jpeg" alt="Global Voize Club members at an event" fill sizes="(max-width: 800px) 100vw, 50vw"/></div>
        <div className="home-community-copy"><div className="eyebrow">The club in motion</div><h2 className="serif">Connection is part of the work.</h2><p>Our outings, celebrations and gatherings make room for friendship, belonging and the shared responsibility to give back.</p><div className="home-link-row"><Link href="/gallery" className="btn btn-primary">View the gallery <ArrowRight size={17}/></Link><Link href="/events" className="text-link">See events <ArrowRight size={16}/></Link></div></div>
      </div>
    </section>

    <section className="section home-gallery">
      <div className="container"><HomeGallerySlider/></div>
    </section>

    <section className="section home-leadership">
      <div className="container"><div className="home-section-heading"><div><div className="eyebrow">Leadership</div><h2 className="serif">People entrusted to serve.</h2></div><Link href="/about#exco-members" className="text-link">Meet the Exco <ArrowRight size={16}/></Link></div><div className="home-trustee-grid">{trustees.map(([name, role, image]) => <Link href="/about#exco-members" className="home-trustee" key={name}><div className="home-trustee-image"><Image src={image} alt={`${name}, ${role}`} fill sizes="(max-width: 800px) 100vw, 33vw"/></div><strong>{name}</strong><span>{role}</span></Link>)}</div></div>
    </section>

    <section className="home-cta"><div className="container home-cta-inner"><div><div className="eyebrow home-eyebrow">Your place in the club</div><h2 className="serif">Show up for something that matters.</h2></div><div className="home-actions"><Link href="/membership" className="btn home-primary-action">Join the club <ArrowRight size={17}/></Link><Link href="/donate" className="btn home-secondary-action">Donate</Link></div></div></section>

    <div className="sr-only">{siteConfig.displayName}: {siteConfig.description}</div>
  </main>
}
