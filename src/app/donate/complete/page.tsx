'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function CompleteContent() {
	const params = useSearchParams()
	const gateway = params.get('gateway')
	const reference = params.get('reference') || ''
	const transactionId = params.get('transaction_id') || params.get('transactionId') || ''
	const [state, setState] = useState<'loading' | 'success' | 'failed'>(reference ? 'loading' : 'failed')
	const [error, setError] = useState('')

	useEffect(() => {
		if (!reference) return

		;(async () => {
			try {
				const endpoint = gateway === 'flutterwave'
					? '/api/payments/flutterwave/verify'
					: '/api/payments/paystack/verify'
				const body = gateway === 'flutterwave' ? { reference, transactionId } : { reference }
				const res = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				})
				const data = await res.json()
				if (!res.ok || !data.success) throw new Error(data.error || 'Payment could not be verified')
				setState('success')
			} catch (e) {
				setError(e instanceof Error ? e.message : 'Payment verification failed')
				setState('failed')
			}
		})()
	}, [gateway, reference, transactionId])

	return <section className="section"><div className="container" style={{ maxWidth: 720, textAlign: 'center' }}>{state === 'loading' ? <><h1 className="serif">Confirming your donation…</h1><p className="muted">Please wait while we securely verify your payment.</p></> : state === 'success' ? <><div className="eyebrow">Thank you</div><h1 className="serif">Your donation was successful.</h1><p className="muted">Reference: <strong>{reference}</strong></p><Link className="btn btn-light" href="/">Return Home</Link></> : <><h1 className="serif">We could not confirm the payment.</h1><p className="muted">{error}</p><Link className="btn btn-primary" href="/donate">Try Again</Link></>}</div></section>
}

function LoadingState() {
	return <section className="section"><div className="container" style={{ maxWidth: 720, textAlign: 'center' }}><h1 className="serif">Confirming your donation…</h1><p className="muted">Please wait while we securely verify your payment.</p></div></section>
}

export default function Complete() {
	return <Suspense fallback={<LoadingState />}><CompleteContent /></Suspense>
}
