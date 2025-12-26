'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAge, getAgeTheme, AgeTheme } from '@/context/AgeContext';
import { useEffect, useState, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
}

export default function AgeGradientBackground() {
  const { currentAge } = useAge();
  const [theme, setTheme] = useState<AgeTheme | null>(null);
  const [prevAge, setPrevAge] = useState<number | null>(null);

  // Generate stars for night theme
  const stars = useMemo(() => generateStars(50), []);

  useEffect(() => {
    if (currentAge !== null) {
      setPrevAge(currentAge);
      setTheme(getAgeTheme(currentAge));
    }
  }, [currentAge]);

  // Default theme when no age is selected
  const defaultGradient = 'linear-gradient(135deg, hsl(280, 40%, 15%) 0%, hsl(260, 35%, 12%) 50%, hsl(240, 30%, 10%) 100%)';

  const showStars = currentAge !== null && currentAge >= 60;

  return (
    <>
      {/* Base layer - always visible */}
      <div
        className="fixed inset-0 -z-20 transition-all duration-1000"
        style={{
          background: defaultGradient,
        }}
      />

      {/* Animated gradient layer */}
      <AnimatePresence mode="wait">
        {theme && currentAge !== null && (
          <motion.div
            key={currentAge}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="fixed inset-0 -z-10"
            style={{
              background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientVia} 50%, ${theme.gradientTo} 100%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient glow orbs */}
      <AnimatePresence>
        {theme && currentAge !== null && (
          <>
            <motion.div
              key={`orb1-${currentAge}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="fixed -z-5 pointer-events-none"
              style={{
                width: '40vmax',
                height: '40vmax',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.accentGlow}40 0%, transparent 70%)`,
                top: '10%',
                left: '60%',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(60px)',
              }}
            />
            <motion.div
              key={`orb2-${currentAge}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
              className="fixed -z-5 pointer-events-none"
              style={{
                width: '35vmax',
                height: '35vmax',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.accent}30 0%, transparent 70%)`,
                bottom: '20%',
                left: '20%',
                transform: 'translate(-50%, 50%)',
                filter: 'blur(80px)',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Stars layer for night theme (Age 60+) */}
      <AnimatePresence>
        {showStars && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 -z-5 pointer-events-none overflow-hidden"
          >
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                }}
                animate={{
                  opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 -z-5 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
