'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { staggerItem, hoverLift, tapScale, springConfig } from '@/lib/motion';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  color?: 'blue' | 'gold' | 'green' | 'red';
  numeric?: boolean;
}

const ringColor: Record<string, string> = {
  blue:  'border-blue-200/50 dark:border-blue-900/30 ring-blue-500/10',
  gold:  'border-yellow-200/50 dark:border-yellow-900/30 ring-yellow-500/10',
  green: 'border-emerald-200/50 dark:border-emerald-900/30 ring-emerald-500/10',
  red:   'border-rose-200/50 dark:border-rose-900/30 ring-rose-500/10',
};

const iconBg: Record<string, string> = {
  blue:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  gold:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  red:   'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

function AnimatedNumber({ target }: { target: number }) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const spring = useSpring(shouldReduce ? target : 0, { stiffness: 90, damping: 20, mass: 0.8 });
  const display = useTransform(spring, v => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView && !shouldReduce) {
      spring.set(target);
    }
  }, [inView, spring, target, shouldReduce]);

  if (shouldReduce) {
    return <span>{target.toLocaleString()}</span>;
  }

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function StatCard({ label, value, sub, icon, trend, color = 'blue', numeric = false }: StatCardProps) {
  const shouldReduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div
      ref={ref}
      variants={shouldReduce ? {} : staggerItem}
      initial={shouldReduce ? false : 'initial'}
      animate={shouldReduce ? 'animate' : (inView ? 'animate' : 'initial')}
      whileHover={shouldReduce ? {} : hoverLift}
      whileTap={shouldReduce ? {} : tapScale}
    >
      <Card className={cn('border ring-2 ring-transparent transition-all shadow-none', ringColor[color])}>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>

              <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                {typeof value === 'number' && numeric ? (
                  <AnimatedNumber target={value} />
                ) : (
                  value
                )}
              </p>

              {sub && <p className="text-xs text-muted-foreground">{sub}</p>}

              {trend && (
                <p
                  className={cn(
                    'text-xs font-semibold pt-0.5',
                    trend.up
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400',
                  )}
                >
                  {trend.up ? '↑' : '↓'} {trend.value}
                </p>
              )}
            </div>

            <motion.div
              initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={springConfig.snappy}
              className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconBg[color])}
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
