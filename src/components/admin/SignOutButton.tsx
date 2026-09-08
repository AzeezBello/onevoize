'use client'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function SignOutButton(){const router=useRouter();async function out(){await createClient().auth.signOut();router.replace('/admin/login');router.refresh()}return <button onClick={out} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white"><LogOut size={16}/>Sign out</button>}
