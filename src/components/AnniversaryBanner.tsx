import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { anniversaryArt } from '@/lib/gallery'

type AnniversaryBannerProps = { action?: { label: string; href: string } }

export function AnniversaryBanner({ action }: AnniversaryBannerProps) {
  return (
    <section className="section anniversary">
      <div className="container anniversary-inner">
        <div className="anniversary-art">
          <Image src={anniversaryArt.src} alt={anniversaryArt.alt} width={anniversaryArt.width} height={anniversaryArt.height} sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="anniversary-copy">
          <div className="eyebrow">Milestone</div>
          <h2 className="serif">One year of showing up together.</h2>
          <p>The club marked its first anniversary with members, friends and guests. It was a celebration of the friendship, mutual support and service that brought us together.</p>
          {action && <Link href={action.href} className="btn btn-primary">{action.label} <ArrowRight size={17} /></Link>}
        </div>
      </div>
    </section>
  )
}
