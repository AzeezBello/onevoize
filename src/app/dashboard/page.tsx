import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/dashboard/StatCard';
import { Heart, Users, CalendarDays, Megaphone, TrendingUp } from 'lucide-react';
import Link from 'next/link';

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

async function getStats() {
  const [donations, members, events, campaigns, recent] = await Promise.all([
    db('SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM donations WHERE status = $1', ['success']),
    db('SELECT COUNT(*) as count FROM members WHERE status = $1', ['active']),
    db("SELECT COUNT(*) as count FROM events WHERE status IN ('upcoming','ongoing')"),
    db("SELECT COUNT(*) as count, COALESCE(SUM(goal_amount),0) as goal, COALESCE(SUM(raised_amount),0) as raised FROM campaigns WHERE status = 'active'"),
    db('SELECT donor_name, donor_email, amount, paid_at, campaign FROM donations WHERE status = $1 ORDER BY paid_at DESC LIMIT 8', ['success']),
  ]);
  return {
    totalRaised: Number(donations[0]?.total ?? 0),
    donationCount: Number(donations[0]?.count ?? 0),
    memberCount: Number(members[0]?.count ?? 0),
    upcomingEvents: Number(events[0]?.count ?? 0),
    activeCampaigns: Number(campaigns[0]?.count ?? 0),
    campaignGoal: Number(campaigns[0]?.goal ?? 0),
    campaignRaised: Number(campaigns[0]?.raised ?? 0),
    recentDonations: recent as unknown as Array<{ donor_name: string; donor_email: string; amount: string; paid_at: string; campaign: string }>,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/dashboard/login');

  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[--foreground]">Welcome back, {session.user.name.split(' ')[0]} 👋</h2>
        <p className="text-sm text-[--muted]">Here&apos;s what&apos;s happening with ONE VOIZE today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Raised"
          value={fmt(stats.totalRaised)}
          sub={`${stats.donationCount} donations`}
          icon={<Heart size={18} />}
          color="blue"
        />
        <StatCard
          label="Active Members"
          value={stats.memberCount.toLocaleString()}
          icon={<Users size={18} />}
          color="green"
        />
        <StatCard
          label="Upcoming Events"
          value={stats.upcomingEvents}
          icon={<CalendarDays size={18} />}
          color="gold"
        />
        <StatCard
          label="Active Campaigns"
          value={stats.activeCampaigns}
          sub={`${fmt(stats.campaignRaised)} / ${fmt(stats.campaignGoal)} goal`}
          icon={<Megaphone size={18} />}
          color="red"
        />
      </div>

      {/* Campaign progress */}
      {stats.campaignGoal > 0 && (
        <div className="rounded-xl border border-[--border] bg-[--card] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[--foreground] flex items-center gap-2">
              <TrendingUp size={16} className="text-[--primary]" />
              Campaign Progress
            </h3>
            <Link href="/dashboard/campaigns" className="text-xs text-[--primary] hover:underline">View all →</Link>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[--muted]">
              <span>{fmt(stats.campaignRaised)} raised</span>
              <span>{fmt(stats.campaignGoal)} goal</span>
            </div>
            <div className="h-2.5 rounded-full bg-[--border] overflow-hidden">
              <div
                className="h-full rounded-full bg-[--primary] transition-all"
                style={{ width: `${Math.min(100, (stats.campaignRaised / stats.campaignGoal) * 100).toFixed(1)}%` }}
              />
            </div>
            <p className="text-xs text-[--muted] text-right">
              {((stats.campaignRaised / stats.campaignGoal) * 100).toFixed(1)}% of goal reached
            </p>
          </div>
        </div>
      )}

      {/* Recent donations */}
      <div className="rounded-xl border border-[--border] bg-[--card] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
          <h3 className="font-semibold text-[--foreground]">Recent Donations</h3>
          <Link href="/dashboard/donations" className="text-xs text-[--primary] hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--muted-surface]">
              <tr>
                {['Donor', 'Email', 'Amount', 'Campaign', 'Date'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {stats.recentDonations.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[--muted] text-sm">No donations yet.</td></tr>
              )}
              {stats.recentDonations.map((d, i) => (
                <tr key={i} className="hover:bg-[--accent]/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-[--foreground]">{d.donor_name}</td>
                  <td className="px-4 py-3 text-[--muted]">{d.donor_email}</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">{fmt(Number(d.amount))}</td>
                  <td className="px-4 py-3 text-[--muted]">{d.campaign || '—'}</td>
                  <td className="px-4 py-3 text-[--muted]">
                    {d.paid_at ? new Date(d.paid_at).toLocaleDateString('en-NG') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
