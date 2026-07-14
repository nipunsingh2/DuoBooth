'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaitingIndicatorProps {
  partnerReady: boolean;
}

export default function WaitingIndicator({ partnerReady }: WaitingIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-6 text-center h-16 flex items-center justify-center">
      {!partnerReady ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 text-lg font-serif"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Waiting for your person...
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="text-accent-primary"
          >
            ♥
          </motion.span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          Connected! Starting booth...
        </motion.div>
      )}
    </div>
  );
}
