'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAge, getAgeTheme } from '@/context/AgeContext';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : getAgeTheme(25);

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentGlow})`,
        boxShadow: `0 8px 32px ${theme.accent}60, 0 0 60px ${theme.accentGlow}30`,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 12px 40px ${theme.accent}70, 0 0 80px ${theme.accentGlow}40`,
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Plus size={28} color={currentAge && currentAge >= 40 ? 'white' : 'hsl(0,0%,10%)'} strokeWidth={2.5} />
    </motion.button>
  );
}
