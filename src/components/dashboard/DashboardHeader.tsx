'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ExternalLink, Images, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { tapScale } from '@/lib/motion';

interface Props {
  user: { name: string; email: string; role: string };
}

export function DashboardHeader({ user }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0"
    >
      <div>
        <p className="text-sm font-semibold text-foreground">ONE VOIZE Admin</p>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Button asChild variant="outline" size="sm" className="hidden md:inline-flex h-8 gap-1.5 text-xs">
          <Link href="/dashboard/gallery">
            <Images size={13} aria-hidden="true" />
            Gallery
          </Link>
        </Button>

        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <a href="/" target="_blank" rel="noopener noreferrer">
            Live Website
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        </Button>

        {/* Theme toggle */}
        {mounted && (
          <motion.div whileTap={tapScale}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
              >
                {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
              </motion.div>
            </Button>
          </motion.div>
        )}

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* User pill */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 440, damping: 24 }}
          className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors cursor-default"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm shadow-primary/30">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground leading-tight">{user.name}</p>
            <p className="text-[10px] text-muted-foreground leading-tight capitalize">
              {user.role.replace('superadmin', 'super admin')}
            </p>
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div whileTap={tapScale}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
            aria-label="Sign out"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={15} aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}

