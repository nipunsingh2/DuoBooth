'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCcw } from 'lucide-react';
import { useBoothStore } from '@/stores/boothStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { exportPhotoGrid } from '@/lib/canvas';
import { EXPORT_FORMATS, ExportFormat, RESOLUTIONS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import GlassPanel from '@/components/ui/GlassPanel';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function ExportPanel() {
  const { selectedLayout, photos, frameStyle, setFrameStyle, dateStampEnabled, setDateStamp, resetBooth } = useBoothStore();
  const { resolution } = useSettingsStore();

  const [format, setFormat] = useState<ExportFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedLayout) return;
    setIsExporting(true);
    
    try {
      await exportPhotoGrid(
        {
          layout: selectedLayout,
          photos,
          frameStyle,
          dateStampEnabled,
          resolution: RESOLUTIONS[resolution],
        },
        format,
        quality
      );
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="w-full lg:w-96 flex flex-col gap-6"
    >
      <motion.div variants={staggerItem}>
        <GlassPanel className="flex flex-col gap-4">
          <h3 className="font-bold border-b border-white/10 pb-2">Style Options</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Frame Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(['minimal', 'polaroid', 'film', 'none'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setFrameStyle(style)}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      frameStyle === style ? 'bg-accent-primary text-white font-medium' : 'bg-black/30 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={dateStampEnabled}
                onChange={(e) => setDateStamp(e.target.checked)}
                className="w-4 h-4 accent-accent-primary"
              />
              <span className="text-sm">Include Date Stamp</span>
            </label>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassPanel className="flex flex-col gap-4">
          <h3 className="font-bold border-b border-white/10 pb-2">Export Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Format</label>
              <div className="flex bg-black/30 p-1 rounded-xl">
                {EXPORT_FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium uppercase transition-colors ${
                      format === f ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {(format === 'jpeg' || format === 'webp') && (
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-2 block">
                  <span>Quality</span>
                  <span>{Math.round(quality * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-accent-primary h-2 bg-black/50 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            <Button
              onClick={handleExport}
              isLoading={isExporting}
              className="w-full mt-2"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Photo
            </Button>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Button variant="ghost" onClick={resetBooth} className="w-full text-gray-400 hover:text-white">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Start New Session
        </Button>
      </motion.div>
    </motion.div>
  );
}
