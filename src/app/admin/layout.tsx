import Link from 'next/link'
import { LayoutDashboard, FileText, Megaphone, HeartHandshake, Users, CalendarDays, BookOpen, MessageSquare, Settings, LogOut, FolderKanban, ShieldCheck } from 'lucide-react'
import { requireAdmin } from '@/lib/admin'
import SignOutButton from '@/components/admin/SignOutButton'

const groups = [
  {title:'Overview',items:[['Dashboard','/admin',LayoutDashboard]]},
  {title:'Content',items:[['Programs','/admin/programs',FolderKanban],['Projects','/admin/projects',FolderKanban],['Campaigns','/admin/campaigns',Megaphone],['Blog','/admin/blog',BookOpen],['Media Library','/admin/media',FileText],['Events','/admin/events',CalendarDays]]},
  {title:'People',items:[['Team','/admin/team',Users],['Board','/admin/board',ShieldCheck],['Volunteers','/admin/volunteers',HeartHandshake]]},
  {title:'Operations',items:[['Donations','/admin/donations',HeartHandshake],['Messages','/admin/messages',MessageSquare],['Settings','/admin/settings',Settings]]},
]
export default async function AdminLayout({children}:{children:React.ReactNode}) { const {user,profile}=await requireAdmin(); if(!user) return <>{children}</>; return <div className="min-h-screen bg-[#f6f7f3] flex"><aside className="w-64 bg-[#123a2a] text-white hidden md:flex flex-col fixed inset-y-0"><div className="p-6 border-b border-white/10"><Link href="/admin" className="font-serif text-xl">ONE VOIZE<br/>FRIENDS CLUB OF LAGOS</Link><div className="text-[10px] tracking-[.18em] uppercase text-white/50 mt-2">Admin workspace</div></div><nav className="p-4 space-y-5 overflow-y-auto flex-1">{groups.map(g=><div key={g.title}><div className="text-[10px] uppercase tracking-[.18em] text-white/40 px-3 mb-2">{g.title}</div>{g.items.map(([label,href,Icon]:any)=><Link key={label} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/10"><Icon size={17}/>{label}</Link>)}</div>)}</nav><div className="p-4 border-t border-white/10"><div className="text-xs text-white/50 mb-2 truncate">{user.email}</div><SignOutButton/></div></aside><main className="md:ml-64 flex-1 min-w-0"><div className="md:hidden bg-[#123a2a] text-white p-4 flex justify-between"><Link href="/admin" className="font-serif">ONE VOIZE FRIENDS CLUB OF LAGOS</Link><SignOutButton/></div>{children}</main></div> }
