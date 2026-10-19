'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserCog, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

export type AdminUserRecord = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  is_active: boolean;
};

export function UserEditForm({
  user,
  isSelf,
}: {
  user: AdminUserRecord;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    role: (user.role || 'admin') as 'admin' | 'superadmin',
    is_active: Boolean(user.is_active),
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set =
    (k: 'name' | 'email' | 'password') =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');
      router.push('/dashboard/superadmin/users');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete administrator account "${user.name}" (${user.email})?`)) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      router.push('/dashboard/superadmin/users');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/dashboard/superadmin/users" aria-label="Back to admin accounts">
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Edit Administrator
            </h2>
            <p className="text-sm text-muted-foreground">
              Update role, credentials, or status for {user.name}
            </p>
          </div>
        </div>

        {!isSelf && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
          >
            <Trash2 size={14} aria-hidden="true" />
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        )}
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCog size={16} className="text-amber-500" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Account Settings
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Leave the password field blank to keep the existing password unchanged.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={springConfig.snappy}
                className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                required
                value={form.email}
                onChange={set('email')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">New Password (Optional)</Label>
              <p id="password-hint" className="text-[11px] text-muted-foreground">
                Enter a new password only if you wish to reset this user&apos;s credentials.
              </p>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-describedby="password-hint"
                value={form.password}
                onChange={set('password')}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-foreground">System Role</legend>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { value: 'admin', label: 'Admin (Standard)' },
                    { value: 'superadmin', label: 'Super Admin (Full)' },
                  ] as const
                ).map(opt => (
                  <label
                    key={opt.value}
                    htmlFor={`user-role-${opt.value}`}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                      form.role === opt.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`user-role-${opt.value}`}
                      name="role"
                      value={opt.value}
                      checked={form.role === opt.value}
                      onChange={() => setForm(p => ({ ...p, role: opt.value }))}
                      className="accent-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {!isSelf && (
              <div className="pt-1">
                <label
                  htmlFor="user-active-checkbox"
                  className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none"
                >
                  <input
                    id="user-active-checkbox"
                    name="is_active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span>Account is active and permitted to sign in</span>
                </label>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-border/60">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving Changes…' : 'Save Changes'}
                </Button>
              </motion.div>
              <Button asChild variant="outline">
                <Link href="/dashboard/superadmin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
