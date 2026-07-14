'use client';

import React, { use } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useCamera } from '@/hooks/useCamera';
import { useBoothStore } from '@/stores/boothStore';
import { useConnectionStore } from '@/stores/connectionStore';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import PageTransition from '@/components/ui/PageTransition';
import Button from '@/components/ui/Button';

// Lobby Components
import CameraPreview from '@/components/lobby/CameraPreview';
import ShareLink from '@/components/lobby/ShareLink';
import WaitingIndicator from '@/components/lobby/WaitingIndicator';
import DeviceSelector from '@/components/lobby/DeviceSelector';

// Booth Components
import GridPicker from '@/components/booth/GridPicker';
import CaptureView from '@/components/booth/CaptureView';

// Export Components
import ReviewGrid from '@/components/export/ReviewGrid';
import ExportPanel from '@/components/export/ExportPanel';

export default function BoothPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  const { phase } = useBoothStore();
  const { partnerReady, role } = useConnectionStore();
  
  const { stream: localStream, devices, videoRef, error, startCamera, isRequesting } = useCamera();
  const socket = useSocket(roomId, !!localStream);
  const pc = useWebRTC(roomId, socket, localStream);

  return (
    <main className="min-h-screen relative flex flex-col pt-8 pb-12 px-4 selection:bg-accent-primary/30">
      <AnimatedBackground />

      <PageTransition phaseKey={phase} className="max-w-7xl mx-auto w-full flex-1">
        {phase === 'lobby' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <CameraPreview 
              videoRef={videoRef} 
              stream={localStream} 
              error={error} 
              isRequesting={isRequesting} 
              onRetry={startCamera} 
            />
            <DeviceSelector devices={devices} />
            <ShareLink roomId={roomId} />
            <WaitingIndicator partnerReady={partnerReady} role={role} socket={socket} roomId={roomId} />
          </div>
        )}

        {phase === 'grid-select' && (
          <GridPicker socket={socket} roomId={roomId} />
        )}

        {phase === 'capture' && (
          <CaptureView socket={socket} roomId={roomId} localStream={localStream} />
        )}

        {phase === 'review' && (
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8">
            <ReviewGrid onRetake={(index) => {
              useBoothStore.getState().setActiveSlot(index);
              useBoothStore.getState().setPhase('capture');
              if (socket) socket.emit('phase-change', { roomId, phase: 'capture' });
            }} />
            <div className="w-full lg:w-auto flex justify-center">
              <Button onClick={() => {
                useBoothStore.getState().setPhase('export');
                if (socket) socket.emit('phase-change', { roomId, phase: 'export' });
              }} className="w-full max-w-sm">
                Looks Good, Continue
              </Button>
            </div>
          </div>
        )}

        {phase === 'export' && (
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-12">
            <ReviewGrid onRetake={() => {}} /> {/* Pass dummy function for export phase */}
            <ExportPanel />
          </div>
        )}
      </PageTransition>
    </main>
  );
}
