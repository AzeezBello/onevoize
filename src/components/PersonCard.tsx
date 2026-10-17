'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { portraitAlt, type Person } from '@/lib/people'
import { Card, CardContent } from '@/components/ui/card'
import { hoverLift, springConfig } from '@/lib/motion'

const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px'

export function PersonCard({ person }: { person: Person }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.article
      whileHover={shouldReduce ? {} : hoverLift}
      transition={springConfig.tactile}
      className="person-card"
    >
      <div className="person-photo">
        <Image src={person.image} alt={portraitAlt(person)} fill sizes={sizes} />
      </div>
      <div className="person-body">
        <h3 className="serif">{person.name}</h3>
        <div className="eyebrow">{person.role}</div>
      </div>
    </motion.article>
  )
}

export function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <div className="people-grid">
      {people.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </div>
  )
}
