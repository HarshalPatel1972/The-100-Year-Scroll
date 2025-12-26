'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAge, getAgeTheme } from '@/context/AgeContext';
import { Post, supabase, isSupabaseConfigured, getMockPostsByAge } from '@/lib/supabase';
import StickyHeader from './StickyHeader';
import MasonryGrid from './MasonryGrid';
import FloatingActionButton from './FloatingActionButton';
import CreatePostModal from './CreatePostModal';

export default function MainFeed() {
  const { currentAge, setCurrentAge } = useAge();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;

  // Fetch posts for current age
  const fetchPosts = useCallback(async () => {
    if (currentAge === null) return;

    setIsLoading(true);
    
    // If Supabase is not configured, use mock data
    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setPosts(getMockPostsByAge(currentAge));
        setIsLoading(false);
      }, 500); // Simulate loading
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('age_associated', currentAge)
        .order('resonate_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Fallback to mock data on error
      setPosts(getMockPostsByAge(currentAge));
    } finally {
      setIsLoading(false);
    }
  }, [currentAge]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle resonate update
  const handleResonate = (postId: string, newCount: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, resonate_count: newCount } : post
      )
    );
  };

  // Age navigation
  const handlePrevAge = () => {
    if (currentAge !== null && currentAge > 0) {
      setCurrentAge(currentAge - 1);
    }
  };

  const handleNextAge = () => {
    if (currentAge !== null && currentAge < 100) {
      setCurrentAge(currentAge + 1);
    }
  };

  // Infinite scroll detection for transitioning to next age
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // If scrolled to bottom, go to next age
      if (scrollPosition >= pageHeight - 100 && currentAge !== null && currentAge < 100 && !isLoading) {
        handleNextAge();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentAge, isLoading]);

  if (currentAge === null) return null;

  return (
    <div ref={feedRef} className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <StickyHeader
        onPrevAge={handlePrevAge}
        onNextAge={handleNextAge}
        canGoPrev={currentAge > 0}
        canGoNext={currentAge < 100}
      />

      <main className="max-w-6xl mx-auto">
        {/* Dev mode indicator */}
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl backdrop-blur-md text-center"
            style={{
              background: 'rgba(255, 200, 100, 0.15)',
              border: '1px solid rgba(255, 200, 100, 0.3)',
            }}
          >
            <p className="text-sm" style={{ color: theme?.textSecondary }}>
              🛠️ <strong>Development Mode</strong> — Using demo data. Configure Supabase credentials to enable the full experience.
            </p>
          </motion.div>
        )}

        {/* Loading state */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-5xl mb-4"
              >
                ⏳
              </motion.div>
              <p style={{ color: theme?.textMuted }}>Loading stories...</p>
            </motion.div>
          ) : (
            <motion.div
              key={`feed-${currentAge}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MasonryGrid posts={posts} onResonate={handleResonate} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll prompt for next age */}
        {!isLoading && posts.length > 0 && currentAge < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center py-16"
          >
            <p style={{ color: theme?.textMuted }} className="text-sm">
              ↓ Scroll down to explore Age {currentAge + 1}
            </p>
          </motion.div>
        )}
      </main>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
}
