'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countdownVariants } from '@/lib/animations';

interface CountdownOverlayProps {
  count: number | null; // 3, 2, 1, 0 (for flash/camera)
}

export default function CountdownOverlay({ count }: CountdownOverlayProps) {
  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              variants={countdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-[30vw] font-serif text-white drop-shadow-2xl font-bold leading-none"
            >
              {count > 0 ? count : '📸'}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
