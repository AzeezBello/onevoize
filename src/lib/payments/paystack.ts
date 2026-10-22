import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

const API = 'https://api.paystack.co'

function secret() {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured')
  return key
}

export function resolvePaystackCallbackUrl(requestUrl: string, reference: string) {
  const siteBase = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(requestUrl).origin)
  ).replace(/\/$/, '')

  const callbackBase = (process.env.PAYSTACK_CALLBACK_URL || `${siteBase}/donate/complete`).trim()
  const separator = callbackBase.includes('?') ? '&' : '?'
  return `${callbackBase}${separator}reference=${encodeURIComponent(reference)}`
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
      metadata: input.metadata,
    }),
    cache: 'no-store',
  })
  const data = await response.json()
  if (!response.ok || !data.status) throw new Error(data.message || 'Paystack initialization failed')
  return data.data
}

export async function paystackVerify(reference: string) {
  const response = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
    cache: 'no-store',
  })
  const data = await response.json()
  if (!response.ok || !data.status) throw new Error(data.message || 'Paystack verification failed')
  return data.data
}

export interface PaystackTransactionPayload {
  reference: string
  status?: string
  amount?: number
  currency?: string
  channel?: string | null
  paid_at?: string | null
  metadata?: string | Record<string, unknown> | null
  customer?: {
    name?: string | null
    first_name?: string | null
    last_name?: string | null
    email?: string | null
  } | null
}

/**
 * Idempotently records or updates a Paystack transaction in Neon DB (`donations` table)
 * and increments the linked campaign's `raised_amount` exactly once when transitioning to `'success'`.
 */
export async function recordPaystackTransactionInDb(data: PaystackTransactionPayload) {
  let meta: Record<string, unknown> = {}
  if (typeof data.metadata === 'string' && data.metadata.trim()) {
    try {
      meta = JSON.parse(data.metadata)
    } catch {
      meta = {}
    }
  } else if (data.metadata && typeof data.metadata === 'object') {
    meta = data.metadata as Record<string, unknown>
  }

  const rawStatus = String(data.status || '').toLowerCase()
  const status: 'success' | 'pending' | 'failed' =
    rawStatus === 'success'
      ? 'success'
      : ['failed', 'abandoned', 'reversed'].includes(rawStatus)
        ? 'failed'
        : 'pending'

  const isAnonymous = Boolean(meta.is_anonymous)
  const customerFullName = [data.customer?.first_name, data.customer?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  const donorName = isAnonymous
    ? 'Anonymous'
    : String(meta.donor_name || data.customer?.name || customerFullName || 'Anonymous').trim()
  const donorEmail = String(data.customer?.email || meta.donor_email || '').trim().toLowerCase()
  const amount = Number(data.amount || 0) / 100
  const currency = String(data.currency || 'NGN')
  const campaign = meta.campaign ? String(meta.campaign).trim() : null
  const message = meta.message ? String(meta.message).trim() : null
  const channel = data.channel ? String(data.channel) : null
  const paidAt =
    status === 'success'
      ? data.paid_at
        ? new Date(data.paid_at).toISOString()
        : new Date().toISOString()
      : null

  const rows = await db<{
    id: number
    reference: string
    donor_name: string
    donor_email: string
    amount: string
    currency: string
    status: 'success' | 'pending' | 'failed'
    campaign: string | null
    message: string | null
    channel: string | null
    paid_at: string | null
    previous_status: string | null
  }>(
    `WITH prev AS (
       SELECT status FROM donations WHERE reference = $1
     ),
     upserted AS (
       INSERT INTO donations
         (reference, donor_name, donor_email, amount, currency, status, campaign, message, channel, paid_at, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)
       ON CONFLICT (reference) DO UPDATE SET
         status   = CASE WHEN donations.status = 'success' THEN 'success' ELSE EXCLUDED.status END,
         paid_at  = COALESCE(donations.paid_at, EXCLUDED.paid_at),
         channel  = COALESCE(EXCLUDED.channel, donations.channel),
         campaign = COALESCE(donations.campaign, EXCLUDED.campaign),
         message  = COALESCE(donations.message, EXCLUDED.message),
         metadata = COALESCE(donations.metadata, '{}'::jsonb) || COALESCE(EXCLUDED.metadata, '{}'::jsonb)
       RETURNING *, (SELECT status FROM prev) AS previous_status
     )
     SELECT * FROM upserted`,
    [
      data.reference,
      donorName,
      donorEmail,
      amount,
      currency,
      status,
      campaign,
      message,
      channel,
      paidAt,
      JSON.stringify(meta),
    ],
  )

  const record = rows[0]

  // Increment campaign raised_amount only on the first transition to 'success'
  if (status === 'success' && record && record.previous_status !== 'success' && record.campaign) {
    await db(
      `UPDATE campaigns
       SET raised_amount = COALESCE(raised_amount, 0) + $1,
           updated_at = NOW()
       WHERE LOWER(title) = LOWER($2) OR LOWER(slug) = LOWER($2) OR CAST(id AS TEXT) = $2`,
      [amount, record.campaign],
    )
  }

  try {
    revalidatePath('/dashboard/donations')
    revalidatePath('/dashboard/campaigns')
    revalidatePath('/dashboard')
    revalidatePath('/campaigns')
  } catch {
    // Ignore revalidatePath errors if called outside standard request context
  }

  return record
}
