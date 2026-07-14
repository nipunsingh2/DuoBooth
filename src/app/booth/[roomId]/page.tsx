'use client';

import React, { use } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useCamera } from '@/hooks/useCamera';
import { useBoothStore } from '@/stores/boothStore';
import { useConnectionStore } from '@/stores/connectionStore';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import PageTransition from '@/components/ui/PageTransition';

// Lobby Components
import CameraPreview from '@/components/lobby/CameraPreview';
import ShareLink from '@/components/lobby/ShareLink';
import WaitingIndicator from '@/components/lobby/WaitingIndicator';
import DeviceSelector from '@/components/lobby/DeviceSelector';

// Booth Components
import GridPicker from '@/components/booth/GridPicker';
import CaptureView from '@/components/booth/CaptureView';

export default function BoothPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  const { phase } = useBoothStore();
  const { partnerReady } = useConnectionStore();
  
  const { stream: localStream, devices, videoRef } = useCamera();
  const socket = useSocket(roomId);
  const pc = useWebRTC(roomId, socket, localStream);

  return (
    <main className="min-h-screen relative flex flex-col pt-8 pb-12 px-4 selection:bg-accent-primary/30">
      <AnimatedBackground />

      <PageTransition phaseKey={phase} className="max-w-7xl mx-auto w-full flex-1">
        {phase === 'lobby' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <CameraPreview videoRef={videoRef} stream={localStream} />
            <DeviceSelector devices={devices} />
            <ShareLink roomId={roomId} />
            <WaitingIndicator partnerReady={partnerReady} />
          </div>
        )}

        {phase === 'grid-select' && (
          <GridPicker socket={socket} roomId={roomId} />
        )}

        {phase === 'capture' && (
          <CaptureView socket={socket} roomId={roomId} localStream={localStream} />
        )}

        {phase === 'review' && (
          <div className="text-white text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Review Grid</h2>
            <p className="text-gray-400">Review grid coming in next phase.</p>
          </div>
        )}

        {phase === 'export' && (
          <div className="text-white text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Export</h2>
            <p className="text-gray-400">Export coming in next phase.</p>
          </div>
        )}
      </PageTransition>
    </main>
  );
}
