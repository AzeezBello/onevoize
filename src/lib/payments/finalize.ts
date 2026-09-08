import { createServiceClient } from '@/lib/supabase/service'

export async function finalizeDonation(args: {
  reference: string
  gateway: 'paystack' | 'flutterwave'
  gatewayTransactionId?: string | number | null
  amount: number
  currency: string
  status: 'success' | 'failed'
  raw: unknown
}) {
  const supabase = createServiceClient()
  const { data: donation, error } = await supabase.from('donations').select('*').eq('payment_reference', args.reference).single()
  if (error || !donation) throw new Error('Donation record not found')

  const expectedAmount = Number(donation.amount)
  const receivedAmount = Number(args.amount)
  const currency = String(args.currency || '').toUpperCase()
  const expectedCurrency = String(donation.currency || 'NGN').toUpperCase()

  if (receivedAmount !== expectedAmount || currency !== expectedCurrency) {
    await supabase.from('donations').update({ payment_status: 'failed', updated_at: new Date().toISOString(), payment_metadata: { error: 'amount_or_currency_mismatch', raw: args.raw } }).eq('id', donation.id)
    throw new Error('Payment amount or currency mismatch')
  }

  const paymentStatus = args.status === 'success' ? 'successful' : 'failed'
  const { data: updated, error: updateError } = await supabase.from('donations').update({
    payment_status: paymentStatus,
    gateway_transaction_id: args.gatewayTransactionId ? String(args.gatewayTransactionId) : null,
    verified_at: args.status === 'success' ? new Date().toISOString() : null,
    payment_metadata: args.raw,
    updated_at: new Date().toISOString(),
  }).eq('id', donation.id).select('*').single()
  if (updateError) throw updateError
  return updated
}
