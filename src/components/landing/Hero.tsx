'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useSpring, animated } from '@react-spring/web';

interface HeroProps {
  onStartBooth: () => void;
  onJoinBooth: () => void;
}

export default function Hero({ onStartBooth, onJoinBooth }: HeroProps) {
  const [{ rotateX, rotateY }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    config: { mass: 1, tension: 200, friction: 20 },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    api.start({
      rotateX: -(y / rect.height) * 20,
      rotateY: (x / rect.width) * 20,
    });
  };

  const handleMouseLeave = () => {
    api.start({ rotateX: 0, rotateY: 0 });
  };

  const headline = "Miles apart. One frame together.";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
            {headline.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.03, ease: 'easeOut' }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            A real-time collaborative photobooth for long-distance couples, friends, and families.
            Capture high-quality, synchronized photo strips no matter where you are in the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8, staggerChildren: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.div>
              <Button size="lg" onClick={onStartBooth} className="w-full sm:w-auto">
                Start a Booth
              </Button>
            </motion.div>
            <motion.div>
              <Button size="lg" variant="secondary" onClick={onJoinBooth} className="w-full sm:w-auto">
                Join a Booth
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="relative z-10 hidden lg:flex justify-center perspective-[1000px]"
        >
          <animated.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-80 aspect-[1/2.5] bg-white rounded-xl shadow-2xl p-4 transform transition-transform"
          >
            <div className="absolute inset-0 rounded-xl shadow-[0_20px_50px_rgba(255,107,107,0.3)] -z-10" />
            <div className="flex flex-col h-full gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 bg-gray-200 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-50" />
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-gray-400/20" />
                    <div className="w-1/2 bg-gray-500/20" />
                  </div>
                </div>
              ))}
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif font-bold text-gray-800 text-xl tracking-widest uppercase opacity-80">
                  DuoBooth
                </span>
              </div>
            </div>
          </animated.div>
        </motion.div>
      </div>
    </section>
  );
}
