'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

  const fields: Array<{ label: string; key: keyof typeof form; type: string }> = [
    { label: 'Full Name',    key: 'name',     type: 'text' },
    { label: 'Email',        key: 'email',    type: 'email' },
    { label: 'Password',     key: 'password', type: 'password' },
  ];

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/superadmin/users" className="text-[--muted] hover:text-[--foreground] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-[--foreground]">Add Admin User</h2>
          <p className="text-sm text-[--muted]">Create a new admin or superadmin account</p>
        </div>
      </div>

      <div className="rounded-xl border border-[--border] bg-[--card] p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-[--foreground] mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={set(f.key)}
                required
                className="w-full rounded-lg border border-[--input] bg-[--background] px-3 py-2.5 text-sm text-[--foreground] focus:outline-none focus:ring-2 focus:ring-[--ring]"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-[--foreground] mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={set('role')}
              className="w-full rounded-lg border border-[--input] bg-[--background] px-3 py-2.5 text-sm text-[--foreground] focus:outline-none focus:ring-2 focus:ring-[--ring]"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[--primary] text-[--primary-foreground] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Creating…' : 'Create User'}
            </button>
            <Link
              href="/dashboard/superadmin/users"
              className="rounded-lg border border-[--border] px-5 py-2.5 text-sm text-[--muted] hover:bg-[--accent] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
