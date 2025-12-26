'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAge } from '@/context/AgeContext';

interface LandingHeroProps {
  onEnter: (age: number) => void;
}

export default function LandingHero({ onEnter }: LandingHeroProps) {
  const { setCurrentAge, setHasEnteredScroll } = useAge();
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus after a slight delay for drama
    setTimeout(() => inputRef.current?.focus(), 800);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Real-time background update
    const age = parseInt(val, 10);
    if (!isNaN(age) && age >= 0 && age <= 100) {
      setCurrentAge(age);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(inputValue, 10);

    if (isNaN(age) || age < 0 || age > 100) return;

    setIsTransitioning(true);
    // Ensure context is set
    setCurrentAge(age);

    setTimeout(() => {
      setHasEnteredScroll(true);
      onEnter(age);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Massive Editorial Headline */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -100 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Custom editorial ease
        className="w-full max-w-6xl text-center mb-32 z-10"
      >
        <h1 
          className="font-serif font-black text-6xl md:text-8xl lg:text-9xl leading-none text-white tracking-tighter"
          style={{ textShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
        >
          The 100-Year Scroll
        </h1>
        <div className="h-px w-24 bg-white/30 mx-auto mt-8 mb-8" />
        <p className="font-sans text-lg md:text-xl text-white/70 tracking-wide uppercase text-xs font-medium">
          A Timeline of Human Wisdom
        </p>
      </motion.div>

      {/* Cinematic Sentence Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isTransitioning ? 0 : 1, 
          scale: isTransitioning ? 1.1 : 1 
        }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="flex flex-col md:flex-row items-baseline justify-center gap-4 text-3xl md:text-5xl lg:text-6xl text-white font-serif italic text-center md:text-left leading-relaxed">
          <span className="opacity-60 font-sans font-light not-italic text-sm md:text-xl tracking-widest uppercase mb-4 md:mb-0">
            I am
          </span>
          
          <div className="relative inline-block mx-4">
            <input
              ref={inputRef}
              type="number"
              min="0"
              max="100"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="0"
              className="w-32 md:w-48 bg-transparent text-center border-b-2 border-white/30 focus:border-white focus:outline-none transition-colors duration-500 placeholder-white/20 font-serif font-bold"
              style={{
                MozAppearance: 'textfield',
              }}
            />
          </div>

          <span className="opacity-60 font-sans font-light not-italic text-sm md:text-xl tracking-widest uppercase mt-4 md:mt-0">
            years old today
          </span>
        </div>

        {/* Submit Ghost Button */}
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: inputValue ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            type="submit"
            className="group relative px-8 py-3 overflow-hidden rounded-full transition-all duration-300 hover:tracking-widest"
          >
            <div className="absolute inset-0 border border-white/20 rounded-full group-hover:bg-white/10 transition-all duration-300" />
            <span className="relative text-sm uppercase tracking-widest text-white font-medium">
              Enter The Scroll
            </span>
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}
