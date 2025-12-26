'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAge, getAgeTheme } from '@/context/AgeContext';

interface LandingHeroProps {
  onEnter: (age: number) => void;
}

export default function LandingHero({ onEnter }: LandingHeroProps) {
  const { setCurrentAge, setHasEnteredScroll } = useAge();
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayAge, setDisplayAge] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(inputValue, 10);

    if (isNaN(age) || age < 0 || age > 100) {
      // Shake animation feedback
      return;
    }

    setDisplayAge(age);
    setIsTransitioning(true);
    setCurrentAge(age);

    // Delay before transitioning to main feed
    setTimeout(() => {
      setHasEnteredScroll(true);
      onEnter(age);
    }, 1500);
  };

  const theme = displayAge !== null ? getAgeTheme(displayAge) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -50 : 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold text-white mb-4"
          initial={{ letterSpacing: '0.02em' }}
          animate={{ letterSpacing: isTransitioning ? '0.1em' : '0.02em' }}
        >
          The 100-Year Scroll
        </motion.h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-light">
          A collaborative timeline of human wisdom. Anonymous stories from every age.
        </p>
      </motion.div>

      {/* Age input form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 50 : 0, scale: isTransitioning ? 0.9 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            min="0"
            max="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="?"
            className="w-48 h-48 sm:w-56 sm:h-56 text-center text-6xl sm:text-7xl font-serif font-bold rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
            }}
          />
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-50"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-white/50 text-lg"
        >
          How old are you today?
        </motion.p>

        <motion.button
          type="submit"
          className="mt-8 w-full py-4 px-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-lg hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Enter the Scroll →
        </motion.button>
      </motion.form>

      {/* Age number zoom transition */}
      {isTransitioning && displayAge !== null && theme && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <span
            className="text-9xl sm:text-[12rem] font-serif font-bold"
            style={{ color: theme.textPrimary }}
          >
            {displayAge}
          </span>
        </motion.div>
      )}

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-white/30 text-sm">
          🌿 Explore wisdom from ages 0 to 100
        </p>
      </motion.div>
    </div>
  );
}
