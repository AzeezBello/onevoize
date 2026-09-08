const API = 'https://api.paystack.co'

function secret() {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured')
  return key
}

export async function paystackInitialize(input: {
  email: string
  amount: number
  reference: string
  callbackUrl: string
  metadata: Record<string, unknown>
}) {
  const response = await fetch(`${API}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amount * 100),
      currency: 'NGN',
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: JSON.stringify(input.metadata),
    }),
    cache: 'no-store',
  })
  const data = await response.json()
  if (!response.ok || !data.status) throw new Error(data.message || 'Paystack initialization failed')
  return data.data
}

export async function paystackVerify(reference: string) {
  const response = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` }, cache: 'no-store',
  })
  const data = await response.json()
  if (!response.ok || !data.status) throw new Error(data.message || 'Paystack verification failed')
  return data.data
}
