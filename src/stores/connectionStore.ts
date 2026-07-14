import { create } from 'zustand';

interface ConnectionState {
  roomId: string | null;
  socketConnected: boolean;
  peerConnected: boolean;
  partnerReady: boolean;
  remoteStream: MediaStream | null;
  
  setRoomId: (id: string | null) => void;
  setSocketConnected: (connected: boolean) => void;
  setPeerConnected: (connected: boolean) => void;
  setPartnerReady: (ready: boolean) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  roomId: null,
  socketConnected: false,
  peerConnected: false,
  partnerReady: false,
  remoteStream: null,
  
  setRoomId: (id) => set({ roomId: id }),
  setSocketConnected: (connected) => set({ socketConnected: connected }),
  setPeerConnected: (connected) => set({ peerConnected: connected }),
  setPartnerReady: (ready) => set({ partnerReady: ready }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
}));
