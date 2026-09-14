const members = [
  ['Olaiya Ibrahim Olatunbosun', 'President', '/images/trustee-portraits/olaiya-ibrahim.jpeg'],
  ['Kabiru Adesanya', 'Public Relations Officer', '/images/trustee-portraits/kabiru-adesanya.jpeg'],
  ['Waleade Idowu Aseniyi', 'Social Secretary', '/images/trustee-portraits/waleade-idowu.jpeg'],
  ['Olufemi Jeje', 'Financial Secretary', '/images/trustee-portraits/olufemi-jeje.jpeg'],
  ['Awogbadebo Alabi Mobolaji', 'General Secretary', '/images/trustee-portraits/awogbadebo-alabi.jpeg'],
  ['Bariyi Fowora Shoniyi', 'Assistant General Secretary', '/images/trustee-portraits/bariyi-fowora-shoniyi.jpeg'],
]

export default function Exco() {
  return <main>
    <section className="section" style={{ background: 'var(--surface)' }}><div className="container"><div className="eyebrow">Exco / Members</div><h1 className="serif" style={{ fontSize: 'clamp(48px,7vw,78px)', lineHeight: 1 }}>The people serving Global Voize Club.</h1><p style={{ maxWidth: 700, color: 'var(--muted)', fontSize: 18, lineHeight: 1.7 }}>Meet the executive members helping guide the club&apos;s mission, activities and service to the community.</p></div></section>
    <section className="section"><div className="container"><div className="eyebrow">Executive Committee</div><h2 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: '10px 0 30px' }}>Leadership with purpose and accountability.</h2><div className="grid-auto">{members.map(([name, role, image]) => <article key={name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, overflow: 'hidden' }}><img src={image} alt={`${name}, ${role}`} style={{ width: '100%', height: 300, objectFit: 'cover' }}/><div style={{ padding: 22 }}><h2 className="serif" style={{ fontSize: 26, margin: 0 }}>{name}</h2><div className="eyebrow" style={{ marginTop: 8 }}>{role}</div></div></article>)}</div></div></section>
  </main>
}
