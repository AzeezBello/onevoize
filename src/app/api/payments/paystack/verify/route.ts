import { NextResponse } from 'next/server'
import { paystackVerify } from '@/lib/payments/paystack'

export async function POST(request: Request) {
  try {
    const { reference } = await request.json()
    if (!reference) return NextResponse.json({ error: 'Reference is required.' }, { status: 400 })
    const transaction = await paystackVerify(String(reference))
    return NextResponse.json({ success: transaction.status === 'success', transaction })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Verification failed.' }, { status: 400 })
  }
}
