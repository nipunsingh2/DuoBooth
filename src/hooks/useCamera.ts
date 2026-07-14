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
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices(allDevices.filter((d) => d.kind === 'videoinput'));
      } catch (err) {
        console.error('Error getting devices:', err);
      }
    }
    // Only get devices after stream is ready to avoid double prompting on mobile
    if (stream) {
      getDevices();
    }
  }, [stream]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        let videoConstraints: any = {
          width: resolution === 'ultra' ? { ideal: 3840 } : resolution === 'high' ? { ideal: 1920 } : { ideal: 1280 },
          height: resolution === 'ultra' ? { ideal: 2160 } : resolution === 'high' ? { ideal: 1080 } : { ideal: 720 },
        };

        if (deviceId) {
          videoConstraints.deviceId = { exact: deviceId };
        } else {
          videoConstraints.facingMode = "user"; // Default to selfie cam on mobile
        }

        let newStream: MediaStream;
        try {
          newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: videoConstraints });
        } catch (initialErr) {
          console.warn('Failed with ideal constraints, falling back to basic camera access:', initialErr);
          // Fallback for strict mobile browsers that reject resolution/facingMode constraints
          newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        }
        
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
