import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export function useCamera() {
  const { deviceId, resolution } = useSettingsStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function getDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices(allDevices.filter((d) => d.kind === 'videoinput'));
      } catch (err) {
        console.error('Error getting devices:', err);
      }
    }
    getDevices();
  }, []);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const constraints: MediaStreamConstraints = {
          audio: true,
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            width: resolution === 'ultra' ? { ideal: 3840 } : resolution === 'high' ? { ideal: 1920 } : { ideal: 1280 },
            height: resolution === 'ultra' ? { ideal: 2160 } : resolution === 'high' ? { ideal: 1080 } : { ideal: 720 },
          },
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(newStream);
        activeStream = newStream;
        setError(null);
      } catch (err: any) {
        console.error('Camera access error:', err);
        setError(err.message || 'Could not access camera');
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [deviceId, resolution]);

  return { stream, error, devices, videoRef };
}
