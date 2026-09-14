import { PageHero } from '@/components/PageHero'
const members = [
  ['Olaiya Ibrahim Olatunbosun', 'President', '/images/trustee-portraits/olaiya-ibrahim.jpeg'],
  ['Kabiru Adesanya', 'Public Relations Officer', '/images/trustee-portraits/kabiru-adesanya.jpeg'],
  ['Waleade Idowu Aseniyi', 'Social Secretary', '/images/trustee-portraits/waleade-idowu.jpeg'],
  ['Olufemi Jeje', 'Financial Secretary', '/images/trustee-portraits/olufemi-jeje.jpeg'],
  ['Awogbadebo Alabi Mobolaji', 'General Secretary', '/images/trustee-portraits/awogbadebo-alabi.jpeg'],
  ['Bariyi Fowora Shoniyi', 'Assistant General Secretary', '/images/trustee-portraits/bariyi-fowora-shoniyi.jpeg'],
]

const clubMembers = [
  ['Abdul Silvester SLY', '/images/members/abdul-silvester-sly.jpeg'],
  ['Adeyeye Ibrahim', '/images/members/adeyeye-ibrahim.jpeg'],
  ['Hakeem Babatunde Salami', '/images/members/hakeem-babatunde-salami.jpeg'],
  ['Honorable Olalekan S. Davids (Salaqua)', '/images/members/olalekan-davids-salaqua.jpeg'],
  ['Olatunde Isikalu', '/images/members/olatunde-isikalu.jpeg'],
  ['Prince Afolabi Olanrewaju', '/images/members/prince-afolabi-olanrewaju.jpeg'],
  ['Wasiu Adekunle Shoniyi', '/images/members/wasiu-adekunle-shoniyi.jpeg'],
]

export default function Exco() {
  return <main>
    <PageHero eyebrow="Exco / members" title="The people serving Global Voize Club." text="Meet the executive members helping guide the club's mission, activities and service to the community." />
    <section className="section"><div className="container"><div className="eyebrow">Executive Committee</div><h2 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: '10px 0 30px' }}>Leadership with purpose and accountability.</h2><div className="grid-auto">{members.map(([name, role, image]) => <article key={name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, overflow: 'hidden' }}><img src={image} alt={`${name}, ${role}`} style={{ width: '100%', height: 300, objectFit: 'cover' }}/><div style={{ padding: 22 }}><h2 className="serif" style={{ fontSize: 26, margin: 0 }}>{name}</h2><div className="eyebrow" style={{ marginTop: 8 }}>{role}</div></div></article>)}</div></div></section>
    <section className="section" style={{ background: 'var(--surface)' }}><div className="container"><div className="eyebrow">Club Members</div><h2 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: '10px 0 30px' }}>The people who make the club.</h2><div className="grid-auto">{clubMembers.map(([name, image]) => <article key={name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}><img src={image} alt={`${name}, Global Voize Club member`} style={{ width: '100%', height: 280, objectFit: 'cover' }}/><div style={{ padding: 18 }}><h3 className="serif" style={{ fontSize: 23, margin: 0 }}>{name}</h3><div className="eyebrow" style={{ marginTop: 7 }}>Member</div></div></article>)}</div></div></section>
  </main>
}
