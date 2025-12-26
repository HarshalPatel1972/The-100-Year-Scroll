'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAge, getAgeTheme } from '@/context/AgeContext';

interface MassiveAgeHeaderProps {
  onPrevAge: () => void;
  onNextAge: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export default function MassiveAgeHeader({
  onPrevAge,
  onNextAge,
  canGoPrev,
  canGoNext,
}: MassiveAgeHeaderProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;

  // Scroll-based fade out effect
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const y = useTransform(scrollY, [0, 200], [0, -30]);

  if (currentAge === null || !theme) return null;

  return (
    <>
      {/* Massive fading age header */}
      <motion.div
        style={{ opacity, scale, y }}
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-center pt-8 pb-4 pointer-events-none"
      >
        <div className="text-center">
          {/* Era indicator */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm uppercase tracking-[0.3em] mb-2"
            style={{ color: theme.textMuted }}
          >
            {theme.eraEmoji} {theme.eraName}
          </motion.p>

          {/* Massive editorial age number */}
          <motion.h1
            key={currentAge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="font-serif font-bold italic"
            style={{
              color: theme.textPrimary,
              fontSize: 'clamp(6rem, 20vw, 14rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textShadow: theme.isDark 
                ? '0 4px 30px rgba(0,0,0,0.3)' 
                : '0 4px 30px rgba(0,0,0,0.1)',
            }}
          >
            {currentAge}
          </motion.h1>
        </div>
      </motion.div>

      {/* Floating navigation pill - Desktop: sides, Mobile: bottom */}
      <div className="fixed z-40 inset-x-0 bottom-6 flex justify-center md:hidden pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-xl pointer-events-auto"
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >
          <NavigationButton
            onClick={onPrevAge}
            disabled={!canGoPrev}
            theme={theme}
            direction="prev"
          />
          
          <span className="font-serif italic text-lg px-3" style={{ color: theme.textPrimary }}>
            Age {currentAge}
          </span>
          
          <NavigationButton
            onClick={onNextAge}
            disabled={!canGoNext}
            theme={theme}
            direction="next"
          />
        </motion.div>
      </div>

      {/* Desktop: Side arrows */}
      <div className="hidden md:block fixed inset-y-0 left-6 z-40 flex items-center">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <NavigationButton
            onClick={onPrevAge}
            disabled={!canGoPrev}
            theme={theme}
            direction="prev"
            large
          />
        </motion.div>
      </div>

      <div className="hidden md:block fixed inset-y-0 right-6 z-40 flex items-center">
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <NavigationButton
            onClick={onNextAge}
            disabled={!canGoNext}
            theme={theme}
            direction="next"
            large
          />
        </motion.div>
      </div>
    </>
  );
}

interface NavigationButtonProps {
  onClick: () => void;
  disabled: boolean;
  theme: NonNullable<ReturnType<typeof getAgeTheme>>;
  direction: 'prev' | 'next';
  large?: boolean;
}

function NavigationButton({ onClick, disabled, theme, direction, large }: NavigationButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const size = large ? 28 : 20;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="p-3 rounded-full backdrop-blur-md transition-all duration-500 ease-out disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
      }}
      whileHover={!disabled ? { 
        scale: 1.1, 
        borderColor: theme.cardBorderHover,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <Icon size={size} strokeWidth={1.5} style={{ color: theme.textPrimary }} />
    </motion.button>
  );
}
