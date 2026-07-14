'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { Camera } from 'lucide-react';
import { useBoothStore } from '@/stores/boothStore';

interface BoothControlsProps {
  socket: Socket | null;
  roomId: string;
}

export default function BoothControls({ socket, roomId }: BoothControlsProps) {
  const { activeSlotIndex, selectedLayout, photos } = useBoothStore();

  const handleCaptureClick = () => {
    if (socket && selectedLayout) {
      // Find next empty slot or use active
      let targetSlot = activeSlotIndex;
      if (photos[activeSlotIndex]) {
        for (let i = 0; i < selectedLayout.slots.length; i++) {
          if (!photos[i]) {
            targetSlot = i;
            break;
          }
        }
      }
      socket.emit('start-countdown', { roomId, slotIndex: targetSlot });
    }
  };

  const isComplete = selectedLayout && Object.keys(photos).length === selectedLayout.slots.length;

  return (
    <div className="flex justify-center items-center p-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCaptureClick}
        disabled={isComplete}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-white/20 transition-all ${
          isComplete ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary to-accent-secondary rounded-full animate-spin-slow opacity-50 blur-md" />
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center shadow-inner">
          <Camera className="w-8 h-8 text-bg-base" />
        </div>
      </motion.button>
    </div>
  );
}
