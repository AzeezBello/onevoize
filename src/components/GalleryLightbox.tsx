'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type GalleryPhoto = [src: string, alt: string]

export function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex === null) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowLeft') setActiveIndex(index => index === null ? null : (index - 1 + photos.length) % photos.length)
      if (event.key === 'ArrowRight') setActiveIndex(index => index === null ? null : (index + 1) % photos.length)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [activeIndex, photos.length])

  return <>
    <div className="gallery-lightbox-grid">{photos.map(([src, alt], index) => <button type="button" className="gallery-lightbox-thumb" key={src} onClick={() => setActiveIndex(index)} aria-label={`Open ${alt} fullscreen`}><Image src={src} alt={alt} fill sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw"/></button>)}</div>
    {activeIndex !== null && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Fullscreen gallery preview" onClick={() => setActiveIndex(null)}>
      <button type="button" className="gallery-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close fullscreen preview"><X size={24}/></button>
      <button type="button" className="gallery-lightbox-control gallery-lightbox-prev" onClick={event => { event.stopPropagation(); setActiveIndex(index => index === null ? null : (index - 1 + photos.length) % photos.length) }} aria-label="Previous image"><ChevronLeft size={30}/></button>
      <div className="gallery-lightbox-stage" onClick={event => event.stopPropagation()}><Image src={photos[activeIndex][0]} alt={photos[activeIndex][1]} fill sizes="100vw"/></div>
      <button type="button" className="gallery-lightbox-control gallery-lightbox-next" onClick={event => { event.stopPropagation(); setActiveIndex(index => index === null ? null : (index + 1) % photos.length) }} aria-label="Next image"><ChevronRight size={30}/></button>
      <div className="gallery-lightbox-caption">{photos[activeIndex][1]} <span>{activeIndex + 1} / {photos.length}</span></div>
    </div>}
  </>
}
