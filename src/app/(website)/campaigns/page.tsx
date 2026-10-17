import Link from 'next/link'
import { ArrowRight, Megaphone, Target, Heart } from 'lucide-react'
import { SectionTitle } from '@/components/SectionTitle'
import { PageHero } from '@/components/PageHero'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
}

type CampaignItem = {
  id: number | string
  title: string
  description: string
  goal_amount: number
  raised_amount: number
  category?: string
}

const fallbackCampaigns: CampaignItem[] = [
  {
    id: 1,
    title: 'Education for Every Child',
    description: 'Providing textbooks, uniforms, and learning essentials for underserved pupils in Lagos schools.',
    goal_amount: 10000000,
    raised_amount: 7500000,
    category: 'Education',
  },
  {
    id: 2,
    title: 'Community Health Initiative',
    description: 'Sponsoring medical outreaches, preventative screenings, and vital health supplies in vulnerable neighborhoods.',
    goal_amount: 15000000,
    raised_amount: 7200000,
    category: 'Healthcare',
  },
  {
    id: 3,
    title: 'Empowering Young People',
    description: 'Funding vocational training, mentorship sessions, and digital toolkits for ambitious youths.',
    goal_amount: 8000000,
    raised_amount: 5000000,
    category: 'Youth & Skills',
  },
]

async function getLiveCampaigns(): Promise<CampaignItem[]> {
  try {
    const rows = await db(
      "SELECT id, title, description, goal_amount, raised_amount FROM campaigns WHERE status = 'active' ORDER BY created_at DESC",
    )
    if (rows && rows.length > 0) {
      return (rows as unknown as Array<{ id: number; title: string; description: string; goal_amount: string; raised_amount: string }>).map(r => ({
        id: r.id,
        title: r.title,
        description: r.description || 'Community fundraising campaign supported by ONE VOIZE Friends Club.',
        goal_amount: Number(r.goal_amount) || 5000000,
        raised_amount: Number(r.raised_amount) || 0,
      }))
    }
  } catch {
    // Fall back to featured campaigns if DB not seeded yet
  }
  return fallbackCampaigns
}

export default async function Campaigns() {
  const campaigns = await getLiveCampaigns()

  return (
    <>
      <PageHero
        eyebrow="Campaigns"
        title="Your generosity moves ideas into action."
        text="Support a campaign and fund practical community development with transparent, measurable impact."
        action={{ label: 'Donate to general fund', href: '/donate' }}
      />

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Active Initiatives"
            title="Projects underway right now."
            text="Every donation brings us closer to touching lives, providing care, and uplifting families."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {campaigns.map((c, i) => {
              const goal = c.goal_amount
              const raised = c.raised_amount
              const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

              return (
                <Card
                  key={c.id}
                  className="border border-border/80 shadow-none hover:border-border transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Header accent strip */}
                    <div
                      className="h-32 w-full relative"
                      style={{
                        background: `linear-gradient(135deg, ${
                          i === 0 ? 'var(--brand)' : i === 1 ? '#0e7490' : '#b45309'
                        }, #050a4d)`,
                      }}
                    >
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                          <Target size={12} />
                          Active Campaign
                        </span>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif tracking-normal normal-case group-hover:text-primary transition-colors">
                        {c.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-1">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>

                      {/* Progress bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-foreground text-sm tabular-nums">
                            {fmt(raised)}
                          </span>
                          <span className="text-muted-foreground text-xs font-semibold tabular-nums">
                            {pct}%
                          </span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
                          <span>Target Goal</span>
                          <span className="font-medium text-foreground">{fmt(goal)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="pt-4 border-t border-border/60">
                    <Button asChild className="w-full gap-2">
                      <Link href={`/donate?campaign=${encodeURIComponent(c.title)}`}>
                        <Heart size={14} className="fill-current" />
                        Donate to this campaign
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
