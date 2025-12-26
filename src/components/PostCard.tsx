'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Share2 } from 'lucide-react';
import { useState, useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);

  const categoryColor = theme.categoryColors[post.category];

  const handleResonate = async () => {
    if (hasResonated) return;

    setIsResonating(true);
    setHasResonated(true);
    const newCount = localResonateCount + 1;
    setLocalResonateCount(newCount);

    // Optimistic update callback
    onResonate?.(post.id, newCount);

    // Only update database if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('posts')
          .update({ resonate_count: newCount })
          .eq('id', post.id);
      } catch (error) {
        // Revert on error
        setLocalResonateCount(localResonateCount);
        setHasResonated(false);
        console.error('Failed to resonate:', error);
      }
    }

    setTimeout(() => setIsResonating(false), 600);
  };

  const handleShare = async () => {
    // Dynamic import for html2canvas (client-side only)
    const html2canvas = (await import('html2canvas')).default;

    if (!cardRef.current) return;

    try {
      // Create a canvas from the card
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `the-100-year-scroll-age-${post.age_associated}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to generate share image:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Struggle':
        return '💔';
      case 'Joy':
        return '✨';
      case 'Realization':
        return '💡';
      default:
        return '📝';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: hasResonated
            ? `0 0 30px ${theme.accentGlow}40, 0 4px 20px rgba(0,0,0,0.1)`
            : '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Resonate glow effect */}
        <AnimatePresence>
          {isResonating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${theme.accentGlow}60 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Card content */}
        <div className="relative p-6">
          {/* Category badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`,
              }}
            >
              <span>{getCategoryLabel(post.category)}</span>
              {post.category}
            </span>
          </div>

          {/* Quote content */}
          <p
            className="text-base leading-relaxed mb-6 font-serif italic"
            style={{ color: theme.textPrimary }}
          >
            &ldquo;{post.content}&rdquo;
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: theme.cardBorder }}>
            {/* Resonate button */}
            <motion.button
              onClick={handleResonate}
              disabled={hasResonated}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
              style={{
                background: hasResonated ? `${theme.accent}30` : 'transparent',
                color: hasResonated ? theme.accent : theme.textSecondary,
                border: `1px solid ${hasResonated ? theme.accent : theme.cardBorder}`,
              }}
              whileHover={{ scale: hasResonated ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isResonating ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Sparkles size={16} style={{ color: hasResonated ? theme.accentGlow : 'inherit' }} />
              </motion.div>
              <span className="text-sm font-medium">{localResonateCount}</span>
            </motion.button>

            {/* Share button */}
            <motion.button
              onClick={handleShare}
              className="p-2 rounded-full transition-all duration-300"
              style={{
                color: theme.textMuted,
              }}
              whileHover={{
                scale: 1.1,
                color: theme.accent,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
