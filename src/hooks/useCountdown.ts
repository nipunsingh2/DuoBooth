import { useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { COUNTDOWN_SECONDS } from '@/lib/constants';

export function useCountdown(roomId: string, socket: Socket | null, onCapture: () => void) {
  const [count, setCount] = useState<number | null>(null);

  const startCountdown = useCallback((slotIndex: number) => {
    if (socket) {
      socket.emit('start-countdown', { roomId, slotIndex });
    }
  }, [socket, roomId]);

  // Listen for countdown start
  // In a real app we'd put this in a useEffect
  // For simplicity, we can return a trigger function and handle state externally
  // or put it inside the component. I'll make a standalone hook.

  return { count, startCountdown, setCount };
}
