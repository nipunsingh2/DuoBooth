import type { Variants } from 'framer-motion';

export const springs = {
  gentle: { stiffness: 120, damping: 14 },
  snappy: { stiffness: 300, damping: 20 },
  bouncy: { stiffness: 200, damping: 10 },
  molasses: { stiffness: 80, damping: 20 },
};

export const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, scale: 0.98, filter: 'blur(4px)' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const countdownVariants: Variants = {
  initial: { scale: 3, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', ...springs.bouncy } },
  exit: { scale: 0.5, opacity: 0, transition: { duration: 0.2 } },
};

export const captureVariants: Variants = {
  idle: { scale: 1, borderColor: 'transparent' },
  active: { scale: 1.02, borderColor: 'var(--color-accent-primary)', boxShadow: '0 0 30px rgba(255,107,107,0.3)' },
  captured: { scale: [1, 1.05, 1], transition: { duration: 0.3 } },
};
