import Image from 'next/image'
import Link from 'next/link'
import { SectionTitle } from '@/components/SectionTitle'
import { PageHero } from '@/components/PageHero'
import { PeopleGrid } from '@/components/PersonCard'
import { siteConfig } from '@/lib/site'
import { trustees, members } from '@/lib/people'
import { clubPhotos } from '@/lib/gallery'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

const committees = [
  ['Disciplinary Committee', 'Promotes good conduct, investigates complaints, conducts hearings and recommends fair resolutions.'],
  ['Finance and Audit Committee', 'Supports transparent budgeting, financial records, contributions and periodic review.'],
  ['Events and Social Committee', 'Plans outings, celebrations, fundraisers and member activities in line with club values.'],
  ['Welfare and Charity Committee', 'Coordinates support for members and charitable giving to less privileged people in Africa.'],
]

export default function About() {
  return (
    <>
      <PageHero
        id="about-us"
        eyebrow="About us"
        title="One organisation. One voice."
        text={siteConfig.description}
        action={{ label: 'Read our constitution', href: '/constitution' }}
      />

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="From the Club"
            title="A community that shows up together."
            text="Moments from Global Voize Club gatherings, celebrations and member activities."
          />
          <div className="club-photo-grid mt-8">
            {clubPhotos.map(([src, alt]) => (
              <div key={src} className="club-photo">
                <Image src={src} alt={alt} fill sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <SectionTitle eyebrow="Who We Are" title="A community organisation founded on solidarity and service." />
          <div className="space-y-4">
            <p className="muted text-base leading-relaxed">
              ONE VOIZE FRIENDS CLUB OF LAGOS is a not-for-profit and non-political organisation. Its constitution states that the association exists to promote integrity, uplift its members, support one another, give to less privileged people, and advance goodwill, peace, unity and progress.
            </p>
            <p className="muted text-base leading-relaxed">
              The organisation was incorporated in Nigeria on <strong>{siteConfig.incorporationDate}</strong> as an incorporated trustee. Its registered address is <strong>{siteConfig.registeredAddress}</strong>.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="default">
                <Link href="/constitution">
                  Read the full constitution
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <SectionTitle
            eyebrow="Aims & Objectives"
            title="Putting integrity, mutual support and community goodwill into action."
            text="The constitution identifies the promotion of integrity, mutual uplift, support for one another, giving to less privileged people, goodwill, unity, peace and progress as the association's core objectives."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {[
              'Promote integrity and mutual trust',
              'Uplift members and support each other',
              'Give to less privileged people across Africa',
              'Advance goodwill, harmony and peace',
              'Promote social unity and progress',
              'Champion responsible community leadership',
            ].map((item, i) => (
              <Card key={item} className="border border-border/80 shadow-none hover:border-border transition-colors">
                <CardHeader className="pb-2">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">0{i + 1}</span>
                  <CardTitle className="font-serif text-lg tracking-normal normal-case pt-1">
                    {item}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="club-committee" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Governance"
            title="Standing Club Committees"
            text="Dedicated committees tasked with executing club objectives, overseeing audits, and driving welfare."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {committees.map(([title, description], index) => (
              <Card key={title} className="border border-border/80 shadow-none">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Committee 0{index + 1}</span>
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="font-serif text-xl tracking-normal normal-case pt-1">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/80 shadow-none p-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Official Registration</span>
            <h3 className="font-serif text-2xl mt-2 mb-3">Corporate Affairs Commission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Certificate of Incorporation registration number: <strong>{siteConfig.registrationNumber}</strong>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Tax Identification Number: <strong>{siteConfig.taxIdentificationNumber}</strong>
            </p>
          </Card>

          <Card className="border border-border/80 shadow-none p-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Registered Office</span>
            <h3 className="font-serif text-2xl mt-2 mb-3">Lagos, Nigeria</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.registeredAddress}
            </p>
          </Card>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--brand)', color: '#fff' }}>
        <div className="container">
          <SectionTitle
            eyebrow="Transparency & Governance"
            title="Trust is built through accountability."
            text="The organisation's constitution provides for trustees, regular general meetings, strict financial controls, and annual independent audits."
            light
          />
          <div className="pt-4">
            <Button asChild size="lg" className="bg-[var(--gold)] text-[#080b70] hover:bg-[var(--gold-soft)] font-bold">
              <Link href="/contact">
                Contact the Secretariat
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
