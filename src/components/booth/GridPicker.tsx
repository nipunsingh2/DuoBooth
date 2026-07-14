'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { gridLayouts } from '@/lib/gridLayouts';
import { useBoothStore } from '@/stores/boothStore';
import GlassPanel from '@/components/ui/GlassPanel';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface GridPickerProps {
  socket: Socket | null;
  roomId: string;
}

export default function GridPicker({ socket, roomId }: GridPickerProps) {
  const { setLayout, setPhase } = useBoothStore();

  const handleSelect = (layoutId: string) => {
    const layout = gridLayouts.find((l) => l.id === layoutId);
    if (layout && socket) {
      setLayout(layout);
      socket.emit('grid-select', { roomId, layoutId });
      setPhase('capture');
      socket.emit('phase-change', { roomId, phase: 'capture' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
        >
          Choose Your Layout
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400"
        >
          Select how you want to frame your moments together.
        </motion.p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {gridLayouts.map((layout) => (
          <motion.div key={layout.id} variants={staggerItem}>
            <GlassPanel
              interactive
              onClick={() => handleSelect(layout.id)}
              className="cursor-pointer group h-full flex flex-col hover:border-accent-primary/50 transition-colors"
            >
              <div className="flex-1 flex items-center justify-center mb-6">
                <div 
                  className="bg-black/40 border border-white/10 rounded-lg p-2 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                    gap: '4px',
                    width: '120px',
                    aspectRatio: layout.aspectRatio.replace(':', '/'),
                  }}
                >
                  {layout.slots.map((slot, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm flex items-center justify-center text-[10px] font-medium transition-colors ${
                        slot.owner === 'self' 
                          ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 group-hover:bg-accent-primary/40' 
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:bg-purple-500/40'
                      }`}
                    >
                      {slot.owner === 'self' ? 'You' : 'Them'}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-auto">
                <h3 className="font-bold text-lg mb-1 group-hover:text-accent-primary transition-colors">{layout.name}</h3>
                <p className="text-sm text-gray-400">{layout.cols * layout.rows} photos • {layout.aspectRatio}</p>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
