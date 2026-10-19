'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserCheck, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

export type MemberRecord = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  occupation: string | null;
  application_reason: string | null;
  membership_no: string | null;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  joined_at: string;
  notes: string | null;
};

const statusOptions = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
] as const;

export function MemberEditForm({ member }: { member: MemberRecord }) {
  const router = useRouter();
  const initialDate = member.joined_at
    ? new Date(member.joined_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    full_name: member.full_name || '',
    email: member.email || '',
    phone: member.phone || '',
    address: member.address || '',
    occupation: member.occupation || '',
    application_reason: member.application_reason || '',
    membership_no: member.membership_no || '',
    status: (member.status || 'active') as 'pending' | 'active' | 'inactive' | 'suspended',
    joined_at: initialDate,
    notes: member.notes || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update member');
      router.push('/dashboard/members');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Remove "${member.full_name}" from the members directory?`)) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete member');
      router.push('/dashboard/members');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member');
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/dashboard/members" aria-label="Back to members directory">
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {member.status === 'pending' ? 'Review Member Application' : 'Edit Member Profile'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Update registration details or membership status for {member.full_name}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
        >
          <Trash2 size={14} aria-hidden="true" />
          {deleting ? 'Deleting…' : 'Delete Member'}
        </Button>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-primary" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Application &amp; Profile Information
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Changes take effect immediately across the dashboard and applicant status lookup.
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
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="membership_no">Membership / Application Ref</Label>
                <Input
                  id="membership_no"
                  name="membership_no"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={form.membership_no}
                  onChange={set('membership_no')}
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
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="joined_at">Date Submitted / Joined</Label>
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
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="application_reason">Applicant Statement (Why they want to join)</Label>
              <Textarea
                id="application_reason"
                name="application_reason"
                rows={3}
                value={form.application_reason}
                onChange={set('application_reason')}
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-foreground">Membership Status</legend>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {statusOptions.map(opt => (
                  <label
                    key={opt.value}
                    htmlFor={`edit-member-status-${opt.value}`}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                      form.status === opt.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`edit-member-status-${opt.value}`}
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
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border/60">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving Changes…' : 'Save Changes'}
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
