import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { paystackInitialize } from '@/lib/payments/paystack'
import { newReference } from '@/lib/payments/common'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const name = String(body.name || '').trim()
    const amount = Number(body.amount)
    const campaignId = body.campaignId || null
    const anonymous = Boolean(body.isAnonymous)
    if (!email || !email.includes('@') || !name || !Number.isFinite(amount) || amount < 100) return NextResponse.json({ error: 'Enter a valid name, email and donation amount.' }, { status: 400 })

    const supabase = createServiceClient()
    let campaign = null
    if (campaignId) {
      const { data } = await supabase.from('campaigns').select('id,title,status').eq('id', campaignId).eq('status','published').single()
      if (!data) return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 })
      campaign = data
    }
    const reference = newReference('paystack')
    const { data: donor } = await supabase.from('donors').upsert({ name, email }, { onConflict: 'email_normalized' }).select('id').single()
    const { error } = await supabase.from('donations').insert({ donor_id: donor?.id || null, campaign_id: campaign?.id || null, amount, currency: 'NGN', payment_gateway: 'paystack', payment_reference: reference, payment_status: 'pending', donation_type: body.donationType || 'one_time', is_anonymous: anonymous, donor_name: anonymous ? null : name, donor_email: email })
    if (error) throw error
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
    const payment = await paystackInitialize({ email, amount, reference, callbackUrl: `${base}/donate/complete?gateway=paystack&reference=${encodeURIComponent(reference)}`, metadata: { donation_reference: reference, campaign_id: campaign?.id || null } })
    return NextResponse.json({ authorizationUrl: payment.authorization_url, reference })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unable to start payment.' }, { status: 500 })
  }
}
