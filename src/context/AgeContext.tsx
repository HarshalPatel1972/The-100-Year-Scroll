'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface AgeContextType {
  currentAge: number | null;
  setCurrentAge: (age: number | null) => void;
  getAgeTheme: (age: number) => AgeTheme;
  hasEnteredScroll: boolean;
  setHasEnteredScroll: (value: boolean) => void;
}

export interface AgeTheme {
  // Primary gradient colors (mesh gradient points)
  gradientColors: string[];
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Card glass styles
  cardBg: string;
  cardBorder: string;
  cardBorderHover: string;
  // Accent for interactions
  accent: string;
  accentGlow: string;
  // Category tag colors
  categoryColors: {
    Struggle: string;
    Joy: string;
    Realization: string;
  };
  // Era metadata
  eraName: string;
  eraEmoji: string;
  // Is this a dark theme?
  isDark: boolean;
}

const AgeContext = createContext<AgeContextType | undefined>(undefined);

// The new "Timeline of Light" color system
function getAgeTheme(age: number): AgeTheme {
  // Dawn (0-18): Soft Cotton Pink bleeding into Pale Sky Blue
  if (age <= 18) {
    return {
      gradientColors: ['#FDF2F8', '#FECDD3', '#E0F2FE', '#BAE6FD'],
      textPrimary: '#1F2937',
      textSecondary: '#4B5563',
      textMuted: '#9CA3AF',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      cardBorder: 'rgba(255, 255, 255, 0.25)',
      cardBorderHover: 'rgba(255, 255, 255, 0.5)',
      accent: '#EC4899',
      accentGlow: '#F9A8D4',
      categoryColors: {
        Struggle: '#BE185D',
        Joy: '#EC4899',
        Realization: '#7C3AED',
      },
      eraName: 'Dawn',
      eraEmoji: '🌸',
      isDark: false,
    };
  }

  // Sunlight (19-35): Warm Apricot bleeding into Energetic Teal
  if (age <= 35) {
    return {
      gradientColors: ['#FFEDD5', '#FED7AA', '#CCFBF1', '#99F6E4'],
      textPrimary: '#1F2937',
      textSecondary: '#4B5563',
      textMuted: '#6B7280',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      cardBorder: 'rgba(255, 255, 255, 0.3)',
      cardBorderHover: 'rgba(255, 255, 255, 0.5)',
      accent: '#F97316',
      accentGlow: '#FDBA74',
      categoryColors: {
        Struggle: '#EA580C',
        Joy: '#F59E0B',
        Realization: '#0D9488',
      },
      eraName: 'Sunlight',
      eraEmoji: '☀️',
      isDark: false,
    };
  }

  // Golden Hour (36-60): Deep Burnt Orange fading into Calm Sage Green
  if (age <= 60) {
    return {
      gradientColors: ['#C2410C', '#9A3412', '#3F6212', '#365314'],
      textPrimary: '#FAFAFA',
      textSecondary: '#E5E5E5',
      textMuted: '#A3A3A3',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      cardBorder: 'rgba(255, 255, 255, 0.2)',
      cardBorderHover: 'rgba(255, 255, 255, 0.4)',
      accent: '#FB923C',
      accentGlow: '#FDBA74',
      categoryColors: {
        Struggle: '#FBBF24',
        Joy: '#4ADE80',
        Realization: '#F9A8D4',
      },
      eraName: 'Golden Hour',
      eraEmoji: '🍂',
      isDark: true,
    };
  }

  // Starlight (61-100): Midnight Indigo bleeding into Galaxy Purple
  return {
    gradientColors: ['#1E1B4B', '#312E81', '#581C87', '#4C1D95'],
    textPrimary: '#FAFAFA',
    textSecondary: '#E5E5E5',
    textMuted: '#A3A3A3',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    cardBorderHover: 'rgba(255, 255, 255, 0.35)',
    accent: '#A78BFA',
    accentGlow: '#C4B5FD',
    categoryColors: {
      Struggle: '#F472B6',
      Joy: '#60A5FA',
      Realization: '#FBBF24',
    },
    eraName: 'Starlight',
    eraEmoji: '✨',
    isDark: true,
  };
}

export function AgeProvider({ children }: { children: React.ReactNode }) {
  const [currentAge, setCurrentAge] = useState<number | null>(null);
  const [hasEnteredScroll, setHasEnteredScroll] = useState(false);

  const getTheme = useCallback((age: number) => getAgeTheme(age), []);

  const value = useMemo(
    () => ({
      currentAge,
      setCurrentAge,
      getAgeTheme: getTheme,
      hasEnteredScroll,
      setHasEnteredScroll,
    }),
    [currentAge, getTheme, hasEnteredScroll]
  );

  return <AgeContext.Provider value={value}>{children}</AgeContext.Provider>;
}

export function useAge() {
  const context = useContext(AgeContext);
  if (context === undefined) {
    throw new Error('useAge must be used within an AgeProvider');
  }
  return context;
}

export { getAgeTheme };
