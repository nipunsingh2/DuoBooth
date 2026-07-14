'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/landing/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartBooth = async () => {
    setIsStarting(true);
    // Use nanoid for quick client-side room generation
    const roomId = nanoid(6).toLowerCase();
    router.push(`/booth/${roomId}`);
  };

  const handleJoinBooth = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().length > 0) {
      router.push(`/booth/${roomCode.trim().toLowerCase()}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative selection:bg-accent-primary/30">
      <AnimatedBackground />
      
      <Hero 
        onStartBooth={handleStartBooth} 
        onJoinBooth={() => setIsJoinModalOpen(true)} 
      />
      
      <Features />
      
      <HowItWorks />
      
      <Footer />

      <Modal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)}
        title="Join a Booth"
      >
        <form onSubmit={handleJoinBooth} className="flex flex-col gap-4">
          <p className="text-gray-300">Enter the room code shared by your partner.</p>
          <input
            type="text"
            placeholder="e.g. abcdef"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors font-mono tracking-widest text-lg"
            maxLength={12}
            autoFocus
          />
          <Button type="submit" className="w-full" disabled={roomCode.trim().length === 0}>
            Join Room
          </Button>
        </form>
      </Modal>
    </main>
  );
}
