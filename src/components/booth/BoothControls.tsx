'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { Camera } from 'lucide-react';
import { useBoothStore } from '@/stores/boothStore';

interface BoothControlsProps {
  socket: Socket | null;
  roomId: string;
  isCapturing?: boolean;
}

export default function BoothControls({ socket, roomId, isCapturing = false }: BoothControlsProps) {
  const { activeSlotIndex, selectedLayout, photos } = useBoothStore();

  const handleCaptureClick = () => {
    if (socket && selectedLayout && !isComplete && !isCapturing) {
      socket.emit('start-sequence', { roomId });
    }
  };

  const isComplete = selectedLayout ? Object.keys(photos).length === selectedLayout.slots.length : false;
  const disabled = isComplete || isCapturing;

  return (
    <div className="flex justify-center items-center p-4">
      <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={handleCaptureClick}
        disabled={disabled}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-white/20 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'
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
