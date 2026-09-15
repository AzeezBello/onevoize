import Image from 'next/image'
import Link from 'next/link'
import { Mail, Share2, Globe2, Send } from 'lucide-react'
import { siteConfig } from '@/lib/site'

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', icon: Share2 },
  { href: 'https://instagram.com', label: 'Instagram', icon: Globe2 },
  { href: 'https://youtube.com', label: 'YouTube', icon: Send },
  { href: `mailto:${siteConfig.contactEmail}`, label: 'Email', icon: Mail },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <Image src="/images/ONE VOICE LOGO 1.png" alt="One Voize Friends Club of Lagos logo" width={130} height={41} />
            </div>
            <p className="footer-text">{siteConfig.description}</p>
            <div className="footer-socials">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"><Icon size={16} /></a>
              ))}
            </div>
          </div>
          <div>
            <strong>Explore</strong>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/programs">Our Work</Link>
              <Link href="/campaigns">Campaigns</Link>
              <Link href="/events">Events</Link>
            </div>
          </div>
          <div>
            <strong>Get Involved</strong>
            <div className="footer-links">
              <Link href="/volunteer">Volunteer</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/donate">Donate</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.legalName}. CAC Registration No. {siteConfig.registrationNumber}.</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  )
}
