import { NextResponse } from 'next/server'
import { paystackVerify } from '@/lib/payments/paystack'
import { finalizeDonation } from '@/lib/payments/finalize'
export async function POST(request: Request) {
  try {
    const { reference } = await request.json()
    if (!reference) return NextResponse.json({ error: 'Reference is required.' }, { status: 400 })
    const tx = await paystackVerify(reference)
    const donation = await finalizeDonation({ reference, gateway: 'paystack', gatewayTransactionId: tx.id, amount: Number(tx.amount) / 100, currency: tx.currency, status: tx.status === 'success' ? 'success' : 'failed', raw: tx })
    return NextResponse.json({ success: donation.payment_status === 'successful', donation, receiptToken: donation.receipt_token })
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Verification failed.' }, { status: 400 }) }
}
