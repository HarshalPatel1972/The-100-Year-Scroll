'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AgeGradientBackground from '@/components/AgeGradientBackground';
import LandingHero from '@/components/LandingHero';
import MainFeed from '@/components/MainFeed';
import { useAge } from '@/context/AgeContext';

export default function Home() {
  const { hasEnteredScroll } = useAge();
  const [showFeed, setShowFeed] = useState(false);

  const handleEnterScroll = (age: number) => {
    setShowFeed(true);
  };

  return (
    <>
      <AgeGradientBackground />
      
      <AnimatePresence mode="wait">
        {!showFeed ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingHero onEnter={handleEnterScroll} />
          </motion.div>
        ) : (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MainFeed />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
