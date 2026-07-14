'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Users, Zap, LayoutGrid, Download, Shield } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { staggerContainer, staggerItem } from '@/lib/animations';

const features = [
  {
    title: 'Real-Time Sync',
    description: 'Perfectly synchronized countdowns ensure you capture the exact same moment across the globe.',
    icon: <Zap className="w-6 h-6 text-accent-primary" />,
  },
  {
    title: 'Peer-to-Peer Quality',
    description: 'High-definition video streaming directly between browsers for the best possible capture quality.',
    icon: <Camera className="w-6 h-6 text-accent-primary" />,
  },
  {
    title: 'Custom Grid Layouts',
    description: 'Choose from classic photo strips, side-by-side shots, or collage grids to frame your moments.',
    icon: <LayoutGrid className="w-6 h-6 text-accent-primary" />,
  },
  {
    title: 'Multi-Format Export',
    description: 'Download your memories as high-res PNGs, JPEGs for sharing, or print-ready PDFs.',
    icon: <Download className="w-6 h-6 text-accent-primary" />,
  },
  {
    title: 'No App Required',
    description: 'Just send a link. Works instantly in any modern web browser on desktop or mobile.',
    icon: <Users className="w-6 h-6 text-accent-primary" />,
  },
  {
    title: 'Private & Secure',
    description: 'Photos are processed locally in your browser. We never store your images on our servers.',
    icon: <Shield className="w-6 h-6 text-accent-primary" />,
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Crafted for Connection</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Everything you need to create perfect memories, built with cutting-edge web technology.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={staggerItem}>
            <GlassPanel className="h-full group hover:border-white/20 transition-colors">
              <div className="mb-4 p-3 bg-white/5 rounded-lg inline-block group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
