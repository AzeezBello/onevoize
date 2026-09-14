'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MailtoForm } from '@/components/MailtoForm'

export function MembershipForm() {
  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/20 px-5 py-6 sm:px-8">
        <Badge variant="secondary" className="mb-3 w-fit">
          Application Form
        </Badge>

        <CardTitle className="font-serif text-2xl sm:text-3xl">
          Become a member
        </CardTitle>

        <p className="text-sm leading-6 text-muted-foreground">
          Please complete all required fields carefully.
        </p>
      </CardHeader>

      <CardContent className="px-5 py-6 sm:px-8">
        <MailtoForm
          subject="New Global Voize Club membership application"
          submitLabel="Open email application"
          successMessage="Your email draft is ready. Please review it and send it from your email app."
          fields={[
            {
              label: 'Full name',
              name: 'full-name',
              required: true,
              minLength: 2,
            },
            {
              label: 'Email address',
              name: 'email',
              type: 'email',
              required: true,
            },
            {
              label: 'Phone number',
              name: 'phone',
              type: 'tel',
              required: true,
            },
            {
              label: 'Residential address',
              name: 'address',
              required: true,
              minLength: 8,
            },
            {
              label: 'Occupation',
              name: 'occupation',
              required: true,
              minLength: 2,
            },
            {
              label: 'Why would you like to join?',
              name: 'reason',
              type: 'textarea',
              required: true,
              minLength: 20,
            },
          ]}
          className="space-y-5"
        />
      </CardContent>
    </Card>
  )
}