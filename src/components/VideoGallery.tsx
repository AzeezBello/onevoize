'use client'

import { Maximize2 } from 'lucide-react'

const videos = [
  ['/images/club/event-setup.mp4', 'Event setup'],
  ['/images/club/event.mp4', 'Club event'],
  ['/images/club/events.mp4', 'Club events'],
  ['/images/club/k1-wasiu.mp4', 'K1 Wasiu at the club'],
]

export function VideoGallery() {
  return <div className="video-gallery">{videos.map(([src, title]) => <article className="video-card" key={src}><div className="video-frame"><video src={src} controls preload="metadata" playsInline aria-label={title}/><button type="button" className="video-fullscreen" aria-label={`Open ${title} fullscreen`} title="Open fullscreen" onClick={event => { const video = event.currentTarget.previousElementSibling as HTMLVideoElement | null; video?.requestFullscreen?.() }}><Maximize2 size={17}/></button></div><h3 className="serif">{title}</h3></article>)}</div>
}
