import { SectionTitle } from '@/components/SectionTitle'
import { MailtoForm } from '@/components/MailtoForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { CheckCircle2, HeartHandshake } from 'lucide-react'

const volunteerAreas = [
  'Community Outreach & Relief Distribution',
  'Event Coordination & Social Logistics',
  'Youth Mentorship & Skills Training',
  'Fundraising, Media & Public Advocacy',
]

export default function Volunteer() {
  return (
    <section className="section">
      <div className="container two-col">
        <div className="space-y-6">
          <SectionTitle
            eyebrow="Get Involved"
            title="Give your time. Share your skills. Make a difference."
            text="Volunteers are the backbone of our community missions, powering every outreach and program."
          />

          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Opportunities
            </p>
            <div className="grid gap-2.5">
              {volunteerAreas.map(area => (
                <div
                  key={area}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border/70 bg-card text-sm font-medium text-foreground hover:border-border transition-colors"
                >
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="border border-border/80 shadow-sm p-6 sm:p-8">
          <CardHeader className="p-0 pb-5">
            <div className="flex items-center gap-2">
              <HeartHandshake size={18} className="text-primary" />
              <CardTitle className="text-base font-semibold tracking-normal normal-case">
                Volunteer Registration
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Tell us how you would like to contribute your time and expertise.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <MailtoForm
              subject="Volunteer Registration — ONE VOIZE"
              submitLabel="Submit Volunteer Application"
              successMessage="Your volunteer application is drafted. Please review and send it directly from your email client."
              fields={[
                { label: 'Full Name', name: 'name', required: true, minLength: 2 },
                { label: 'Email Address', name: 'email', type: 'email', required: true },
                { label: 'Phone Number', name: 'phone', type: 'tel', required: true },
                { label: 'Area of Interest', name: 'interest', required: true, minLength: 2 },
                { label: 'Tell Us About Your Skills & Availability', name: 'message', type: 'textarea', required: true, minLength: 15 },
              ]}
              className="space-y-4"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
