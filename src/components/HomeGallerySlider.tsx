'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clubPhotos } from '@/lib/gallery'

export function HomeGallerySlider() {
  const [index, setIndex] = useState(0)
  const current = clubPhotos[index]

  return <section className="home-gallery-slider">
    <div className="home-gallery-header"><div><span className="eyebrow">Gallery</span><h2 className="serif">The club in pictures.</h2></div><div className="home-gallery-controls"><button type="button" aria-label="Previous image" onClick={() => setIndex((index + clubPhotos.length - 1) % clubPhotos.length)}><ChevronLeft size={20}/></button><button type="button" aria-label="Next image" onClick={() => setIndex((index + 1) % clubPhotos.length)}><ChevronRight size={20}/></button></div></div>
    <div className="home-gallery-frame"><Image src={current[0]} alt={current[1]} fill sizes="(max-width: 1200px) 100vw, 1160px" priority={index === 0}/><div className="home-gallery-caption"><span>{current[1]}</span><span className="home-gallery-count">{index + 1}/{clubPhotos.length}</span></div></div>
    <div className="home-gallery-thumbs">{clubPhotos.map(([src, alt], photoIndex) => <button type="button" key={src} className={photoIndex === index ? 'active' : ''} aria-label={`Show photo ${photoIndex + 1}`} aria-pressed={photoIndex === index} onClick={() => setIndex(photoIndex)}><Image src={src} alt={alt} fill sizes="90px"/></button>)}</div>
  </section>
}
