import Link from 'next/link'
import { CalendarDays, MapPin, Clock, ArrowRight } from 'lucide-react'
import { SectionTitle } from '@/components/SectionTitle'
import { PageHero } from '@/components/PageHero'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'

type EventItem = {
  id: number | string
  title: string
  description: string
  location: string
  event_date: string
}

const fallbackEvents: EventItem[] = [
  {
    id: 1,
    title: 'Annual General Assembly & Charity Gala',
    description: 'Members, trustees, and partners gather to review club milestones, celebrate impact, and plan upcoming initiatives.',
    location: 'Surulere, Lagos',
    event_date: '2026-11-15T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Youth Mentorship & Skills Workshop',
    description: 'Interactive career development, vocational guidance, and digital skills training for local youths.',
    location: 'National Stadium Area, Lagos',
    event_date: '2026-11-28T09:30:00.000Z',
  },
  {
    id: 3,
    title: 'End of Year Community Welfare Outreach',
    description: 'Direct distribution of essential food packages, health supplies, and welfare support to families.',
    location: 'Lagos Island & Mainland Centers',
    event_date: '2026-12-19T08:00:00.000Z',
  },
]

async function getLiveEvents(): Promise<EventItem[]> {
  try {
    const rows = await db(
      "SELECT id, title, description, location, event_date FROM events WHERE status IN ('upcoming','ongoing') ORDER BY event_date ASC",
    )
    if (rows && rows.length > 0) {
      return (rows as unknown as Array<{ id: number; title: string; description: string; location: string; event_date: string }>).map(r => ({
        id: r.id,
        title: r.title,
        description: r.description || 'Join ONE VOIZE members for this community gathering.',
        location: r.location || 'Lagos, Nigeria',
        event_date: r.event_date,
      }))
    }
  } catch {
    // Fall back to featured events
  }
  return fallbackEvents
}

export default async function Events() {
  const events = await getLiveEvents()

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Come together. Take action. Make an impact."
        text="Discover upcoming gatherings, community outreaches, workshops, and fundraisers organised by ONE VOIZE."
        action={{ label: 'Volunteer with us', href: '/volunteer' }}
      />

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Calendar"
            title="Scheduled Gatherings"
            text="Mark your calendar and participate in our activities across Lagos State."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {events.map((ev) => {
              const d = new Date(ev.event_date)
              const day = d.getDate()
              const month = d.toLocaleDateString('en-NG', { month: 'short' }).toUpperCase()
              const fullDate = d.toLocaleDateString('en-NG', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              return (
                <Card
                  key={ev.id}
                  className="border border-border/80 shadow-none hover:border-border transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground shrink-0 shadow-sm">
                        <span className="font-bold text-lg leading-tight tabular-nums">{day}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{month}</span>
                      </div>

                      <div className="space-y-1">
                        <CardTitle className="text-base font-serif tracking-normal normal-case group-hover:text-primary transition-colors line-clamp-2">
                          {ev.title}
                        </CardTitle>
                        <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={11} />
                          {fullDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-4">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-foreground/80 font-medium pt-1">
                      <MapPin size={13} className="text-primary shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/60">
                    <Button asChild variant="outline" size="sm" className="w-full gap-1.5 text-xs font-semibold">
                      <Link href="/contact">
                        Event Details & RSVP
                        <ArrowRight size={13} />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
