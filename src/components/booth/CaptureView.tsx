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
  const { remoteStream, role } = useConnectionStore();
  const { mirror } = useSettingsStore();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  const [count, setCount] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const handleCapturePair = (slot1: number, slot2: number) => {
    if (!selectedLayout) return;
    
    const slotsToCapture = [selectedLayout.slots[slot1]];
    if (selectedLayout.slots[slot2]) {
      slotsToCapture.push(selectedLayout.slots[slot2]);
    }
    
    slotsToCapture.forEach((slot, idx) => {
      const actualSlotIndex = slot1 + idx;
      const isHost = role === 'host';
      const isMyTurn = isHost ? slot.owner === 'self' : slot.owner === 'partner';
      
      if (isMyTurn) {
        const sourceVideo = localVideoRef.current;
        if (sourceVideo && captureCanvasRef.current) {
          const canvas = captureCanvasRef.current;
          canvas.width = sourceVideo.videoWidth || 1920;
          canvas.height = sourceVideo.videoHeight || 1080;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            if (mirror) {
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
            }
            ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                addPhoto(actualSlotIndex, { slotIndex: actualSlotIndex, blob, imageUrl });
                
                if (socket) {
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => {
                    socket.emit('photo-captured', { 
                      roomId, 
                      slotIndex: actualSlotIndex, 
                      photoDataUrl: reader.result 
                    });
                  };
                }
              }
            }, 'image/jpeg', 0.95);
          }
        }
      } else {
        // It's the partner's turn to capture. Take a temporary preview from remote video feed
        const sourceVideo = remoteVideoRef.current;
        if (sourceVideo && captureCanvasRef.current && remoteStream) {
          const canvas = captureCanvasRef.current;
          canvas.width = sourceVideo.videoWidth || 1280;
          canvas.height = sourceVideo.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                addPhoto(actualSlotIndex, { slotIndex: actualSlotIndex, blob, imageUrl });
              }
            }, 'image/jpeg', 0.5);
          }
        }
      }
    });
  };

  // Handle sequence from server
  useEffect(() => {
    if (!socket || !selectedLayout) return;
    
    // Check if we need to abort an ongoing run Sequence if component unmounts
    let aborted = false;

    const runSequence = async () => {
      setIsCapturing(true);
      
      const numPairs = Math.ceil(selectedLayout.slots.length / 2);
      
      for (let i = 0; i < numPairs; i++) {
        if (aborted) break;

        const slot1 = i * 2;
        const slot2 = i * 2 + 1;
        
        // Skip pairs that are already captured
        const currentPhotos = useBoothStore.getState().photos;
        if (currentPhotos[slot1] && (selectedLayout.slots[slot2] ? currentPhotos[slot2] : true)) {
          continue;
        }

        setActiveSlot(slot1);
        
        // Countdown
        for (let c = COUNTDOWN_SECONDS; c > 0; c--) {
          if (aborted) break;
          setCount(c);
          await new Promise(r => setTimeout(r, 1000));
        }
        if (aborted) break;
        
        setCount(0);
        handleCapturePair(slot1, slot2);
        
        setIsFlashing(true);
        try {
          const audio = new Audio('/sounds/shutter.mp3');
          audio.play().catch(() => {});
        } catch(e) {}
        
        setTimeout(() => setIsFlashing(false), 300);
        setTimeout(() => setCount(null), 300);
        
        if (i < numPairs - 1) {
          await new Promise(r => setTimeout(r, 2000));
        } else {
          await new Promise(r => setTimeout(r, 1500));
          if (!aborted) {
            setPhase('review');
            socket.emit('phase-change', { roomId, phase: 'review' });
          }
        }
      }
      if (!aborted) {
        setIsCapturing(false);
      }
    };

    socket.on('sequence-started', runSequence);
    return () => {
      aborted = true;
      socket.off('sequence-started', runSequence);
    };
  }, [socket, selectedLayout, role, mirror, remoteStream, addPhoto, setPhase, roomId, setActiveSlot]);

  // Listen for partner's photo
  useEffect(() => {
    if (!socket) return;
    
    const handlePartnerPhoto = async ({ slotIndex, photoDataUrl }: { slotIndex: number, photoDataUrl: string }) => {
      try {
        const res = await fetch(photoDataUrl);
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        addPhoto(slotIndex, { slotIndex, blob, imageUrl });
      } catch (err) {
        console.error('Failed to parse partner photo', err);
      }
    };

    socket.on('partner-photo', handlePartnerPhoto);
    return () => {
      socket.off('partner-photo', handlePartnerPhoto);
    };
  }, [socket, addPhoto]);

  if (!selectedLayout) return null;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-4">
      {/* Visually hidden feeds for high-res capture (using opacity-0 instead of hidden to ensure browsers don't pause video decoding) */}
      <canvas ref={captureCanvasRef} className="absolute opacity-0 pointer-events-none w-1 h-1" />
      <video ref={localVideoRef} className="absolute opacity-0 pointer-events-none w-1 h-1" autoPlay playsInline muted />
      <video ref={remoteVideoRef} className="absolute opacity-0 pointer-events-none w-1 h-1" autoPlay playsInline muted />
      
      {/* Main Grid Viewfinder */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-2xl w-full max-w-[800px] flex items-center justify-center"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${selectedLayout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`,
              gap: '16px',
              width: '100%',
              aspectRatio: selectedLayout.aspectRatio.replace(':', '/'),
            }}
          >
            {selectedLayout.slots.map((slot, i) => (
              <PhotoSlot 
                key={i}
                index={i}
                owner={slot.owner}
                isActive={isCapturing && (activeSlotIndex === i || activeSlotIndex + 1 === i)}
                photo={photos[i]}
                localStream={localStream}
                remoteStream={remoteStream}
                mirror={mirror}
                role={role}
                onRetake={() => {
                  // Retakes during a sequence are ignored to keep flow simple
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 justify-center">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
          <h3 className="font-bold text-xl mb-2">
            {isCapturing ? 'Capturing...' : 'Ready?'}
          </h3>
          <p className="text-white/60 text-sm mb-6">
            {isCapturing ? 'Strike a pose! The grid will fill automatically.' : 'Hit the camera to start the sequence. It will take pictures for both of you automatically.'}
          </p>
          <BoothControls socket={socket} roomId={roomId} isCapturing={isCapturing} />
        </div>
      </div>

      <CountdownOverlay count={count} />
      
      {/* Flash Effect */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-white z-[60] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
