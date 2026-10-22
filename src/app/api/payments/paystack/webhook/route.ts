import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { safeEqualHexOrBase64 } from '@/lib/payments/common'
import { recordPaystackTransactionInDb } from '@/lib/payments/paystack'

export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature') || ''
  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex')

  if (!secret || !signature || !safeEqualHexOrBase64(expected, signature)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const event = JSON.parse(raw)

  if (event.event === 'charge.success' || event.event === 'charge.failed') {
    await recordPaystackTransactionInDb(event.data)
  }

  return NextResponse.json({ received: true })
}
