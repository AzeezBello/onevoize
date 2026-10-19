'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Plus, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type DonationExportItem = {
  id: number;
  reference: string;
  donor_name: string;
  donor_email: string;
  amount: string;
  status: string;
  campaign: string | null;
  channel: string | null;
  paid_at: string | null;
  created_at: string;
};

export function DonationsHeaderActions({ donations }: { donations: DonationExportItem[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    campaign: '',
    channel: 'bank_transfer',
    status: 'success' as 'success' | 'pending' | 'failed',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fallback for browsers without <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdrop = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!inside) dialog.close();
      };
      dialog.addEventListener('click', handleBackdrop);
      return () => dialog.removeEventListener('click', handleBackdrop);
    }
  }, []);

  function exportCsv() {
    const headers = ['Reference', 'Donor Name', 'Donor Email', 'Amount (NGN)', 'Status', 'Campaign', 'Channel', 'Date'];
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const rows = donations.map(d => [
      escapeCsv(d.reference),
      escapeCsv(d.donor_name),
      escapeCsv(d.donor_email),
      escapeCsv(String(d.amount)),
      escapeCsv(d.status),
      escapeCsv(d.campaign || 'General Donation'),
      escapeCsv(d.channel || 'paystack'),
      escapeCsv(d.paid_at || d.created_at),
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `one-voize-donations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleRecord(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record donation');
      dialogRef.current?.close();
      setForm({
        donor_name: '',
        donor_email: '',
        amount: '',
        campaign: '',
        channel: 'bank_transfer',
        status: 'success',
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record donation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 self-start sm:self-auto">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={exportCsv}
        disabled={donations.length === 0}
        className="gap-1.5"
      >
        <Download size={14} aria-hidden="true" />
        Export CSV
      </Button>

      <Button
        type="button"
        size="sm"
        onClick={() => {
          setError('');
          dialogRef.current?.showModal();
        }}
        className="gap-1.5"
      >
        <Plus size={14} aria-hidden="true" />
        Record Donation
      </Button>

      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="record-donation-title"
        className="m-auto w-full max-w-md rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-xs"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 id="record-donation-title" className="text-sm font-bold text-foreground">
              Record Manual / Transfer Donation
            </h3>
            <p className="text-xs text-muted-foreground">
              Log an offline bank transfer or direct contribution in Neon DB.
            </p>
          </div>
          <form method="dialog">
            <Button type="submit" variant="ghost" size="icon-sm" aria-label="Close modal">
              <X size={15} aria-hidden="true" />
            </Button>
          </form>
        </div>

        <form onSubmit={handleRecord} className="p-5 space-y-3.5">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="donor_name">Donor Name *</Label>
            <Input
              id="donor_name"
              name="donor_name"
              type="text"
              required
              autoComplete="name"
              value={form.donor_name}
              onChange={e => setForm(p => ({ ...p, donor_name: e.target.value }))}
              placeholder="e.g. Chief Tunde Bakare"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="donor_email">Donor Email *</Label>
            <Input
              id="donor_email"
              name="donor_email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={form.donor_email}
              onChange={e => setForm(p => ({ ...p, donor_email: e.target.value }))}
              placeholder="donor@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="donation_amount">Amount (NGN) *</Label>
              <Input
                id="donation_amount"
                name="amount"
                type="number"
                min={100}
                step="100"
                required
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="50000"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="donation_channel">Channel</Label>
              <Input
                id="donation_channel"
                name="channel"
                type="text"
                value={form.channel}
                onChange={e => setForm(p => ({ ...p, channel: e.target.value }))}
                placeholder="bank_transfer"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="donation_campaign">Campaign (Optional)</Label>
            <Input
              id="donation_campaign"
              name="campaign"
              type="text"
              value={form.campaign}
              onChange={e => setForm(p => ({ ...p, campaign: e.target.value }))}
              placeholder="Leave blank for General Fund"
            />
          </div>

          <fieldset className="space-y-1.5">
            <legend className="text-xs font-semibold text-foreground">Transaction Status</legend>
            <div className="flex items-center gap-2">
              {(['success', 'pending'] as const).map(st => (
                <label
                  key={st}
                  htmlFor={`donation-status-${st}`}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize cursor-pointer ${
                    form.status === st
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <input
                    type="radio"
                    id={`donation-status-${st}`}
                    name="status"
                    value={st}
                    checked={form.status === st}
                    onChange={() => setForm(p => ({ ...p, status: st }))}
                    className="accent-primary"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => dialogRef.current?.close()}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Saving…' : 'Save Donation'}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export function DonationStatusActions({
  id,
  donorName,
  status,
}: {
  id: number;
  donorName: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(nextStatus: 'success' | 'failed') {
    setBusy(true);
    try {
      await fetch(`/api/admin/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (status !== 'pending') {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="inline-flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={busy}
        onClick={() => updateStatus('success')}
        className="h-7 w-7 text-emerald-600 hover:text-emerald-700"
      >
        <Check size={13} aria-hidden="true" />
        <span className="sr-only">Mark donation from {donorName} as successful</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={busy}
        onClick={() => updateStatus('failed')}
        className="h-7 w-7 text-rose-600 hover:text-rose-700"
      >
        <X size={13} aria-hidden="true" />
        <span className="sr-only">Mark donation from {donorName} as failed</span>
      </Button>
    </div>
  );
}
