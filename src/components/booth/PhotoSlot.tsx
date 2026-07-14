'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw } from 'lucide-react';
import { CapturedPhoto, Owner } from '@/types';
import { captureVariants } from '@/lib/animations';

interface PhotoSlotProps {
  index: number;
  owner: Owner;
  isActive: boolean;
  photo?: CapturedPhoto;
  onRetake: () => void;
}

export default function PhotoSlot({ index, owner, isActive, photo, onRetake }: PhotoSlotProps) {
  return (
    <motion.div
      variants={captureVariants}
      initial="idle"
      animate={isActive ? 'active' : photo ? 'captured' : 'idle'}
      className={`relative rounded overflow-hidden flex items-center justify-center transition-colors group ${
        !photo ? 'bg-white/5 border-2 border-dashed border-white/20' : 'bg-black border border-white/20'
      }`}
    >
      <AnimatePresence mode="wait">
        {photo ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full relative"
          >
            <img 
              src={photo.imageUrl} 
              alt={`Slot ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {/* Retake Overlay */}
            <div 
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
              onClick={onRetake}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -180 }}
                transition={{ type: 'spring' }}
                className="bg-white/20 p-2 rounded-full mb-1"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xs font-medium">Retake</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-1 text-white/30"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{owner === 'self' ? 'You' : 'Them'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isActive && !photo && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute inset-0 border-2 border-accent-primary pointer-events-none"
          initial={false}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
