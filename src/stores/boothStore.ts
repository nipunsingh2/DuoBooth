import { create } from 'zustand';
import { BoothPhase, CapturedPhoto, GridLayout } from '@/types';

interface BoothState {
  phase: BoothPhase;
  selectedLayout: GridLayout | null;
  photos: Record<number, CapturedPhoto>;
  activeSlotIndex: number;
  frameStyle: 'minimal' | 'polaroid' | 'film' | 'none';
  dateStampEnabled: boolean;
  imageFilter: 'normal' | 'grayscale' | 'sepia' | 'vintage' | 'high-contrast';
  
  setPhase: (phase: BoothPhase) => void;
  setLayout: (layout: GridLayout | null) => void;
  addPhoto: (slotIndex: number, photo: CapturedPhoto) => void;
  removePhoto: (slotIndex: number) => void;
  setActiveSlot: (index: number) => void;
  setFrameStyle: (style: BoothState['frameStyle']) => void;
  setDateStamp: (enabled: boolean) => void;
  setImageFilter: (filter: BoothState['imageFilter']) => void;
  resetBooth: () => void;
}

export const useBoothStore = create<BoothState>((set) => ({
  phase: 'lobby',
  selectedLayout: null,
  photos: {},
  activeSlotIndex: 0,
  frameStyle: 'polaroid',
  dateStampEnabled: true,
  imageFilter: 'normal',
  
  setPhase: (phase) => set({ phase }),
  setLayout: (layout) => set({ selectedLayout: layout, photos: {}, activeSlotIndex: 0 }),
  addPhoto: (slotIndex, photo) => set((state) => ({ 
    photos: { ...state.photos, [slotIndex]: photo } 
  })),
  removePhoto: (slotIndex) => set((state) => {
    const newPhotos = { ...state.photos };
    delete newPhotos[slotIndex];
    return { photos: newPhotos };
  }),
  setActiveSlot: (index) => set({ activeSlotIndex: index }),
  setFrameStyle: (style) => set({ frameStyle: style }),
  setDateStamp: (enabled) => set({ dateStampEnabled: enabled }),
  setImageFilter: (filter) => set({ imageFilter: filter }),
  resetBooth: () => set({ 
    phase: 'lobby', 
    selectedLayout: null, 
    photos: {}, 
    activeSlotIndex: 0 
  }),
}));
