import { PageHero } from '@/components/PageHero'
const committees = [
  ['Disciplinary Committee', 'Promotes good conduct, investigates complaints, conducts hearings and recommends fair resolutions.'],
  ['Finance and Audit Committee', 'Supports transparent budgeting, financial records, contributions and periodic review.'],
  ['Events and Social Committee', 'Plans outings, celebrations, fundraisers and member activities in line with club values.'],
  ['Welfare and Charity Committee', 'Coordinates support for members and charitable giving to less privileged people in Africa.'],
]

export default function Committee() {
  return <main>
    <PageHero eyebrow="Club committee" title="Working groups that keep the club moving." text="Our committees turn the club's constitution and decisions into responsible action." />
    <section className="section"><div className="container"><div className="grid-auto">{committees.map(([title, description], index) => <article key={title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 26 }}><div className="eyebrow">0{index + 1}</div><h2 className="serif" style={{ fontSize: 29 }}>{title}</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{description}</p></article>)}</div></div></section>
  </main>
}
