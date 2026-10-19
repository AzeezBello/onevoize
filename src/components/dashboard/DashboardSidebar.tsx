'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Heart,
  Users,
  CalendarDays,
  Megaphone,
  Images,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Database,
} from 'lucide-react';
import type { UserRole } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';
import { slideInLeft, tapScale } from '@/lib/motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
  section?: 'main' | 'super';
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Overview',     href: '/dashboard',                     icon: LayoutDashboard, section: 'main',  exact: true },
  { label: 'Donations',    href: '/dashboard/donations',           icon: Heart,           section: 'main' },
  { label: 'Members',      href: '/dashboard/members',             icon: Users,           section: 'main' },
  { label: 'Events',       href: '/dashboard/events',              icon: CalendarDays,    section: 'main' },
  { label: 'Campaigns',    href: '/dashboard/campaigns',           icon: Megaphone,       section: 'main' },
  { label: 'Gallery',      href: '/dashboard/gallery',             icon: Images,          section: 'main' },
  { label: 'Users',        href: '/dashboard/superadmin/users',    icon: UserCog,         roles: ['superadmin'], section: 'super' },
  { label: 'Audit Log',    href: '/dashboard/superadmin/audit',    icon: ScrollText,      roles: ['superadmin'], section: 'super' },
  { label: 'DB Telemetry', href: '/dashboard/superadmin/db-stats', icon: Database,        roles: ['superadmin'], section: 'super' },
  { label: 'Console',      href: '/dashboard/superadmin',          icon: ShieldCheck,     roles: ['superadmin'], section: 'super', exact: true },
];

interface Props { role: UserRole }

export function DashboardSidebar({ role }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visible = navItems.filter(i => !i.roles || i.roles.includes(role));
  const main  = visible.filter(i => i.section === 'main');
  const super_ = visible.filter(i => i.section === 'super');

  function NavLink({ item, index }: { item: NavItem; index: number }) {
    const Icon = item.icon;
    const isActive = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.04 * index }}
      >
        <motion.div whileTap={tapScale}>
          <Link
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            {/* Active indicator pill */}
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-lg bg-primary"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <Icon size={16} className="shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.aside
      {...slideInLeft}
      animate={{ opacity: 1, x: 0, width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="relative flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden"
      style={{ minWidth: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0 shadow-sm shadow-primary/30">
          OV
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="overflow-hidden"
            >
              <p className="font-semibold text-sidebar-foreground text-xs leading-tight">ONE VOIZE</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role badge */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="role-badge"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="px-4 pt-3 pb-1 overflow-hidden"
          >
            <span className={cn(
              'inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider',
              role === 'superadmin'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            )}>
              <ShieldCheck size={9} />
              {role === 'superadmin' ? 'Super Admin' : 'Admin'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {main.map((item, i) => <NavLink key={item.href} item={item} index={i} />)}

        {super_.length > 0 && (
          <>
            <div className="py-2">
              <Separator className="bg-sidebar-border" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    key="super-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Super Admin
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            {super_.map((item, i) => <NavLink key={item.href} item={item} index={main.length + i + 1} />)}
          </>
        )}
      </nav>

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(c => !c)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 440, damping: 22 }}
        className="absolute -right-3.5 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>
    </motion.aside>
  );
}
