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
      transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed bottom-24 md:bottom-8 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-500 ease-out"
      style={{
        background: theme.accent,
        boxShadow: `0 10px 40px ${theme.accent}50, 0 0 60px ${theme.accentGlow}30`,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 15px 50px ${theme.accent}60, 0 0 80px ${theme.accentGlow}40`,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus size={24} color="white" strokeWidth={2} />
    </motion.button>
  );
}
