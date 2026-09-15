'use client'

import { Maximize2 } from 'lucide-react'
import { clubVideos } from '@/lib/gallery'

export function VideoGallery() {
  return <div className="video-gallery">{clubVideos.map(({ src, title, caption }) => <article className="video-card" key={src}><div className="video-frame"><video src={src} controls preload="metadata" playsInline aria-label={title}/><button type="button" className="video-fullscreen" aria-label={`Open ${title} fullscreen`} title="Open fullscreen" onClick={event => { const video = event.currentTarget.previousElementSibling as HTMLVideoElement | null; video?.requestFullscreen?.() }}><Maximize2 size={17}/></button></div><h3 className="serif">{title}</h3><p className="video-caption">{caption}</p></article>)}</div>
}
