import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useConnectionStore } from '@/stores/connectionStore';
import { useBoothStore } from '@/stores/boothStore';
import { SIGNALING_SERVER_URL } from '@/lib/constants';
import { gridLayouts } from '@/lib/gridLayouts';

export function useSocket(roomId: string, isStreamReady: boolean) {
  const socketRef = useRef<Socket | null>(null);
  const { setSocketConnected, setPartnerReady, setRoomId, setRole, peerConnected } = useConnectionStore();
  const { setPhase, setActiveSlot, addPhoto, setLayout } = useBoothStore();

  useEffect(() => {
    const socket = io(SIGNALING_SERVER_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('room-joined', (data) => {
      console.log('Joined room as:', data.role);
      setRole(data.role);
      if (data.role === 'guest') {
        setPartnerReady(true);
      }
    });

    socket.on('partner-joined', () => {
      console.log('Partner joined');
      setPartnerReady(true);
    });

    socket.on('partner-left', () => {
      console.log('Partner left');
      setPartnerReady(false);
    });

    socket.on('grid-selected', (layoutId) => {
      const layout = gridLayouts.find((l) => l.id === layoutId);
      if (layout) setLayout(layout);
    });

    socket.on('phase-changed', (phase) => {
      setPhase(phase);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, setSocketConnected, setRole, setPartnerReady, setLayout, setPhase]);

  useEffect(() => {
    if (isStreamReady && socketRef.current) {
      setRoomId(roomId);
      socketRef.current.emit('join-room', roomId);
    }
  }, [isStreamReady, roomId, setRoomId]);

  return socketRef.current;
}
