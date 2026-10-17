'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Heart,
  Users,
  CalendarDays,
  Megaphone,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  ScrollText,
} from 'lucide-react';
import type { UserRole } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Overview',    href: '/dashboard',                    icon: <LayoutDashboard size={18} /> },
  { label: 'Donations',   href: '/dashboard/donations',          icon: <Heart size={18} /> },
  { label: 'Members',     href: '/dashboard/members',            icon: <Users size={18} /> },
  { label: 'Events',      href: '/dashboard/events',             icon: <CalendarDays size={18} /> },
  { label: 'Campaigns',   href: '/dashboard/campaigns',          icon: <Megaphone size={18} /> },
  // Superadmin-only
  { label: 'Users',       href: '/dashboard/superadmin/users',   icon: <UserCog size={18} />,    roles: ['superadmin'] },
  { label: 'Audit Log',   href: '/dashboard/superadmin/audit',   icon: <ScrollText size={18} />, roles: ['superadmin'] },
  { label: 'Permissions', href: '/dashboard/superadmin',         icon: <ShieldCheck size={18} />,roles: ['superadmin'] },
];

interface Props { role: UserRole }

export function DashboardSidebar({ role }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visible = navItems.filter(i => !i.roles || i.roles.includes(role));

  return (
    <aside
      className={cn(
        'flex flex-col bg-[--sidebar] border-r border-[--sidebar-border] transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-[--sidebar-border] shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[--primary] text-white font-bold text-sm shrink-0">
          OV
        </div>
        {!collapsed && (
          <span className="font-semibold text-[--sidebar-foreground] text-sm leading-tight">
            ONE VOIZE<br />
            <span className="text-xs font-normal text-[--muted]">Dashboard</span>
          </span>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className={cn(
            'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
            role === 'superadmin'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          )}>
            <ShieldCheck size={10} />
            {role === 'superadmin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {visible.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[--sidebar-primary] text-[--sidebar-primary-foreground]'
                  : 'text-[--sidebar-foreground] hover:bg-[--sidebar-accent] hover:text-[--sidebar-accent-foreground]',
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-[--border] bg-[--background] text-[--muted] shadow-sm hover:text-[--foreground] transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
