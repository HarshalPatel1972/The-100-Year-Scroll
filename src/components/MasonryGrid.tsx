'use client';

import { motion } from 'framer-motion';
import { Post } from '@/lib/supabase';
import PostCard from './PostCard';

interface MasonryGridProps {
  posts: Post[];
  onResonate?: (postId: string, newCount: number) => void;
}

export default function MasonryGrid({ posts, onResonate }: MasonryGridProps) {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-serif text-white/80 mb-2">
          No stories yet at this age
        </h3>
        <p className="text-white/50 max-w-md">
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
      className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
    >
      {posts.map((post, index) => (
        <div key={post.id} className="break-inside-avoid">
          <PostCard post={post} index={index} onResonate={onResonate} />
        </div>
      ))}
    </motion.div>
  );
}
