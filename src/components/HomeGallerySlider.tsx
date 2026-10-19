'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clubPhotos, type GalleryPhoto } from '@/lib/gallery'

export function HomeGallerySlider({ photos = clubPhotos }: { photos?: GalleryPhoto[] }) {
  const list = photos.length > 0 ? photos : clubPhotos
  const [index, setIndex] = useState(0)
  const safeIndex = index < list.length ? index : 0
  const current = list[safeIndex]

  return (
    <section className="home-gallery-slider">
      <div className="home-gallery-header">
        <div>
          <span className="eyebrow">Gallery</span>
          <h2 className="serif">The club in pictures.</h2>
        </div>
        <div className="home-gallery-controls">
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex((safeIndex + list.length - 1) % list.length)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex((safeIndex + 1) % list.length)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="home-gallery-frame">
        <Image
          src={current[0]}
          alt={current[1]}
          fill
          sizes="(max-width: 1200px) 100vw, 1160px"
          priority={safeIndex === 0}
          unoptimized={current[0].startsWith('data:')}
        />
        <div className="home-gallery-caption">
          <span>{current[1]}</span>
          <span className="home-gallery-count">
            {safeIndex + 1}/{list.length}
          </span>
        </div>
      </div>
      <div className="home-gallery-thumbs">
        {list.map(([src, alt], photoIndex) => (
          <button
            type="button"
            key={`${src}-${photoIndex}`}
            className={photoIndex === safeIndex ? 'active' : ''}
            aria-label={`Show photo ${photoIndex + 1}`}
            aria-pressed={photoIndex === safeIndex}
            onClick={() => setIndex(photoIndex)}
          >
            <Image src={src} alt={alt} fill sizes="90px" unoptimized={src.startsWith('data:')} />
          </button>
        ))}
      </div>
    </section>
  )
}

