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
  // Primary gradient colors
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  // Accent colors
  accent: string;
  accentGlow: string;
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Card styles
  cardBg: string;
  cardBorder: string;
  // Category colors
  categoryColors: {
    Struggle: string;
    Joy: string;
    Realization: string;
  };
  // Era name for UI hints
  eraName: string;
  eraEmoji: string;
}

const AgeContext = createContext<AgeContextType | undefined>(undefined);

// Calculate smooth color interpolation between age ranges
function getAgeTheme(age: number): AgeTheme {
  // Dawn/Spring (0-19): Soft Pastels - Pinks, Light Blues
  if (age <= 19) {
    const progress = age / 19;
    return {
      gradientFrom: `hsl(${340 + progress * 20}, 80%, ${92 - progress * 5}%)`,
      gradientVia: `hsl(${320 + progress * 30}, 70%, ${88 - progress * 5}%)`,
      gradientTo: `hsl(${200 + progress * 20}, 75%, ${90 - progress * 5}%)`,
      accent: `hsl(${330 + progress * 20}, 70%, 60%)`,
      accentGlow: `hsl(${330 + progress * 20}, 80%, 70%)`,
      textPrimary: 'hsl(280, 30%, 15%)',
      textSecondary: 'hsl(280, 20%, 35%)',
      textMuted: 'hsl(280, 15%, 50%)',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      cardBorder: 'rgba(255, 200, 220, 0.5)',
      categoryColors: {
        Struggle: 'hsl(350, 70%, 60%)',
        Joy: 'hsl(340, 80%, 65%)',
        Realization: 'hsl(280, 60%, 60%)',
      },
      eraName: 'Dawn',
      eraEmoji: '🌸',
    };
  }

  // Noon/Summer (20-39): Vibrant/Energetic - Oranges, Golds, Cyans
  if (age <= 39) {
    const progress = (age - 20) / 19;
    return {
      gradientFrom: `hsl(${40 - progress * 10}, ${85 + progress * 10}%, ${70 - progress * 10}%)`,
      gradientVia: `hsl(${30 + progress * 10}, ${90 + progress * 5}%, ${65 - progress * 10}%)`,
      gradientTo: `hsl(${180 + progress * 20}, ${70 + progress * 10}%, ${60 - progress * 10}%)`,
      accent: `hsl(${35 + progress * 5}, 90%, 55%)`,
      accentGlow: `hsl(${35 + progress * 5}, 95%, 65%)`,
      textPrimary: 'hsl(30, 40%, 10%)',
      textSecondary: 'hsl(30, 30%, 25%)',
      textMuted: 'hsl(30, 20%, 40%)',
      cardBg: 'rgba(255, 255, 255, 0.75)',
      cardBorder: 'rgba(255, 200, 100, 0.4)',
      categoryColors: {
        Struggle: 'hsl(15, 80%, 55%)',
        Joy: 'hsl(45, 90%, 50%)',
        Realization: 'hsl(180, 70%, 40%)',
      },
      eraName: 'Noon',
      eraEmoji: '☀️',
    };
  }

  // Dusk/Autumn (40-59): Rich/Deep - Deep Greens, Terracotta, Purples
  if (age <= 59) {
    const progress = (age - 40) / 19;
    return {
      gradientFrom: `hsl(${160 - progress * 30}, ${50 + progress * 20}%, ${35 - progress * 10}%)`,
      gradientVia: `hsl(${20 + progress * 10}, ${60 + progress * 15}%, ${40 - progress * 10}%)`,
      gradientTo: `hsl(${280 + progress * 20}, ${50 + progress * 20}%, ${35 - progress * 10}%)`,
      accent: `hsl(${150 - progress * 20}, 55%, 45%)`,
      accentGlow: `hsl(${150 - progress * 20}, 65%, 55%)`,
      textPrimary: 'hsl(150, 30%, 95%)',
      textSecondary: 'hsl(150, 20%, 80%)',
      textMuted: 'hsl(150, 15%, 65%)',
      cardBg: 'rgba(20, 30, 25, 0.7)',
      cardBorder: 'rgba(100, 150, 100, 0.3)',
      categoryColors: {
        Struggle: 'hsl(15, 60%, 55%)',
        Joy: 'hsl(140, 50%, 50%)',
        Realization: 'hsl(280, 50%, 60%)',
      },
      eraName: 'Dusk',
      eraEmoji: '🍂',
    };
  }

  // Night/Winter (60-100): Starlight/Midnight - Midnight Blues, Deep Violets, Stars
  const progress = Math.min((age - 60) / 40, 1);
  return {
    gradientFrom: `hsl(${240 + progress * 20}, ${60 + progress * 20}%, ${15 - progress * 5}%)`,
    gradientVia: `hsl(${260 + progress * 20}, ${50 + progress * 25}%, ${20 - progress * 8}%)`,
    gradientTo: `hsl(${280 + progress * 10}, ${40 + progress * 30}%, ${18 - progress * 6}%)`,
    accent: `hsl(${240 + progress * 30}, 70%, 70%)`,
    accentGlow: `hsl(${240 + progress * 30}, 80%, 80%)`,
    textPrimary: 'hsl(240, 30%, 95%)',
    textSecondary: 'hsl(240, 20%, 80%)',
    textMuted: 'hsl(240, 15%, 60%)',
    cardBg: 'rgba(15, 10, 30, 0.8)',
    cardBorder: 'rgba(150, 130, 200, 0.25)',
    categoryColors: {
      Struggle: 'hsl(280, 50%, 65%)',
      Joy: 'hsl(200, 60%, 65%)',
      Realization: 'hsl(50, 60%, 70%)',
    },
    eraName: 'Starlight',
    eraEmoji: '✨',
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

// Export the helper function for use outside of context
export { getAgeTheme };
