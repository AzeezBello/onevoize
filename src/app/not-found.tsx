'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Home, Megaphone, Heart, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp, staggerContainer, staggerItem, tapScale, hoverLift, springConfig } from '@/lib/motion';

const quickLinks = [
  { label: 'Home',      href: '/',          icon: <Home size={14} /> },
  { label: 'Donate',    href: '/donate',    icon: <Heart size={14} /> },
  { label: 'Campaigns', href: '/campaigns', icon: <Megaphone size={14} /> },
  { label: 'Events',    href: '/events',    icon: <CalendarDays size={14} /> },
];

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="section"
      style={{ minHeight: 'calc(100dvh - var(--nav-height))', display: 'flex', alignItems: 'center' }}
    >
      <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>

        {/* 404 watermark with subtle physical spring entry */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={springConfig.smooth}
          aria-hidden="true"
          style={{
            fontSize: 'clamp(110px, 26vw, 210px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.06em',
            color: 'var(--surface)',
            userSelect: 'none',
            fontFamily: 'var(--font-serif)',
          }}
        >
          404
        </motion.div>

        {/* Content with coordinated micro-stagger */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="initial"
          animate="animate"
          style={{ marginTop: '-0.75rem' }}
        >
          <motion.div variants={shouldReduceMotion ? {} : staggerItem}>
            <span className="eyebrow inline-block mb-2">Page not found</span>
          </motion.div>

          <motion.h1
            variants={shouldReduceMotion ? {} : staggerItem}
            className="serif text-foreground font-bold tracking-tight"
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', marginBottom: 12 }}
          >
            Oops — this page doesn&apos;t exist.
          </motion.h1>

          <motion.p
            variants={shouldReduceMotion ? {} : staggerItem}
            className="muted"
            style={{ maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.65, fontSize: 15 }}
          >
            The link you clicked might be broken, or the page may have been removed.
            Let&apos;s guide you back.
          </motion.p>

          {/* Primary CTA */}
          <motion.div variants={shouldReduceMotion ? {} : staggerItem}>
            <motion.div
              whileHover={shouldReduceMotion ? {} : hoverLift}
              whileTap={shouldReduceMotion ? {} : tapScale}
              style={{ display: 'inline-block' }}
            >
              <Button asChild size="lg" className="gap-2 shadow-sm">
                <Link href="/">
                  Return to Home
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick links Card */}
          <motion.div
            variants={shouldReduceMotion ? {} : staggerItem}
            style={{ marginTop: 40 }}
          >
            <Card className="border border-border/70 bg-card/60 backdrop-blur-sm shadow-none">
              <CardContent className="py-5 px-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                  Quick Navigation
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {quickLinks.map(({ label, href, icon }) => (
                    <motion.div
                      key={href}
                      whileHover={shouldReduceMotion ? {} : { y: -1, scale: 1.02 }}
                      whileTap={shouldReduceMotion ? {} : tapScale}
                      transition={springConfig.tactile}
                    >
                      <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                        <Link href={href}>
                          {icon}
                          {label}
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
