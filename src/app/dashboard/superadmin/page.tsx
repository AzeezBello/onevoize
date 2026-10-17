import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function SuperadminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'superadmin') redirect('/dashboard');

  const items = [
    {
      title: 'User Management',
      description: 'Create, edit, disable admin and superadmin accounts.',
      href: '/dashboard/superadmin/users',
      icon: '👤',
    },
    {
      title: 'Audit Log',
      description: 'Full log of all admin actions for accountability.',
      href: '/dashboard/superadmin/audit',
      icon: '📋',
    },
    {
      title: 'Paystack Webhook',
      description: 'View incoming webhook events from Paystack.',
      href: '/dashboard/superadmin/webhooks',
      icon: '🔗',
    },
    {
      title: 'Database Stats',
      description: 'View counts and table sizes for the Neon DB instance.',
      href: '/dashboard/superadmin/db-stats',
      icon: '🗄️',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
          <ShieldCheck size={20} className="text-amber-500" />
          Super Admin
        </h2>
        <p className="text-sm text-[--muted]">Full system control — actions here affect all admins and core data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-[--border] bg-[--card] p-5 hover:border-[--primary]/50 hover:shadow-md transition-all group"
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-[--foreground] group-hover:text-[--primary] transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-[--muted] mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
