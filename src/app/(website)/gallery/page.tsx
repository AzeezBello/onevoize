import { PageHero } from '@/components/PageHero'
import { GalleryLightbox } from '@/components/GalleryLightbox'
import { VideoGallery } from '@/components/VideoGallery'
const photos: Array<[string, string]> = [
  ['/images/club/members-at-event.jpeg', 'Members at a club event'],
  ['/images/club/club-celebration.jpeg', 'Club celebration'],
  ['/images/club/members-group.jpeg', 'Members together'],
  ['/images/club/club-leaders.jpeg', 'Club leaders'],
]

export default function Gallery() {
  return <main>
    <PageHero eyebrow="Gallery / past events / videos" title="The club in pictures." text="Browse moments from our gatherings, outings and community activities." />
    <section className="section"><div className="container"><GalleryLightbox photos={photos}/><div style={{ marginTop: 64 }}><div className="eyebrow">Moving moments</div><h2 className="serif" style={{ fontSize: 42, margin: '10px 0 26px' }}>Watch the club in motion.</h2><VideoGallery/></div></div></section>
  </main>
}
