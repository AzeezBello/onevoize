'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { springConfig } from '@/lib/motion';

interface Props {
  goal: number;
  raised: number;
  formattedGoal: string;
  formattedRaised: string;
}

export function CampaignProgress({ goal, raised, formattedGoal, formattedRaised }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const shouldReduce = useReducedMotion();
  const percentage = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  return (
    <Card ref={ref} className="border border-border/80 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp size={15} />
          </div>
          <CardTitle className="text-sm font-semibold tracking-normal normal-case">
            Active Campaign Funding
          </CardTitle>
        </div>
        <Link
          href="/dashboard/campaigns"
          className="group inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View campaigns
          <ArrowRight size={12} className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-2 pt-2">
        <div className="flex justify-between items-baseline text-xs">
          <div>
            <span className="font-semibold text-foreground text-sm">{formattedRaised}</span>
            <span className="text-muted-foreground ml-1.5">raised</span>
          </div>
          <div className="text-muted-foreground">
            Goal: <span className="text-foreground font-medium">{formattedGoal}</span>
          </div>
        </div>

        {/* Spring Progress track */}
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden relative">
          <motion.div
            initial={shouldReduce ? { width: `${percentage}%` } : { width: '0%' }}
            animate={inView || shouldReduce ? { width: `${percentage}%` } : { width: '0%' }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 20,
              mass: 0.9,
              delay: 0.1,
            }}
            className="h-full rounded-full bg-primary relative"
          >
            {/* Subtle highlight sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
          <span>Target completion</span>
          <span className="font-semibold text-foreground tabular-nums">{percentage.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
