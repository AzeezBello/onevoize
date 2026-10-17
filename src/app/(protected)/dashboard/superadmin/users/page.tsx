import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserCog, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCog size={22} className="text-amber-500" />
            Admin Accounts
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage admin and superadmin privileges and access control.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 self-start sm:self-auto">
          <Link href="/dashboard/superadmin/users/new">
            <UserPlus size={15} />
            Add User
          </Link>
        </Button>
      </div>

      <Card className="border border-border/80 shadow-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    No admin accounts found in database.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(u => (
                  <TableRow key={u.id} className="transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                          {u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground text-sm">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-3.5">
                      {u.email}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${
                        u.role === 'superadmin'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                      }`}>
                        {u.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        u.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                      }`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums py-3.5">
                      {new Date(u.created_at).toLocaleDateString('en-NG')}
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <div className="inline-flex items-center gap-2">
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Link href={`/dashboard/superadmin/users/${u.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        {u.id !== Number(session.user.id) && (
                          <Button asChild variant="outline" size="sm" className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground">
                            <Link href={`/dashboard/superadmin/users/${u.id}/toggle`}>
                              {u.is_active ? 'Disable' : 'Enable'}
                            </Link>
                          </Button>
                        )}
                      </div>
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
