import Link from 'next/link'
import { ArrowRight, BookOpen, Stethoscope, Sparkles, Briefcase, HeartHandshake, ShieldAlert } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { SectionTitle } from '@/components/SectionTitle'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const programItems = [
  {
    title: 'Education & Learning Support',
    description: 'Providing educational grants, textbooks, backpacks, and scholarships to promising children from underserved families in Lagos.',
    icon: BookOpen,
    category: 'Education',
  },
  {
    title: 'Community Health Outreaches',
    description: 'Conducting free primary health screenings, distribution of basic medications, and preventative health education in suburban communities.',
    icon: Stethoscope,
    category: 'Healthcare',
  },
  {
    title: 'Youth Mentorship & Empowerment',
    description: 'Equipping youths with technical, vocational, and digital skills alongside structured mentorship from seasoned club members.',
    icon: Sparkles,
    category: 'Youth',
  },
  {
    title: 'Livelihoods & Micro-Enterprise',
    description: 'Supporting small local business owners and traders with micro-grants and financial literacy tools to foster sustainable self-reliance.',
    icon: Briefcase,
    category: 'Empowerment',
  },
  {
    title: 'Welfare for Vulnerable Families',
    description: 'Delivering nutritional aid packages, emergency household provisions, and compassionate care to widows, orphans, and the elderly.',
    icon: HeartHandshake,
    category: 'Welfare',
  },
  {
    title: 'Emergency Community Relief',
    description: 'Mobilising rapid humanitarian assistance, shelter essentials, and relief materials during unforeseen localized community hardships.',
    icon: ShieldAlert,
    category: 'Relief',
  },
]

export default function Programs() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Programs designed for lasting impact."
        text="Explore the six core focus areas where ONE VOIZE FRIENDS CLUB OF LAGOS invests its resources and collective goodwill."
        action={{ label: 'Support our programs', href: '/donate' }}
      />

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Strategic Pillars"
            title="Six Initiatives. One Mission."
            text="Each program is guided by principles of transparency, direct local engagement, and measurable positive outcomes."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {programItems.map((p, i) => {
              const Icon = p.icon
              return (
                <Card
                  key={p.title}
                  className="border border-border/80 shadow-none hover:border-border transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                        0{i + 1}
                      </span>
                    </div>
                    <CardTitle className="font-serif text-xl tracking-normal normal-case group-hover:text-primary transition-colors">
                      {p.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/60">
                    <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs font-semibold text-primary hover:text-primary">
                      <Link href="/contact">
                        Get involved or sponsor
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
