'use client';

import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAge, getAgeTheme } from '@/context/AgeContext';

interface SidebarProps {
  onPrevAge: () => void;
  onNextAge: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export default function Sidebar({ onPrevAge, onNextAge, canGoPrev, canGoNext }: SidebarProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;

  if (currentAge === null || !theme) return null;

  return (
    <aside className="sticky top-0 h-screen flex flex-col justify-center px-8 md:px-12 py-12 z-20">
      <div className="space-y-12">
        {/* Era Indicator */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <span className="block text-xs uppercase tracking-[0.4em] mb-4 opacity-60" style={{ color: theme.textPrimary }}>
            The Era of
          </span>
          <h2 className="text-3xl font-serif italic" style={{ color: theme.textPrimary }}>
            {theme.eraName}
          </h2>
          <div className="mt-4 h-px w-12 bg-current opacity-30" style={{ color: theme.textPrimary }} />
        </motion.div>

        {/* Current Age Display */}
        <motion.div
          key={currentAge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
           <span className="block text-9xl font-serif font-black leading-none -ml-2" style={{ color: theme.textPrimary }}>
            {currentAge}
           </span>
           <span className="text-sm uppercase tracking-widest opacity-60 ml-2" style={{ color: theme.textPrimary }}>
             Years of Wisdom
           </span>
        </motion.div>

        {/* Navigation Contols */}
        <div className="flex flex-col gap-4">
          <NavButton onClick={onPrevAge} disabled={!canGoPrev} label="Previous Age" />
          <NavButton onClick={onNextAge} disabled={!canGoNext} label="Next Age" />
        </div>
      </div>
    </aside>
  );
}

function NavButton({ onClick, disabled, label }: { onClick: () => void, disabled: boolean, label: string }) {
  // Simple text-based ghost buttons
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-left text-sm uppercase tracking-widest py-2 transition-all duration-300 group ${disabled ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'}`}
    >
      <span className="inline-block w-8 h-px bg-current mr-4 align-middle transition-all duration-300 group-hover:w-16" />
      {label}
    </button>
  );
}
