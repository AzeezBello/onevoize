'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LockKeyhole, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter(); const supabase = createClient()
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e: FormEvent) { e.preventDefault(); setLoading(true); setError(''); const {error}=await supabase.auth.signInWithPassword({email,password}); if(error){setError(error.message);setLoading(false);return} router.replace('/admin'); router.refresh() }
  return <main className="min-h-screen grid lg:grid-cols-2 bg-[#fbfaf7]"><section className="hidden lg:flex bg-[#174b35] text-white p-16 flex-col justify-between"><div><div className="text-sm tracking-[.2em] uppercase font-bold">ONE VOIZE FRIENDS CLUB OF LAGOS</div><h1 className="text-6xl font-serif leading-tight mt-10">Admin<br/>Portal</h1><p className="text-white/70 max-w-md mt-6 text-lg">Manage campaigns, stories, programs, volunteers, events and donations from one secure workspace.</p></div><p className="text-white/50 text-sm">© 2026 ONE VOIZE FRIENDS CLUB OF LAGOS</p></section><section className="flex items-center justify-center p-6"><form onSubmit={submit} className="w-full max-w-md bg-white border border-[#e6e8e2] rounded-3xl p-8 shadow-sm"><div className="w-12 h-12 rounded-2xl bg-[#e9f0eb] text-[#174b35] grid place-items-center"><LockKeyhole/></div><h2 className="text-3xl font-serif mt-6">Welcome back</h2><p className="text-[#647067] mt-2">Sign in to manage the organization.</p><label className="block mt-7 text-sm font-semibold">Email<input className="mt-2 w-full rounded-xl border border-[#dfe4dc] px-4 py-3 outline-none focus:ring-2 focus:ring-[#174b35]/20" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label className="block mt-5 text-sm font-semibold">Password<input className="mt-2 w-full rounded-xl border border-[#dfe4dc] px-4 py-3 outline-none focus:ring-2 focus:ring-[#174b35]/20" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>{error&&<p className="mt-4 text-sm text-red-600">{error}</p>}<button disabled={loading} className="mt-7 w-full btn btn-primary rounded-xl disabled:opacity-60">{loading?'Signing in...':'Sign in'} <ArrowRight size={18}/></button></form></section></main>
}
