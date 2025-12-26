'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Post, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAge, getAgeTheme } from '@/context/AgeContext';

interface PostCardProps {
  post: Post;
  index: number;
  onResonate?: (postId: string, newCount: number) => void;
}

export default function PostCard({ post, index, onResonate }: PostCardProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : getAgeTheme(post.age_associated);
  const [isResonating, setIsResonating] = useState(false);
  const [localResonateCount, setLocalResonateCount] = useState(post.resonate_count);
  const [hasResonated, setHasResonated] = useState(false);

  const handleResonate = async () => {
    if (hasResonated) return;
    setIsResonating(true);
    setHasResonated(true);
    const newCount = localResonateCount + 1;
    setLocalResonateCount(newCount);
    onResonate?.(post.id, newCount);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('posts').update({ resonate_count: newCount }).eq('id', post.id);
      } catch (error) { console.error(error); }
    }
    setTimeout(() => setIsResonating(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className="relative overflow-hidden p-8 transition-transform duration-500 hover:-translate-y-2"
        style={{
          background: 'rgba(255, 255, 255, 0.05)', // Super transparent
          backdropFilter: 'blur(40px)', // Heavy blur (2xl equivalent)
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0px', // High-end feeling often uses sharper corners or very subtle radii. Let's stick to 2px or 0.
        }}
      >
        <div className="mb-8">
            <span 
              className="text-[0.65rem] uppercase tracking-[0.2em] opacity-60 font-sans" 
              style={{ color: theme.textPrimary }}
            >
              {post.category}
            </span>
        </div>

        <p className="font-serif text-xl md:text-2xl italic leading-relaxed mb-8" style={{ color: theme.textPrimary }}>
          "{post.content}"
        </p>

        <div className="flex justify-between items-end border-t border-white/10 pt-6">
            <button 
               onClick={handleResonate}
               className="group/btn flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
            >
               <Heart 
                 size={18} 
                 className={`transition-all duration-500 ${hasResonated ? 'fill-current' : ''}`}
                 style={{ color: hasResonated ? theme.accent : theme.textPrimary }}
               />
               <span className="text-xs font-sans tracking-widest" style={{ color: theme.textPrimary }}>
                  {localResonateCount}
               </span>
            </button>
        </div>
      </div>
    </motion.div>
  );
}
