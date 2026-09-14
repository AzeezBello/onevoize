import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MembershipForm } from '@/components/MembershipForm'
import { PrintFormButton } from '@/components/PrintFormButton'

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-5">
              Membership Application
            </Badge>

            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Join Global Voize Club.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Complete the online application below. Membership is open to
              responsible adults who share the club&apos;s values of solidarity,
              service, and shared responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Information column */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-4">
                Before you apply
              </Badge>

              <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Membership starts with shared responsibility.
              </h2>

              <p className="mt-5 text-base leading-8 text-muted-foreground">
                New members are screened through the appointed committee and
                should be known to an existing member. Please review the club
                constitution before applying.
              </p>
            </div>

            <Separator />

            <div className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>
                By submitting this application, you confirm that the information
                provided is accurate and that you understand the club&apos;s
                membership expectations.
              </p>

              <p>
                Your email application will open in your preferred email
                application for review and submission.
              </p>
            </div>

            <PrintFormButton />
          </div>

          {/* Form column */}
          <MembershipForm />
        </div>
      </section>
    </main>
  )
}