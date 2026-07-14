'use client';

import React from 'react';
import { Twitter, Github, Heart } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8 relative z-10 bg-bg-base/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl">{APP_NAME}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            Made with <Heart className="w-4 h-4 text-accent-primary" /> for long distance connections
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-accent-primary transition-colors hover:scale-110 transform">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
