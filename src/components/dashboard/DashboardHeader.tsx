'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  user: { name: string; email: string; role: string };
}

export function DashboardHeader({ user }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('one-voize-theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
    else setTheme(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('one-voize-theme', next);
    document.documentElement.dataset.theme = next;
  };

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[--border] bg-[--card] shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-[--foreground]">ONE VOIZE Admin</h1>
        <p className="text-xs text-[--muted]">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[--accent] text-[--muted] transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications (placeholder) */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[--accent] text-[--muted] transition-colors" aria-label="Notifications">
          <Bell size={16} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User avatar + name */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[--primary] text-[--primary-foreground] text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-[--foreground] leading-tight">{user.name}</p>
            <p className="text-[10px] text-[--muted] leading-tight capitalize">{user.role}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[--destructive]/10 text-[--muted] hover:text-[--destructive] transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
