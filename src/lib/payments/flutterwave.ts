const API = 'https://api.flutterwave.com/v3'
function secret() {
  const key = process.env.FLUTTERWAVE_SECRET_KEY
  if (!key) throw new Error('FLUTTERWAVE_SECRET_KEY is not configured')
  return key
}

export async function flutterwaveInitialize(input: {
  email: string
  name: string
  amount: number
  txRef: string
  redirectUrl: string
  metadata: Record<string, unknown>
}) {
  const response = await fetch(`${API}/payments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount: input.amount,
      currency: 'NGN',
      redirect_url: input.redirectUrl,
      customer: { email: input.email, name: input.name },
      customizations: { title: 'ONE VOIZE FRIENDS CLUB OF LAGOS', description: 'Donation' },
      meta: input.metadata,
    }),
    cache: 'no-store',
  })
  const data = await response.json()
  if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Flutterwave initialization failed')
  return data.data
}

export async function flutterwaveVerify(transactionId: string) {
  const response = await fetch(`${API}/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secret()}` }, cache: 'no-store',
  })
  const data = await response.json()
  if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Flutterwave verification failed')
  return data.data
}
