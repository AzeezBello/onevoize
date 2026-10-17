/**
 * Emil Kowalski-inspired Design Engineering Animation System
 *
 * Core principles:
 * 1. Composited properties only: transform & opacity (never animate blur/filter or layout width/height without layout projection).
 * 2. Taut, physical springs: no loose, cartoonish oscillations. Snappy (stiffness 380-450, damping 30-36) creates high perceived responsiveness.
 * 3. Micro-delays: stagger deltas of 25ms-35ms so lists cascade smoothly without delaying perception of content.
 * 4. Micro-press states: scale(0.98) or scale(0.97) + subtle 1px translate down feels like real tactile mechanical resistance.
 * 5. Layout continuity: sliding indicators (active tabs/nav items) driven by shared layoutId for uninterrupted visual tracking.
 */

export const springConfig = {
  // Snappy for interactive UI elements (buttons, pills, tabs)
  snappy: { type: 'spring', stiffness: 460, damping: 34, mass: 0.8 },
  // Smooth for entrances, dialogs, cards
  smooth: { type: 'spring', stiffness: 360, damping: 28, mass: 0.7 },
  // Subtle for hover/tap feedback
  tactile: { type: 'spring', stiffness: 500, damping: 30 },
  // Quick fade for exits
  exit: { duration: 0.15, ease: [0.32, 0, 0.67, 0] },
} as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: springConfig.exit },
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: springConfig.smooth },
  exit: { opacity: 0, y: 6, transition: springConfig.exit },
} as const;

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: springConfig.smooth },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: springConfig.exit },
} as const;

export const slideInLeft = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: springConfig.smooth },
  exit: { opacity: 0, x: -12, transition: springConfig.exit },
} as const;

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02,
    },
  },
} as const;

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: springConfig.smooth },
} as const;

export const tapScale = {
  scale: 0.98,
  y: 0.5,
  transition: springConfig.tactile,
} as const;

export const hoverLift = {
  y: -2,
  transition: springConfig.tactile,
} as const;
