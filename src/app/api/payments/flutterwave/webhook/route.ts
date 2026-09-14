import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('flutterwave-signature') || ''
  const secret = process.env.FLUTTERWAVE_SECRET_HASH || ''
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('base64')
  if (!secret || !signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return new NextResponse('Unauthorized', { status: 401 })
  return NextResponse.json({ received: true })
}
