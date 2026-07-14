import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useConnectionStore } from '@/stores/connectionStore';
import { useBoothStore } from '@/stores/boothStore';
import { SIGNALING_SERVER_URL } from '@/lib/constants';

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket | null>(null);
  const { setSocketConnected, setPartnerReady, setRoomId, peerConnected } = useConnectionStore();
  const { setPhase, setActiveSlot, addPhoto } = useBoothStore();

  useEffect(() => {
    const socket = io(SIGNALING_SERVER_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      setRoomId(roomId);
      socket.emit('join-room', roomId);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('room-joined', (data) => {
      console.log('Joined room as:', data.role);
    });

    socket.on('partner-joined', () => {
      console.log('Partner joined');
      setPartnerReady(true);
    });

    socket.on('partner-left', () => {
      console.log('Partner left');
      setPartnerReady(false);
      // Wait, we might want to handle disconnection better.
    });

    socket.on('grid-selected', (layoutId) => {
      // In a real app we'd fetch the layout by ID and set it
    });

    socket.on('phase-changed', (phase) => {
      setPhase(phase);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return socketRef.current;
}
