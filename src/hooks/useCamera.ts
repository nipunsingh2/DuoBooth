import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export function useCamera() {
  const { deviceId, resolution } = useSettingsStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    async function getDevices() {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices(allDevices.filter((d) => d.kind === 'videoinput'));
      } catch (err) {
        console.error('Error getting devices:', err);
      }
    }
    if (stream) {
      getDevices();
    }
  }, [stream]);

  const startCamera = async () => {
    setIsRequesting(true);
    setError(null);
    try {
      let videoConstraints: any = {
        width: resolution === 'ultra' ? { ideal: 3840 } : resolution === 'high' ? { ideal: 1920 } : { ideal: 1280 },
        height: resolution === 'ultra' ? { ideal: 2160 } : resolution === 'high' ? { ideal: 1080 } : { ideal: 720 },
      };

      if (deviceId) {
        videoConstraints.deviceId = { exact: deviceId };
      } else {
        videoConstraints.facingMode = "user";
      }

      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: videoConstraints });
      } catch (initialErr) {
        console.warn('Failed with ideal constraints, falling back to basic camera access:', initialErr);
        newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      }
      
      setStream(newStream);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setError(err.message || 'Camera permission denied or camera not found.');
      } else {
        setError('Click to request camera access');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    // Attempt auto-start, but it may fail silently on mobile without user gesture
    // Catch it quickly so the user can tap the manual button
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [deviceId, resolution]);

  return { stream, error, devices, videoRef, startCamera, isRequesting };
}
