'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Socket } from 'socket.io-client';
import { useBoothStore } from '@/stores/boothStore';

interface WaitingIndicatorProps {
  partnerReady: boolean;
  role: 'host' | 'guest' | null;
  roomId: string;
  socket: Socket | null;
}

export default function WaitingIndicator({ partnerReady, role, roomId, socket }: WaitingIndicatorProps) {
  const { setPhase } = useBoothStore();

  const handleStart = () => {
    if (socket) {
      setPhase('grid-select');
      socket.emit('phase-change', { roomId, phase: 'grid-select' });
    }
  };

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
      ) : role === 'host' ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Button onClick={handleStart} className="w-full shadow-[0_0_15px_rgba(255,107,107,0.3)]">
            Start Booth
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          Connected! Waiting for host to start...
        </motion.div>
      )}
    </div>
  );
}
