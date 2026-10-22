'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, ArrowRight, RotateCcw, Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface VerifiedDonation {
  reference: string
  donor_name: string
  donor_email: string
  amount: string | number
  currency: string
  status: 'success' | 'pending' | 'failed'
  campaign?: string | null
  channel?: string | null
  paid_at?: string | null
}

function formatNgn(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function CompleteContent() {
  const params = useSearchParams()
  const reference = params.get('reference') || params.get('trxref') || ''
  const [state, setState] = useState<'loading' | 'success' | 'failed'>(
    reference ? 'loading' : 'failed',
  )
  const [error, setError] = useState(
    reference ? '' : 'Missing payment reference in callback URL.',
  )
  const [donation, setDonation] = useState<VerifiedDonation | null>(null)

  useEffect(() => {
    if (!reference) return

    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/payments/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        })
        const data = await res.json()
        if (!active) return
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Payment could not be verified.')
        }
        setDonation(data.donation ?? null)
        setState('success')
      } catch (e) {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Payment verification failed.')
        setState('failed')
      }
    })()

    return () => {
      active = false
    }
  }, [reference])

  return (
    <section className="section" style={{ background: 'var(--surface)' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <Card className="border border-border/80 shadow-md overflow-hidden bg-card">
          {state === 'loading' && (
            <>
              <CardHeader className="text-center pt-8 pb-4">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Loader2 className="animate-spin" size={28} />
                </div>
                <CardTitle className="text-xl font-serif tracking-normal normal-case">
                  Confirming your donation…
                </CardTitle>
                <CardDescription className="text-sm">
                  Please wait while we securely verify your payment with Paystack and record your receipt.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8 text-center text-xs text-muted-foreground font-mono">
                Reference: {reference}
              </CardContent>
            </>
          )}

          {state === 'success' && (
            <>
              <CardHeader className="text-center pt-8 pb-4 border-b border-border/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <CheckCircle2 size={30} />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Payment Verified &amp; Recorded
                </span>
                <CardTitle className="text-2xl font-serif tracking-normal normal-case mt-1">
                  Thank you for your generosity!
                </CardTitle>
                <CardDescription className="text-sm">
                  Your donation has been confirmed and saved to our community records.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/60">
                    <Receipt size={14} />
                    Official Receipt Summary
                  </div>
                  {donation?.amount != null && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-base">
                        {formatNgn(Number(donation.amount))}
                      </span>
                    </div>
                  )}
                  {donation?.donor_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Donor</span>
                      <span className="font-medium text-foreground">{donation.donor_name}</span>
                    </div>
                  )}
                  {donation?.campaign && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Campaign</span>
                      <span className="font-medium text-foreground">{donation.campaign}</span>
                    </div>
                  )}
                  {donation?.channel && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Channel</span>
                      <span className="font-medium text-foreground capitalize">
                        {donation.channel.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs text-foreground">{reference}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
                <Button asChild variant="outline" className="w-full sm:w-1/2">
                  <Link href="/campaigns">View Campaigns</Link>
                </Button>
                <Button asChild className="w-full sm:w-1/2 gap-2">
                  <Link href="/">
                    Return Home
                    <ArrowRight size={15} />
                  </Link>
                </Button>
              </CardFooter>
            </>
          )}

          {state === 'failed' && (
            <>
              <CardHeader className="text-center pt-8 pb-4 border-b border-border/60 bg-rose-50/40 dark:bg-rose-950/20">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                  <XCircle size={30} />
                </div>
                <CardTitle className="text-xl font-serif tracking-normal normal-case">
                  We could not confirm the payment
                </CardTitle>
                <CardDescription className="text-sm text-destructive">
                  {error}
                </CardDescription>
              </CardHeader>

              {reference && (
                <CardContent className="pt-5 text-center text-xs text-muted-foreground">
                  Reference: <span className="font-mono text-foreground">{reference}</span>
                </CardContent>
              )}

              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 pb-6">
                <Button asChild variant="outline" className="w-full sm:w-1/2">
                  <Link href="/">Return Home</Link>
                </Button>
                <Button asChild className="w-full sm:w-1/2 gap-2">
                  <Link href="/donate">
                    <RotateCcw size={15} />
                    Try Again
                  </Link>
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <section className="section" style={{ background: 'var(--surface)' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <Card className="border border-border/80 shadow-md overflow-hidden bg-card">
          <CardHeader className="text-center py-10">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="animate-spin" size={28} />
            </div>
            <CardTitle className="text-xl font-serif tracking-normal normal-case">
              Confirming your donation…
            </CardTitle>
            <CardDescription className="text-sm">
              Please wait while we securely verify your payment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  )
}

export default function Complete() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CompleteContent />
    </Suspense>
  )
}
