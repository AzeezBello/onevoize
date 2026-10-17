import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/dashboard/StatCard';
import { CampaignProgress } from '@/components/dashboard/CampaignProgress';
import { Heart, Users, CalendarDays, Megaphone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Welcome back, {session.user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time activity and club metrics powered by Neon DB.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href="/dashboard/donations">
              View All Donations
              <ArrowUpRight size={13} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards with Emil Kowalski spring counter & tactile lifts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Raised"
          value={fmt(stats.totalRaised)}
          sub={`${stats.donationCount} verified donations`}
          icon={<Heart size={18} />}
          color="blue"
        />
        <StatCard
          label="Active Members"
          value={stats.memberCount}
          numeric
          sub="Registered club members"
          icon={<Users size={18} />}
          color="green"
        />
        <StatCard
          label="Upcoming Events"
          value={stats.upcomingEvents}
          numeric
          sub="Scheduled gatherings"
          icon={<CalendarDays size={18} />}
          color="gold"
        />
        <StatCard
          label="Active Campaigns"
          value={stats.activeCampaigns}
          numeric
          sub={`${fmt(stats.campaignRaised)} funded`}
          icon={<Megaphone size={18} />}
          color="red"
        />
      </div>

      {/* Campaign Progress Card */}
      {stats.campaignGoal > 0 && (
        <CampaignProgress
          goal={stats.campaignGoal}
          raised={stats.campaignRaised}
          formattedGoal={fmt(stats.campaignGoal)}
          formattedRaised={fmt(stats.campaignRaised)}
        />
      )}

      {/* Recent Donations Table in Shadcn Card */}
      <Card className="border border-border/80 shadow-none overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/60">
          <div>
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Recent Confirmed Donations
            </CardTitle>
            <CardDescription className="text-xs">
              Latest transactions processed via Paystack
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">
            <Link href="/dashboard/donations">View all →</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground text-sm">
                    No confirmed donations recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentDonations.map((d, i) => (
                  <TableRow key={i} className="transition-colors">
                    <TableCell className="font-medium text-foreground py-3.5">
                      {d.donor_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-3.5 text-xs">
                      {d.donor_email}
                    </TableCell>
                    <TableCell className="py-3.5 font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {fmt(Number(d.amount))}
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs">
                      {d.campaign || 'General Donation'}
                    </TableCell>
                    <TableCell className="py-3.5 text-right text-muted-foreground text-xs tabular-nums">
                      {d.paid_at ? new Date(d.paid_at).toLocaleDateString('en-NG') : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
