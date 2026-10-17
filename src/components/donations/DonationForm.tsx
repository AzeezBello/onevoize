'use client'

import { FormEvent, useState } from 'react'
import { Loader2, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { tapScale, springConfig } from '@/lib/motion'
import { cn } from '@/lib/utils'

const amounts = [5000, 10000, 25000, 50000]

export default function DonationForm({ campaignId }: { campaignId?: string }) {
  const [amount, setAmount] = useState(10000)
  const [custom, setCustom] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shouldReduce = useReducedMotion()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const value = Number(custom || amount)
    if (name.trim().length < 2) return setError('Please enter your full name.')
    if (!email.includes('@')) return setError('Please enter a valid email address.')
    if (!Number.isFinite(value) || value < 100) return setError('Minimum donation is ₦100.')

    setLoading(true)
    try {
      const response = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: value,
          name: name.trim(),
          email: email.trim(),
          campaignId,
          isAnonymous: anonymous,
          donationType: 'one_time',
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.authorizationUrl) throw new Error(data.error || 'Unable to start payment')
      window.location.href = data.authorizationUrl
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Payment initialization failed')
      setLoading(false)
    }
  }

  return (
    <Card className="border border-border/80 shadow-md overflow-hidden bg-card">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Heart size={16} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-normal normal-case">
                Make a Secure Donation
              </CardTitle>
              <CardDescription className="text-xs">
                Processed securely via Paystack
              </CardDescription>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={12} />
            Encrypted
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={submit} className="space-y-5" noValidate>
          {/* Amount Selection with Emil Kowalski sliding pill spring */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Amount (NGN)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-muted/50 rounded-xl border border-border/60">
              {amounts.map(value => {
                const isSelected = amount === value && !custom
                return (
                  <motion.button
                    type="button"
                    key={value}
                    whileTap={shouldReduce ? {} : tapScale}
                    onClick={() => {
                      setAmount(value)
                      setCustom('')
                    }}
                    className={cn(
                      'relative py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors duration-150 text-center select-none',
                      isSelected
                        ? 'text-primary-foreground font-bold'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="donation-amount-pill"
                        className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                        transition={springConfig.snappy}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 tabular-nums">₦{value.toLocaleString()}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="custom-amount" className="text-xs font-medium text-foreground">
              Or enter custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                ₦
              </span>
              <Input
                id="custom-amount"
                value={custom}
                onChange={event => setCustom(event.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 15,000"
                inputMode="numeric"
                className="pl-8 text-sm tabular-nums"
              />
            </div>
          </div>

          {/* Donor details */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="donor-name" className="text-xs font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="donor-name"
                required
                minLength={2}
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="Adeola Adeleke"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="donor-email" className="text-xs font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="donor-email"
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="adeola@example.com"
                className="text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={event => setAnonymous(event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>Make my donation anonymous on public records</span>
            </label>
          </div>

          {/* Error alert with spring reveal */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={springConfig.snappy}
                className="rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-xs text-destructive"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button with tactile spring */}
          <motion.div whileTap={shouldReduce ? {} : tapScale}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold shadow-sm gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Connecting to Paystack…
                </>
              ) : (
                <>
                  <Heart size={16} className="fill-current" />
                  Donate ₦{Number(custom || amount).toLocaleString()} Now
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}
