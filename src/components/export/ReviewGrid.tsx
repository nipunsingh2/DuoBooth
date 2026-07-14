'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBoothStore } from '@/stores/boothStore';
import { createCompositedCanvas } from '@/lib/canvas';
import { RESOLUTIONS } from '@/lib/constants';

interface ReviewGridProps {
  onRetake: (slotIndex: number) => void;
}

export default function ReviewGrid({ onRetake }: ReviewGridProps) {
  const { selectedLayout, photos, frameStyle, dateStampEnabled } = useBoothStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fire confetti on mount
    const duration = 1500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff6b6b', '#ee5a6f', '#a855f7']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b6b', '#ee5a6f', '#a855f7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  useEffect(() => {
    if (!selectedLayout || !canvasContainerRef.current) return;

    const renderPreview = async () => {
      const canvas = await createCompositedCanvas({
        layout: selectedLayout,
        photos,
        frameStyle,
        dateStampEnabled,
        resolution: RESOLUTIONS.standard,
      });

      // Scale down canvas for preview
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.objectFit = 'contain';
      canvas.style.borderRadius = '8px';
      canvas.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';

      const container = canvasContainerRef.current;
      if (container) {
        container.innerHTML = '';
        container.appendChild(canvas);
      }
    };

    renderPreview();
  }, [selectedLayout, photos, frameStyle, dateStampEnabled]);

  if (!selectedLayout) return null;

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -2, scale: 0.95 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex-1 flex flex-col items-center justify-center p-4 relative"
    >
      <div 
        ref={canvasContainerRef}
        className="w-full max-w-md max-h-[70vh] flex items-center justify-center"
      />

      {/* Retake overlay map (invisible buttons over slots) */}
      {/* For simplicity in this implementation, we just provide a 'Retake All' or select from list,
          since canvas click mapping is complex without a robust math mapping.
          We can just show a list of slots below for retaking. */}
      
      <div className="mt-8 flex gap-2 flex-wrap justify-center">
        {selectedLayout.slots.map((_, i) => (
          <button
            key={i}
            onClick={() => onRetake(i)}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Retake {i + 1}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
