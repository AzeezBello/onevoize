'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
] as const;

export default function NewMemberPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    application_reason: '',
    membership_no: '',
    status: 'active' as 'pending' | 'active' | 'inactive' | 'suspended',
    joined_at: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register member');
      router.push('/dashboard/members');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/dashboard/members" aria-label="Back to members directory">
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Register New Member</h2>
          <p className="text-sm text-muted-foreground">
            Add a member profile to the ONE VOIZE club directory.
          </p>
        </div>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-primary" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Member Details
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Leave Membership Number blank to auto-generate a unique club ID (e.g. OVC-2026-1042).
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.full_name}
                  onChange={set('full_name')}
                  placeholder="e.g. Hon. Prince Adeyeye"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="membership_no">Membership Number</Label>
                <Input
                  id="membership_no"
                  name="membership_no"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={form.membership_no}
                  onChange={set('membership_no')}
                  placeholder="Auto-generated if left blank"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={form.email}
                  onChange={set('email')}
                  placeholder="member@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  type="text"
                  autoComplete="organization-title"
                  value={form.occupation}
                  onChange={set('occupation')}
                  placeholder="Profession or occupation"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="joined_at">Date Joined</Label>
                <Input
                  id="joined_at"
                  name="joined_at"
                  type="date"
                  value={form.joined_at}
                  onChange={set('joined_at')}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Residential Address</Label>
              <Textarea
                id="address"
                name="address"
                rows={2}
                autoComplete="street-address"
                value={form.address}
                onChange={set('address')}
                placeholder="Street address, city, state"
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-foreground">Membership Status</legend>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {statusOptions.map(opt => (
                  <label
                    key={opt.value}
                    htmlFor={`member-status-${opt.value}`}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                      form.status === opt.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`member-status-${opt.value}`}
                      name="status"
                      value={opt.value}
                      checked={form.status === opt.value}
                      onChange={() => setForm(prev => ({ ...prev, status: opt.value }))}
                      className="accent-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Administrative Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={set('notes')}
                placeholder="Committee role, sponsor, or special remarks..."
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border/60">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving Member…' : 'Register Member'}
                </Button>
              </motion.div>
              <Button asChild variant="outline">
                <Link href="/dashboard/members">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
