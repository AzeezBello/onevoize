import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShieldCheck, UserCog, ScrollText, Database, Webhook, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function SuperadminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'superadmin') redirect('/dashboard');

  const items = [
    {
      title: 'User Management',
      description: 'Create, edit, and manage admin and superadmin roles in Neon DB.',
      href: '/dashboard/superadmin/users',
      icon: UserCog,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    },
    {
      title: 'Audit Trail',
      description: 'Review administrative security events, IP addresses, and timestamps.',
      href: '/dashboard/superadmin/audit',
      icon: ScrollText,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    },
    {
      title: 'Database Telemetry',
      description: 'Live row counts, database health, and table statistics.',
      href: '/dashboard/superadmin/db-stats',
      icon: Database,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    },
    {
      title: 'Paystack Integrations',
      description: 'Inspect transaction webhook payloads and signature verification.',
      href: '/dashboard/donations',
      icon: Webhook,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck size={22} className="text-amber-500" />
          Super Admin Console
        </h2>
        <p className="text-sm text-muted-foreground">
          Elevated privileges: manage administrators, system logs, and Neon DB storage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group focus:outline-none">
              <Card className="border border-border/80 shadow-none group-hover:border-primary/50 group-hover:shadow-sm transition-all h-full flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-normal normal-case group-hover:text-primary transition-colors mt-3">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
