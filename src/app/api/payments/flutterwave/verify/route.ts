import { NextResponse } from 'next/server'
import { flutterwaveVerify } from '@/lib/payments/flutterwave'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const transactionId = String(body.transactionId || '')
    const reference = String(body.reference || '')
    if (!transactionId || !reference) return NextResponse.json({ error: 'Transaction ID and reference are required.' }, { status: 400 })
    const transaction = await flutterwaveVerify(transactionId)
    if (String(transaction.tx_ref) !== reference) return NextResponse.json({ error: 'Transaction reference mismatch.' }, { status: 400 })
    return NextResponse.json({ success: transaction.status === 'successful', transaction })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Verification failed.' }, { status: 400 })
  }
}
