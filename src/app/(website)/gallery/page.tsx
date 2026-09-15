import { PageHero } from '@/components/PageHero'
import { AnniversaryBanner } from '@/components/AnniversaryBanner'
import { GalleryLightbox } from '@/components/GalleryLightbox'
import { VideoGallery } from '@/components/VideoGallery'
import { SectionTitle } from '@/components/SectionTitle'
import { clubPhotos } from '@/lib/gallery'

export default function Gallery() {
  return <>
    <PageHero eyebrow="Gallery / past events / videos" title="The club in pictures." text="Browse moments from our gatherings, outings and community activities." />
    <AnniversaryBanner action={{ label: 'Watch the videos', href: '#club-videos' }}/>
    <section className="section"><div className="container"><SectionTitle eyebrow="Photos" title="Moments from the club."/><GalleryLightbox photos={clubPhotos}/></div></section>
    <section id="club-videos" className="section gallery-videos"><div className="container"><SectionTitle eyebrow="Moving moments" title="Watch the club in motion."/><VideoGallery/></div></section>
  </>
}
