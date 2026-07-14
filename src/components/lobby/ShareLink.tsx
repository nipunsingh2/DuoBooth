'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';

interface ShareLinkProps {
  roomId: string;
}

export default function ShareLink({ roomId }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/booth/${roomId}`);
  }, [roomId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my DuoBooth',
          text: 'Come take some photos with me!',
          url: url,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, delay: 0.2 }}
      className="w-full max-w-md mx-auto mt-8"
    >
      <GlassPanel className="flex flex-col gap-4 text-center">
        <h3 className="text-lg font-medium">Invite Your Partner</h3>
        <p className="text-sm text-gray-400">Share this link with the person you want to take photos with.</p>
        
        <div className="flex gap-2 bg-black/30 p-2 rounded-xl border border-white/10">
          <input 
            type="text" 
            readOnly 
            value={url} 
            className="flex-1 bg-transparent border-none outline-none px-2 text-white/80 font-mono text-sm truncate"
          />
          <Button size="sm" variant="secondary" onClick={handleCopy} className="min-w-[100px]">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Copied!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button size="sm" variant="ghost" onClick={handleShare}>
              <Share className="w-4 h-4" />
            </Button>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
