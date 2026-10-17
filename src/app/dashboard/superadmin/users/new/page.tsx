'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' as 'admin' | 'superadmin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      router.push('/dashboard/superadmin/users');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/dashboard/superadmin/users">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Add Administrator</h2>
          <p className="text-sm text-muted-foreground">Provision a new admin or superadmin account in Neon DB</p>
        </div>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-primary" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">Account Information</CardTitle>
          </div>
          <CardDescription className="text-xs">
            The new user will be able to sign in immediately with these credentials.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={springConfig.snappy}
                className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={set('name')}
                required
                placeholder="e.g. Adeyemi Adeleke"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="admin@onevoize.org"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                placeholder="••••••••••••"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">System Role</Label>
              <select
                id="role"
                value={form.role}
                onChange={set('role')}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="admin">Admin (Events, Members, Donations)</option>
                <option value="superadmin">Super Admin (Full system control)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading} size="default">
                  {loading ? 'Creating Account…' : 'Create Account'}
                </Button>
              </motion.div>
              <Button asChild variant="outline" size="default">
                <Link href="/dashboard/superadmin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
