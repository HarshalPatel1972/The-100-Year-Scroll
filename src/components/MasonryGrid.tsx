'use client';

import { motion } from 'framer-motion';
import { Post } from '@/lib/supabase';
import { useAge, getAgeTheme } from '@/context/AgeContext';
import PostCard from './PostCard';

interface MasonryGridProps {
  posts: Post[];
  onResonate?: (postId: string, newCount: number) => void;
}

export default function MasonryGrid({ posts, onResonate }: MasonryGridProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="text-5xl mb-6">🌱</div>
        <h3 
          className="text-2xl font-serif italic mb-3"
          style={{ color: theme?.textPrimary }}
        >
          No stories yet at this age
        </h3>
        <p 
          className="max-w-md leading-relaxed"
          style={{ color: theme?.textMuted, lineHeight: '1.7' }}
        >
          Be the first to plant a seed of wisdom. Share a struggle, a joy, or a realization from this time in life.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="columns-1 md:columns-2 lg:columns-3 gap-6"
      style={{ columnGap: '1.5rem' }}
    >
      {posts.map((post, index) => (
        <div key={post.id} className="break-inside-avoid mb-6">
          <PostCard post={post} index={index} onResonate={onResonate} />
        </div>
      ))}
    </motion.div>
  );
}
