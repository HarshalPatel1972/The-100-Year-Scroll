'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAge, getAgeTheme } from '@/context/AgeContext';

interface StickyHeaderProps {
  onPrevAge: () => void;
  onNextAge: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export default function StickyHeader({
  onPrevAge,
  onNextAge,
  canGoPrev,
  canGoNext,
}: StickyHeaderProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;

  if (currentAge === null || !theme) return null;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div
        className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-xl"
        style={{
          background: `${theme.cardBg}`,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Previous Age Button */}
        <motion.button
          onClick={onPrevAge}
          disabled={!canGoPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: canGoPrev ? `${theme.accent}20` : 'transparent',
            color: theme.textPrimary,
          }}
          whileHover={canGoPrev ? { scale: 1.05, x: -3 } : {}}
          whileTap={canGoPrev ? { scale: 0.95 } : {}}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline text-sm font-medium">Previous</span>
        </motion.button>

        {/* Current Age Display */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: theme.textMuted }}>
                {theme.eraEmoji} {theme.eraName}
              </span>
              <h1
                className="text-3xl sm:text-4xl font-serif font-bold"
                style={{ color: theme.textPrimary }}
              >
                Age {currentAge}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Age Button */}
        <motion.button
          onClick={onNextAge}
          disabled={!canGoNext}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: canGoNext ? `${theme.accent}20` : 'transparent',
            color: theme.textPrimary,
          }}
          whileHover={canGoNext ? { scale: 1.05, x: 3 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          <span className="hidden sm:inline text-sm font-medium">Next</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.header>
  );
}
