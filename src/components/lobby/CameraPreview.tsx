'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlipHorizontal, Camera as CameraIcon, AlertCircle } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';
import { useSettingsStore } from '@/stores/settingsStore';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  error?: string | null;
  isRequesting?: boolean;
  onRetry?: () => void;
}

export default function CameraPreview({ videoRef, stream, error, isRequesting, onRetry }: CameraPreviewProps) {
  const { mirror, setMirror } = useSettingsStore();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative z-10 w-full max-w-2xl aspect-[3/4] sm:aspect-[9/16] md:aspect-video"
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
          ) : error ? (
            <div className="w-full h-full bg-black/50 rounded-xl flex flex-col items-center justify-center text-center p-6 gap-4">
              <AlertCircle className="w-8 h-8 text-red-400 opacity-80" />
              <div>
                <p className="font-medium text-red-400">{error}</p>
                <p className="text-xs text-white/50 mt-1">Check your browser permissions and try again.</p>
              </div>
              {onRetry && (
                <Button onClick={onRetry} disabled={isRequesting} className="mt-2">
                  {isRequesting ? 'Requesting...' : 'Tap to Enable Camera'}
                </Button>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-black/50 rounded-xl flex flex-col items-center justify-center text-white/50 gap-4">
              <CameraIcon className="w-8 h-8 opacity-50 animate-pulse" />
              {isRequesting ? 'Requesting camera access...' : 'Camera initializing...'}
              {onRetry && !isRequesting && (
                <Button onClick={onRetry} className="mt-2">
                  Tap to Enable Camera
                </Button>
              )}
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
