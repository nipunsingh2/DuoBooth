import { create } from 'zustand';

interface SettingsState {
  deviceId: string | null;
  mirror: boolean;
  resolution: 'standard' | 'high' | 'ultra';
  soundEnabled: boolean;
  
  setDeviceId: (id: string | null) => void;
  setMirror: (mirror: boolean) => void;
  setResolution: (res: 'standard' | 'high' | 'ultra') => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  deviceId: null,
  mirror: true,
  resolution: 'high',
  soundEnabled: true,
  
  setDeviceId: (id) => set({ deviceId: id }),
  setMirror: (mirror) => set({ mirror }),
  setResolution: (res) => set({ resolution: res }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
}));
