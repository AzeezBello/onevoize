import { NextResponse } from 'next/server'
import { paystackInitialize, resolvePaystackCallbackUrl } from '@/lib/payments/paystack'
import { newReference } from '@/lib/payments/common'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const name = String(body.name || '').trim()
    const amount = Number(body.amount)
    const anonymous = Boolean(body.isAnonymous)
    const campaign = body.campaign || body.campaignId ? String(body.campaign || body.campaignId).trim() : null
    const message = body.message ? String(body.message).trim() : null
    const donationType = String(body.donationType || 'one_time')

    if (!email || !email.includes('@') || !name || !Number.isFinite(amount) || amount < 100) {
      return NextResponse.json(
        { error: 'Enter a valid name, email and donation amount (minimum ₦100).' },
        { status: 400 },
      )
    }

    const reference = newReference()
    const callbackUrl = resolvePaystackCallbackUrl(request.url, reference)
    const donorDisplayName = anonymous ? 'Anonymous' : name

    const metadata: Record<string, unknown> = {
      donor_name: donorDisplayName,
      donor_email: email,
      is_anonymous: anonymous,
      donation_type: donationType,
      ...(campaign ? { campaign } : {}),
      ...(message ? { message } : {}),
    }

    const payment = await paystackInitialize({
      email,
      amount,
      reference,
      callbackUrl,
      metadata,
    })

    // Record the pending transaction in Neon DB
    await db(
      `INSERT INTO donations
        (reference, donor_name, donor_email, amount, currency, status, campaign, message, metadata)
       VALUES ($1, $2, $3, $4, 'NGN', 'pending', $5, $6, $7::jsonb)
       ON CONFLICT (reference) DO NOTHING`,
      [reference, donorDisplayName, email, amount, campaign, message, JSON.stringify(metadata)],
    )

    return NextResponse.json({
      authorizationUrl: payment.authorization_url,
      reference,
      callbackUrl,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unable to start payment.' },
      { status: 500 },
    )
  }
}
