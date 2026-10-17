import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  color?: 'blue' | 'gold' | 'green' | 'red';
}

const colorMap = {
  blue:  'from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-900/30',
  gold:  'from-yellow-400/10 to-yellow-500/5 border-yellow-200/50 dark:border-yellow-900/30',
  green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 dark:border-emerald-900/30',
  red:   'from-rose-500/10 to-rose-600/5 border-rose-200/50 dark:border-rose-900/30',
};

const iconColorMap = {
  blue:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  gold:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  red:   'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
};

export function StatCard({ label, value, sub, icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl border bg-gradient-to-br p-5',
      colorMap[color],
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[--muted] uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[--foreground]">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-[--muted]">{sub}</p>}
          {trend && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              trend.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
            )}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconColorMap[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
