import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature') || ''
  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex')
  if (!secret || !signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return new NextResponse('Unauthorized', { status: 401 })
  return NextResponse.json({ received: true })
}
