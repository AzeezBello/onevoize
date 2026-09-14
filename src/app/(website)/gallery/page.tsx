const photos = [
  ['/images/club/members-at-event.jpeg', 'Members at a club event'],
  ['/images/club/club-celebration.jpeg', 'Club celebration'],
  ['/images/club/members-group.jpeg', 'Members together'],
  ['/images/club/club-leaders.jpeg', 'Club leaders'],
]

export default function Gallery() {
  return <main>
    <section className="section" style={{ background: 'var(--surface)' }}><div className="container"><div className="eyebrow">Gallery / Past Events / Videos</div><h1 className="serif" style={{ fontSize: 'clamp(48px,7vw,78px)', lineHeight: 1 }}>The club in pictures.</h1><p style={{ maxWidth: 700, color: 'var(--muted)', fontSize: 18, lineHeight: 1.7 }}>Browse moments from our gatherings, outings and community activities.</p></div></section>
    <section className="section"><div className="container"><div className="club-photo-grid">{photos.map(([src, alt]) => <img key={src} src={src} alt={alt} className="club-photo"/>)}</div><div style={{ marginTop: 50, padding: 28, background: 'var(--surface)', borderRadius: 18 }}><div className="eyebrow">Videos</div><h2 className="serif" style={{ fontSize: 32 }}>Videos will be added here.</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 0 }}>Approved event videos and community stories can be published in this gallery as they become available.</p></div></div></section>
  </main>
}
