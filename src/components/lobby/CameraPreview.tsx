'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlipHorizontal } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { useSettingsStore } from '@/stores/settingsStore';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
}

export default function CameraPreview({ videoRef, stream }: CameraPreviewProps) {
  const { mirror, setMirror } = useSettingsStore();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Blurred background */}
      {stream && (
        <video
          autoPlay
          playsInline
          muted
          ref={(el) => { if (el) el.srcObject = stream; }}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          style={{ filter: 'blur(40px) saturate(1.5)', transform: mirror ? 'scaleX(-1)' : 'none' }}
        />
      )}
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative z-10 w-full max-w-2xl aspect-video"
      >
        <GlassPanel className="w-full h-full p-2 relative overflow-hidden group">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl transition-transform duration-300"
              style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
            />
          ) : (
            <div className="w-full h-full bg-black/50 rounded-xl flex items-center justify-center text-white/50 animate-pulse">
              Requesting camera access...
            </div>
          )}

          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setMirror(!mirror)}
              className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
              title="Mirror Camera"
            >
              <FlipHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Status */}
          {stream && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
              <span>Camera Ready</span>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </div>
  );
}
