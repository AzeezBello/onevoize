import { NextResponse } from 'next/server'
import { flutterwaveInitialize } from '@/lib/payments/flutterwave'
import { newReference } from '@/lib/payments/common'
export async function POST(request: Request) {
  try {
    const body = await request.json(); const email=String(body.email||'').trim().toLowerCase(); const name=String(body.name||'').trim(); const amount=Number(body.amount); const anonymous=Boolean(body.isAnonymous)
    if (!email || !email.includes('@') || !name || !Number.isFinite(amount) || amount < 100) return NextResponse.json({error:'Enter a valid name, email and donation amount.'},{status:400})
    const reference=newReference('flutterwave')
    const base=process.env.NEXT_PUBLIC_SITE_URL||new URL(request.url).origin
    const payment=await flutterwaveInitialize({email,name,amount,txRef:reference,redirectUrl:`${base}/donate/complete?gateway=flutterwave&reference=${encodeURIComponent(reference)}`,metadata:{donor_name:anonymous?undefined:name,donation_type:body.donationType||'one_time'}})
    return NextResponse.json({authorizationUrl:payment.link,reference})
  } catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to start payment.'},{status:500})}
}
