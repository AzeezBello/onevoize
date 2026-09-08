import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { paystackVerify } from '@/lib/payments/paystack'
import { finalizeDonation } from '@/lib/payments/finalize'
export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature') || ''
  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex')
  if (!secret || !signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return new NextResponse('Unauthorized', { status: 401 })
  try {
    const event = JSON.parse(raw)
    if (event.event === 'charge.success' && event.data?.reference) {
      const tx = await paystackVerify(event.data.reference)
      await finalizeDonation({ reference: event.data.reference, gateway: 'paystack', gatewayTransactionId: tx.id, amount: Number(tx.amount)/100, currency: tx.currency, status: tx.status === 'success' ? 'success' : 'failed', raw: tx })
    }
    return NextResponse.json({ received: true })
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Webhook failed' }, { status: 500 }) }
}
