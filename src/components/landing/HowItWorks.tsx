'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Create a Booth',
    desc: 'Start a session instantly and share the unique room link with your person.',
  },
  {
    num: '02',
    title: 'Strike a Pose',
    desc: 'Pick a layout and let the synchronized countdown capture you both in real-time.',
  },
  {
    num: '03',
    title: 'Share the Memory',
    desc: 'Download your high-quality photo strip to keep, print, or post.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Three simple steps to bridge the distance.</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-white/10" />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-accent-primary to-accent-secondary origin-left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.3 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="w-24 h-24 rounded-full bg-bg-base border-4 border-bg-base shadow-[0_0_0_2px_rgba(255,255,255,0.1)] flex items-center justify-center mb-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.3 + 0.3 }}
                  className="absolute inset-0 rounded-full bg-accent-primary/20 animate-pulse-glow"
                />
                <span className="text-3xl font-serif font-bold text-accent-primary relative z-10">{step.num}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 max-w-[250px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
