'use client'

import { Maximize2 } from 'lucide-react'
import { clubVideos, type GalleryVideo } from '@/lib/gallery'

export function VideoGallery({ videos = clubVideos }: { videos?: GalleryVideo[] }) {
  return (
    <div className="video-gallery">
      {videos.map(({ src, title, caption }, idx) => (
        <article className="video-card" key={`${src}-${idx}`}>
          <div className="video-frame">
            <video
              src={src}
              controls
              preload="metadata"
              playsInline
              width={640}
              height={360}
              aria-label={title}
            />
            <button
              type="button"
              className="video-fullscreen"
              aria-label={`Open ${title} fullscreen`}
              onClick={event => {
                const video = event.currentTarget.previousElementSibling as HTMLVideoElement | null
                video?.requestFullscreen?.()
              }}
            >
              <Maximize2 size={17} aria-hidden="true" />
            </button>
          </div>
          <h3 className="serif">{title}</h3>
          <p className="video-caption">{caption}</p>
        </article>
      ))}
    </div>
  )
}

