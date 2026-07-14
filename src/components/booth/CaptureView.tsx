'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { useBoothStore } from '@/stores/boothStore';
import { useConnectionStore } from '@/stores/connectionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { COUNTDOWN_SECONDS } from '@/lib/constants';
import PhotoSlot from './PhotoSlot';
import BoothControls from './BoothControls';
import CountdownOverlay from '@/components/ui/CountdownOverlay';

interface CaptureViewProps {
  socket: Socket | null;
  roomId: string;
  localStream: MediaStream | null;
}

export default function CaptureView({ socket, roomId, localStream }: CaptureViewProps) {
  const { selectedLayout, activeSlotIndex, setActiveSlot, addPhoto, photos, setPhase } = useBoothStore();
  const { remoteStream } = useConnectionStore();
  const { mirror } = useSettingsStore();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  const [count, setCount] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Handle countdown from server
  useEffect(() => {
    if (!socket) return;
    
    const handleCountdown = (slotIndex: number) => {
      setActiveSlot(slotIndex);
      let currentCount = COUNTDOWN_SECONDS;
      setCount(currentCount);
      
      const interval = setInterval(() => {
        currentCount -= 1;
        if (currentCount >= 0) {
          setCount(currentCount);
        }
        
        if (currentCount === 0) {
          clearInterval(interval);
          handleCapture(slotIndex);
          setTimeout(() => setCount(null), 1000); // Clear after flash
        }
      }, 1000);
    };

    socket.on('countdown-started', handleCountdown);
    return () => {
      socket.off('countdown-started', handleCountdown);
    };
  }, [socket, setActiveSlot]); // Removed handleCapture from deps to avoid stale closures

  const handleCapture = (slotIndex: number) => {
    if (!selectedLayout) return;
    
    setIsFlashing(true);
    // Play shutter sound if enabled
    try {
      const audio = new Audio('/sounds/shutter.mp3');
      audio.play().catch(e => console.log('Audio play failed', e));
    } catch(e) {}

    setTimeout(() => setIsFlashing(false), 300);

    const slot = selectedLayout.slots[slotIndex];
    const sourceVideo = slot.owner === 'self' ? localVideoRef.current : remoteVideoRef.current;
    
    if (sourceVideo && captureCanvasRef.current) {
      const canvas = captureCanvasRef.current;
      // High-res capture size based on video feed
      canvas.width = sourceVideo.videoWidth || 1920;
      canvas.height = sourceVideo.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        if (slot.owner === 'self' && mirror) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            addPhoto(slotIndex, { slotIndex, blob, imageUrl });
            
            if (socket) {
              // Convert blob to base64 to send to partner
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                socket.emit('photo-captured', { 
                  roomId, 
                  slotIndex, 
                  photoDataUrl: reader.result 
                });
              };
            }
          }
        }, 'image/jpeg', 0.95);
      }
    }

    // Move to next slot or finish
    const nextSlot = slotIndex + 1;
    if (nextSlot < selectedLayout.slots.length) {
      setActiveSlot(nextSlot);
    } else {
      setTimeout(() => {
        setPhase('review');
        if (socket) socket.emit('phase-change', { roomId, phase: 'review' });
      }, 1000);
    }
  };

  // Listen for partner's photo
  useEffect(() => {
    if (!socket) return;
    
    const handlePartnerPhoto = async ({ slotIndex, photoDataUrl }: { slotIndex: number, photoDataUrl: string }) => {
      try {
        const res = await fetch(photoDataUrl);
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        addPhoto(slotIndex, { slotIndex, blob, imageUrl });
        
        if (selectedLayout && slotIndex + 1 === selectedLayout.slots.length) {
          setTimeout(() => {
            setPhase('review');
          }, 1000);
        }
      } catch (err) {
        console.error('Failed to parse partner photo', err);
      }
    };

    socket.on('partner-photo', handlePartnerPhoto);
    return () => {
      socket.off('partner-photo', handlePartnerPhoto);
    };
  }, [socket, addPhoto, selectedLayout, setPhase]);

  if (!selectedLayout) return null;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-4">
      {/* Hidden canvas for high-res capture */}
      <canvas ref={captureCanvasRef} className="hidden" />
      
      {/* Camera Feeds */}
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        {/* Local Feed */}
        <div className="flex-1 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
          />
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white/80">You</div>
        </div>
        
        {/* Remote Feed */}
        <div className="flex-1 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-lg">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              Waiting for partner video...
            </div>
          )}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white/80">Them</div>
        </div>
      </div>

      {/* Grid Overlay & Controls sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Session Progress</h3>
            <span className="text-sm text-accent-primary font-medium bg-accent-primary/10 px-2 py-1 rounded">
              {Object.keys(photos).length} / {selectedLayout.slots.length}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div 
              className="bg-black/50 rounded-lg p-2 border border-white/10"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${selectedLayout.cols}, 1fr)`,
                gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`,
                gap: '8px',
                width: '100%',
                aspectRatio: selectedLayout.aspectRatio.replace(':', '/'),
              }}
            >
              {selectedLayout.slots.map((slot, i) => (
                <PhotoSlot 
                  key={i}
                  index={i}
                  owner={slot.owner}
                  isActive={activeSlotIndex === i}
                  photo={photos[i]}
                  onRetake={() => {
                    setActiveSlot(i);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <BoothControls socket={socket} roomId={roomId} />
      </div>

      <CountdownOverlay count={count} />
      
      {/* Flash Effect */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, exit: { duration: 0.3 } }}
            className="fixed inset-0 bg-white z-[60] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
