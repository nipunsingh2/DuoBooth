'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw } from 'lucide-react';
import { CapturedPhoto, Owner } from '@/types';
import { captureVariants } from '@/lib/animations';
import { useBoothStore } from '@/stores/boothStore';
import { IMAGE_FILTERS } from '@/lib/constants';

interface PhotoSlotProps {
  index: number;
  owner: Owner;
  isActive: boolean;
  photo?: CapturedPhoto;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  mirror: boolean;
  role: 'host' | 'guest' | null;
  onRetake: () => void;
}

// A simple helper component to attach a MediaStream to a video element
function VideoFeed({ stream, mirror, filterStyle }: { stream: MediaStream | null; mirror: boolean; filterStyle: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white/30 gap-1">
        <Camera className="w-5 h-5" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Waiting...</span>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
      style={{ 
        transform: mirror ? 'scaleX(-1)' : 'none',
        filter: filterStyle
      }}
    />
  );
}

export default function PhotoSlot({ index, owner, isActive, photo, localStream, remoteStream, mirror, role, onRetake }: PhotoSlotProps) {
  // Determine which stream to show
  const { imageFilter } = useBoothStore();
  const isHost = role === 'host';
  const isMyTurn = isHost ? owner === 'self' : owner === 'partner';
  const streamToShow = isMyTurn ? localStream : remoteStream;
  const shouldMirror = isMyTurn && mirror;
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
            className="w-full h-full relative group/feed"
          >
            <VideoFeed stream={streamToShow} mirror={shouldMirror} filterStyle={IMAGE_FILTERS[imageFilter]} />
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold text-white/80 z-10 opacity-0 group-hover/feed:opacity-100 transition-opacity">
              {owner === 'self' ? 'You' : 'Them'}
            </div>
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
