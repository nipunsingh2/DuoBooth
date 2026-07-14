'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  interactive?: boolean;
}

export default function GlassPanel({ className = '', interactive = false, children, ...props }: GlassPanelProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' } : {}}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
      className={`glass-panel p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
