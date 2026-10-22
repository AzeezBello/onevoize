import { NextResponse } from 'next/server'
import { paystackVerify, recordPaystackTransactionInDb } from '@/lib/payments/paystack'

/**
 * GET /api/payments/paystack/callback
 * Server-side Paystack callback handler.
 * Verifies the transaction with Paystack, persists the result to Neon DB (`donations` + `campaigns`),
 * and redirects the donor to `/donate/complete?reference=...`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const reference = (url.searchParams.get('reference') || url.searchParams.get('trxref') || '').trim()

  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : url.origin)
  ).replace(/\/$/, '')

  if (!reference) {
    return NextResponse.redirect(new URL('/donate/complete?status=missing_reference', base))
  }

  try {
    const transaction = await paystackVerify(reference)
    await recordPaystackTransactionInDb(transaction)
    return NextResponse.redirect(
      new URL(`/donate/complete?reference=${encodeURIComponent(reference)}`, base),
    )
  } catch {
    return NextResponse.redirect(
      new URL(`/donate/complete?reference=${encodeURIComponent(reference)}&status=error`, base),
    )
  }
}
