import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature') || ''
  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex')

  if (!secret || !signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const event = JSON.parse(raw)

  if (event.event === 'charge.success') {
    const data = event.data
    const meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata ?? {})

    await db(
      `INSERT INTO donations
        (reference, donor_name, donor_email, amount, currency, status, campaign, channel, paid_at, metadata)
       VALUES ($1, $2, $3, $4, $5, 'success', $6, $7, $8, $9)
       ON CONFLICT (reference) DO UPDATE SET
         status   = 'success',
         paid_at  = EXCLUDED.paid_at,
         channel  = EXCLUDED.channel,
         metadata = EXCLUDED.metadata`,
      [
        data.reference,
        meta.donor_name ?? data.customer?.name ?? 'Anonymous',
        data.customer?.email ?? '',
        data.amount / 100,
        data.currency ?? 'NGN',
        meta.campaign ?? null,
        data.channel ?? null,
        data.paid_at ? new Date(data.paid_at) : new Date(),
        JSON.stringify(meta),
      ],
    )
  }

  return NextResponse.json({ received: true })
}
