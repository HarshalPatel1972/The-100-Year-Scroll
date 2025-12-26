'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAge, getAgeTheme } from '@/context/AgeContext';
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
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
  }));
}

export default function AgeGradientBackground() {
  const { currentAge } = useAge();
  const [animationPhase, setAnimationPhase] = useState(0);

  // Generate stars for starlight theme
  const stars = useMemo(() => generateStars(80), []);

  // Slow mesh gradient animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;
  const showStars = currentAge !== null && currentAge > 60;

  // Calculate mesh gradient positions based on animation phase
  const getMeshGradient = () => {
    if (!theme) {
      return 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #581C87 100%)';
    }

    const phase = animationPhase;
    const c = theme.gradientColors;
    
    // Create a slow-moving mesh gradient effect
    const x1 = 20 + Math.sin(phase * 0.01) * 15;
    const y1 = 20 + Math.cos(phase * 0.012) * 15;
    const x2 = 80 + Math.sin(phase * 0.008 + 1) * 15;
    const y2 = 30 + Math.cos(phase * 0.01 + 1) * 15;
    const x3 = 30 + Math.sin(phase * 0.009 + 2) * 15;
    const y3 = 80 + Math.cos(phase * 0.011 + 2) * 15;
    const x4 = 70 + Math.sin(phase * 0.007 + 3) * 15;
    const y4 = 70 + Math.cos(phase * 0.009 + 3) * 15;

    return `
      radial-gradient(ellipse at ${x1}% ${y1}%, ${c[0]} 0%, transparent 50%),
      radial-gradient(ellipse at ${x2}% ${y2}%, ${c[1]} 0%, transparent 50%),
      radial-gradient(ellipse at ${x3}% ${y3}%, ${c[2]} 0%, transparent 50%),
      radial-gradient(ellipse at ${x4}% ${y4}%, ${c[3]} 0%, transparent 50%),
      linear-gradient(135deg, ${c[0]} 0%, ${c[2]} 100%)
    `;
  };

  return (
    <>
      {/* Base gradient layer */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #581C87 100%)',
        }}
      />

      {/* Animated mesh gradient layer */}
      <AnimatePresence mode="wait">
        {theme && currentAge !== null && (
          <motion.div
            key={currentAge}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="fixed inset-0 -z-15"
            style={{
              background: getMeshGradient(),
              transition: 'background 2s ease-out',
            }}
          />
        )}
      </AnimatePresence>

      {/* Film grain / noise texture overlay (3% opacity) */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Stars layer for Starlight theme (Age 61+) */}
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
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  background: 'white',
                  boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5)`,
                }}
                animate={{
                  opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                  scale: [1, 1.3, 1],
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
    </>
  );
}
