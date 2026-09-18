'use client'

import { FormEvent, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const amounts = [5000, 10000, 25000, 50000]

export default function DonationForm({ campaignId }: { campaignId?: string }) {
  const [amount, setAmount] = useState(10000)
  const [custom, setCustom] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        body: JSON.stringify({ amount: value, name: name.trim(), email: email.trim(), campaignId, isAnonymous: anonymous, donationType: 'one_time' }),
      })
      const data = await response.json()
      if (!response.ok || !data.authorizationUrl) throw new Error(data.error || 'Unable to start payment')
      window.location.href = data.authorizationUrl
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Payment failed')
      setLoading(false)
    }
  }

  return <Card className="donation-card"><CardContent><form onSubmit={submit} className="donation-card" noValidate>
    <div className="amount-grid">{amounts.map(value => <button type="button" key={value} className={amount === value && !custom ? 'selected' : ''} onClick={() => { setAmount(value); setCustom('') }}>₦{value.toLocaleString()}</button>)}</div>
    <label className="sr-only" htmlFor="custom-amount">Custom amount</label><input id="custom-amount" value={custom} onChange={event => setCustom(event.target.value.replace(/[^0-9]/g, ''))} placeholder="Custom amount" inputMode="numeric"/>
    <label className="sr-only" htmlFor="donor-name">Full name</label><input id="donor-name" required minLength={2} value={name} onChange={event => setName(event.target.value)} placeholder="Full name"/>
    <label className="sr-only" htmlFor="donor-email">Email address</label><input id="donor-email" required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address"/>
    <label className="check"><input type="checkbox" checked={anonymous} onChange={event => setAnonymous(event.target.checked)}/> Make my donation anonymous</label>
    {error && <p role="alert" style={{ color: '#b42318', margin: 0 }}>{error}</p>}
    <Button className="btn btn-primary" type="submit" disabled={loading} style={{ border: 0, cursor: loading ? 'wait' : 'pointer' }}>{loading ? <><Loader2 className="spin" size={17}/> Starting payment…</> : 'Continue to payment'}</Button>
  </form></CardContent></Card>
}
