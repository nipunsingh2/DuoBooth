import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useConnectionStore } from '@/stores/connectionStore';

export function useWebRTC(roomId: string, socket: Socket | null, localStream: MediaStream | null) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const { setPeerConnected, setRemoteStream, partnerReady, role } = useConnectionStore();

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "0e99f25de29c9b0a39034702",
          credential: "gR8v+f5//XMJ6e1u",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "0e99f25de29c9b0a39034702",
          credential: "gR8v+f5//XMJ6e1u",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "0e99f25de29c9b0a39034702",
          credential: "gR8v+f5//XMJ6e1u",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "0e99f25de29c9b0a39034702",
          credential: "gR8v+f5//XMJ6e1u",
        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('signal', { to: null, data: { type: 'candidate', candidate: event.candidate } });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      setPeerConnected(pc.connectionState === 'connected');
    };

    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    return pc;
  }, [socket, localStream, setRemoteStream, setPeerConnected]);

  useEffect(() => {
    if (!socket || !partnerReady || role !== 'host') return;

    // As host, we create the offer
    const initiateCall = async () => {
      const pc = createPeerConnection();
      pcRef.current = pc;
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('signal', { to: null, data: { type: 'offer', offer } });
    };

    initiateCall();
  }, [socket, partnerReady, createPeerConnection]);

  useEffect(() => {
    if (!socket) return;

    const handleSignal = async ({ from, data }: { from: string, data: any }) => {
      let pc = pcRef.current;
      if (!pc) {
        pc = createPeerConnection();
        pcRef.current = pc;
      }

      if (data.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('signal', { to: from, data: { type: 'answer', answer } });
      } else if (data.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === 'candidate') {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    socket.on('signal', handleSignal);

    return () => {
      socket.off('signal', handleSignal);
    };
  }, [socket, createPeerConnection]);

  useEffect(() => {
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  return pcRef.current;
}
