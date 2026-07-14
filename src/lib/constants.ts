export const APP_NAME = 'DuoBooth';
export const MAX_USERS_PER_ROOM = 2;
export const COUNTDOWN_SECONDS = 3;
export const SIGNALING_SERVER_URL = process.env.NEXT_PUBLIC_SIGNALING_URL || 'http://localhost:3001';

export const RESOLUTIONS = {
  standard: { width: 1280, height: 720 },
  high: { width: 1920, height: 1080 },
  ultra: { width: 3840, height: 2160 },
};

export const EXPORT_FORMATS = ['png', 'jpeg', 'webp', 'pdf'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const IMAGE_FILTERS = {
  normal: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  vintage: 'sepia(50%) contrast(150%) saturate(120%) brightness(90%)',
  'high-contrast': 'contrast(180%) saturate(120%)',
};
