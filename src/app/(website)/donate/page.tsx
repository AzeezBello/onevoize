import DonationForm from '@/components/donations/DonationForm'
import { ShieldCheck, HeartHandshake, Award } from 'lucide-react'

export default function Donate() {
  return (
    <section className="section" style={{ background: 'var(--surface)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="text-center mb-8 space-y-3">
          <span className="eyebrow inline-block">Make a Difference</span>
          <h1 className="serif text-foreground font-bold" style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.05 }}>
            Give back today.
          </h1>
          <p className="muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Your generous donation funds transparent community campaigns, educational outreach, and essential welfare support across Africa.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              100% Secure via Paystack
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <HeartHandshake size={14} className="text-primary" />
              Audited Incorporated Trustee
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Award size={14} className="text-amber-500" />
              Direct Community Impact
            </span>
          </div>
        </div>

        <DonationForm />
      </div>
    </section>
  )
}
