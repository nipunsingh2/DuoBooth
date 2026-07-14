'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSettingsStore } from '@/stores/settingsStore';

interface DeviceSelectorProps {
  devices: MediaDeviceInfo[];
}

export default function DeviceSelector({ devices }: DeviceSelectorProps) {
  const { deviceId, setDeviceId, resolution, setResolution } = useSettingsStore();

  return (
    <div className="flex gap-4 items-center mt-4">
      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
        <Settings className="w-4 h-4 text-gray-400" />
        <select
          value={deviceId || ''}
          onChange={(e) => setDeviceId(e.target.value || null)}
          className="bg-transparent text-white outline-none border-none text-sm appearance-none cursor-pointer pr-4"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId} className="bg-bg-base text-white">
              {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex bg-black/30 backdrop-blur-sm rounded-xl p-1 border border-white/10">
        {(['standard', 'high', 'ultra'] as const).map((res) => (
          <button
            key={res}
            onClick={() => setResolution(res)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              resolution === res ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {res === 'standard' ? '720p' : res === 'high' ? '1080p' : '4K'}
          </button>
        ))}
      </div>
    </div>
  );
}
