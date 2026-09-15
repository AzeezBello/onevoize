import { PageHero } from '@/components/PageHero'
import { SectionTitle } from '@/components/SectionTitle'
import { PeopleGrid } from '@/components/PersonCard'
import { trustees, members } from '@/lib/people'

export default function Exco() {
  return <>
    <PageHero eyebrow="Exco / members" title="The people serving Global Voize Club." text="Meet the executive members helping guide the club's mission, activities and service to the community." />
    <section className="section"><div className="container"><SectionTitle eyebrow="Executive Committee" title="Leadership with purpose and accountability."/><PeopleGrid people={trustees}/></div></section>
    <section className="section" style={{ background: 'var(--surface)' }}><div className="container"><SectionTitle eyebrow="Club Members" title="The people who make the club."/><PeopleGrid people={members}/></div></section>
  </>
}
