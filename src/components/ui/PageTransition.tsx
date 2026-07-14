'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/lib/animations';

interface PageTransitionProps {
  phaseKey: string;
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ phaseKey, children, className = '' }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phaseKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`w-full h-full flex flex-col items-center justify-center ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
