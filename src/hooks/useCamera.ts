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
      let videoConstraints: any = {};
      const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
      
      const idealWidth = resolution === 'ultra' ? 3840 : resolution === 'high' ? 1920 : 1280;
      const idealHeight = resolution === 'ultra' ? 2160 : resolution === 'high' ? 1080 : 720;
      
      if (isPortrait) {
        videoConstraints.width = { ideal: idealHeight };
        videoConstraints.height = { ideal: idealWidth };
      } else {
        videoConstraints.width = { ideal: idealWidth };
        videoConstraints.height = { ideal: idealHeight };
      }

      if (deviceId) {
        videoConstraints.deviceId = { exact: deviceId };
      } else {
        videoConstraints.facingMode = "user";
      }

      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: videoConstraints });
      } catch (err1) {
        console.warn('Failed with ideal constraints, trying 720p fallback...', err1);
        try {
          // Intermediate fallback: 720p
          const fallbackWidth = isPortrait ? 720 : 1280;
          const fallbackHeight = isPortrait ? 1280 : 720;
          let fallbackConstraints: any = { 
            width: { ideal: fallbackWidth }, 
            height: { ideal: fallbackHeight }
          };
          if (deviceId) fallbackConstraints.deviceId = { exact: deviceId };
          else fallbackConstraints.facingMode = "user";

          newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: fallbackConstraints });
        } catch (err2) {
          console.warn('Failed with 720p constraints, trying facingMode...', err2);
          try {
            newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } });
          } catch (err3) {
            console.warn('Failed with facingMode, trying basic video+audio...', err3);
            try {
              newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            } catch (err4) {
              console.warn('Failed with audio+video, trying just video...', err4);
              newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            }
          }
        }
      }
      
      setStream(newStream);
    } catch (err: any) {
      console.error('Camera access error:', err);
      const errDetail = err.message || err.name || 'Unknown error';
      if (err.name === 'NotAllowedError') {
        setError(`Permission denied. Check Android site settings. (${errDetail})`);
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError(`Camera error: ${err.name} - ${errDetail}`);
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
