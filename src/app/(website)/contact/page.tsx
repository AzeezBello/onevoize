import { SectionTitle } from '@/components/SectionTitle'
import { MailtoForm } from '@/components/MailtoForm'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { siteConfig } from '@/lib/site'

export default function Contact() {
  return (
    <section className="section">
      <div className="container two-col">
        <div className="space-y-6">
          <SectionTitle
            eyebrow="Contact Us"
            title="Let's start a conversation."
            text="Have questions about our initiatives, partnerships, volunteering, or donations? Get in touch with the secretariat."
          />

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</p>
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-sm font-medium hover:text-primary transition-colors">
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Office Address</p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {siteConfig.registeredAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Office Hours</p>
                <p className="text-sm text-foreground/90">
                  Monday – Friday, 9:00 AM – 5:00 PM WAT
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border border-border/80 shadow-sm p-6 sm:p-8">
          <CardContent className="p-0">
            <MailtoForm
              subject="Website Contact Message — ONE VOIZE"
              submitLabel="Open Email Draft"
              successMessage="Your message is drafted. Please review and send it directly from your email application."
              fields={[
                { label: 'Your Full Name', name: 'name', required: true, minLength: 2 },
                { label: 'Email Address', name: 'email', type: 'email', required: true },
                { label: 'Subject', name: 'subject', required: true, minLength: 3 },
                { label: 'Your Message', name: 'message', type: 'textarea', required: true, minLength: 10 },
              ]}
              className="space-y-4"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
