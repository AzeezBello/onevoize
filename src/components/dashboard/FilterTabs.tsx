'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { tapScale, springConfig } from '@/lib/motion';

interface TabItem {
  label: string;
  value: string;
}

interface FilterTabsProps {
  tabs: TabItem[];
  activeValue: string;
  baseUrl: string;
  paramName?: string;
  layoutId?: string;
}

export function FilterTabs({
  tabs,
  activeValue,
  baseUrl,
  paramName = 'status',
  layoutId = 'filter-tabs-pill',
}: FilterTabsProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-muted/60 border border-border/60 rounded-xl">
      {tabs.map(tab => {
        const isActive = activeValue === tab.value;
        const href = tab.value ? `${baseUrl}?${paramName}=${tab.value}` : baseUrl;

        return (
          <motion.div key={tab.value} whileTap={shouldReduce ? {} : tapScale}>
            <Link
              href={href}
              className={cn(
                'relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors select-none inline-flex items-center justify-center',
                isActive
                  ? 'text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                  transition={springConfig.snappy}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
