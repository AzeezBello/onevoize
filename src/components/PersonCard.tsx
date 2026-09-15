import Image from 'next/image'
import { portraitAlt, type Person } from '@/lib/people'

const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px'

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="person-card">
      <div className="person-photo"><Image src={person.image} alt={portraitAlt(person)} fill sizes={sizes} /></div>
      <div className="person-body"><h3 className="serif">{person.name}</h3><div className="eyebrow">{person.role}</div></div>
    </article>
  )
}

export function PeopleGrid({ people }: { people: Person[] }) {
  return <div className="people-grid">{people.map((person) => <PersonCard key={person.name} person={person} />)}</div>
}
