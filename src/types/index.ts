export type Owner = 'self' | 'partner';

export interface GridSlot {
  owner: Owner;
  row: number;
  col: number;
}

export interface GridLayout {
  id: string;
  name: string;
  cols: number;
  rows: number;
  slots: GridSlot[];
  aspectRatio: string;
}

export type BoothPhase = 'lobby' | 'grid-select' | 'capture' | 'review' | 'export';

export interface CapturedPhoto {
  slotIndex: number;
  blob: Blob;
  imageUrl: string;
}

export interface RoomState {
  roomId: string | null;
  isConnected: boolean;
  partnerConnected: boolean;
  partnerStreamActive: boolean;
}
