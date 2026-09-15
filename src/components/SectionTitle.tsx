type SectionTitleProps = { eyebrow?: string; title: string; text?: string; light?: boolean }

export function SectionTitle({ eyebrow, title, text, light }: SectionTitleProps) {
  return (
    <div style={{ maxWidth: 700, marginBottom: 38 }}>
      {eyebrow && <div className="eyebrow" style={light ? { color: 'var(--gold)' } : undefined}>{eyebrow}</div>}
      <h2 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.05, margin: '10px 0 14px' }}>{title}</h2>
      {text && <p style={{ color: light ? 'rgba(255,255,255,.85)' : 'var(--muted)', fontSize: 17, lineHeight: 1.7 }}>{text}</p>}
    </div>
  )
}
