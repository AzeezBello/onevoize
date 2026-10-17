import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserCog, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'superadmin') redirect('/dashboard');

  const rows = await db(
    'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC',
  );
  const users = rows as unknown as AdminUser[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
            <UserCog size={20} className="text-amber-500" />
            Admin Users
          </h2>
          <p className="text-sm text-[--muted]">Manage admin and superadmin accounts</p>
        </div>
        <Link
          href="/dashboard/superadmin/users/new"
          className="flex items-center gap-2 rounded-lg bg-[--primary] px-4 py-2 text-sm text-[--primary-foreground] hover:opacity-90 transition-opacity"
        >
          <UserPlus size={15} />
          Add User
        </Link>
      </div>

      <div className="rounded-xl border border-[--border] bg-[--card] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--muted-surface]">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[--muted]">No admin users found.</td></tr>
              )}
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[--accent]/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[--primary] text-[--primary-foreground] text-xs font-semibold">
                        {u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span className="font-medium text-[--foreground]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[--muted]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      u.role === 'superadmin'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
                      u.is_active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                    )}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[--muted]">
                    {new Date(u.created_at).toLocaleDateString('en-NG')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/dashboard/superadmin/users/${u.id}/edit`} className="text-xs text-[--primary] hover:underline">
                        Edit
                      </Link>
                      {u.id !== Number(session.user.id) && (
                        <Link href={`/dashboard/superadmin/users/${u.id}/toggle`} className="text-xs text-[--muted] hover:text-[--foreground] hover:underline">
                          {u.is_active ? 'Disable' : 'Enable'}
                        </Link>
                      )}
                    </div>
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
