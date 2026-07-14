import { create } from 'zustand';

interface ConnectionState {
  roomId: string | null;
  role: 'host' | 'guest' | null;
  socketConnected: boolean;
  peerConnected: boolean;
  partnerReady: boolean;
  remoteStream: MediaStream | null;
  
  setRoomId: (id: string | null) => void;
  setRole: (role: 'host' | 'guest' | null) => void;
  setSocketConnected: (connected: boolean) => void;
  setPeerConnected: (connected: boolean) => void;
  setPartnerReady: (ready: boolean) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  roomId: null,
  role: null,
  socketConnected: false,
  peerConnected: false,
  partnerReady: false,
  remoteStream: null,
  
  setRoomId: (id) => set({ roomId: id }),
  setRole: (role) => set({ role }),
  setSocketConnected: (connected) => set({ socketConnected: connected }),
  setPeerConnected: (connected) => set({ peerConnected: connected }),
  setPartnerReady: (ready) => set({ partnerReady: ready }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
}));
