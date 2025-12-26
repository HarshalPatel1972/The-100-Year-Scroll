'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAge, getAgeTheme } from '@/context/AgeContext';
import { Post, supabase, isSupabaseConfigured, getMockPostsByAge } from '@/lib/supabase';
import Sidebar from './Sidebar';
import MasonryGrid from './MasonryGrid';
import FloatingActionButton from './FloatingActionButton';
import CreatePostModal from './CreatePostModal';

export default function MainFeed() {
  const { currentAge, setCurrentAge } = useAge();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = currentAge !== null ? getAgeTheme(currentAge) : null;

  // Fetch posts logic
  const fetchPosts = useCallback(async () => {
    if (currentAge === null) return;
    setIsLoading(true);
    
    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setPosts(getMockPostsByAge(currentAge));
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('age_associated', currentAge)
        .order('resonate_count', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      setPosts(getMockPostsByAge(currentAge));
    } finally {
      setIsLoading(false);
    }
  }, [currentAge]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleNextAge = () => {
    if (currentAge !== null && currentAge < 100) {
      setCurrentAge(currentAge + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevAge = () => {
    if (currentAge !== null && currentAge > 0) {
      setCurrentAge(currentAge - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentAge === null || !theme) return null;

  return (
    <div className="min-h-screen relative">
      
      {/* 1. Massive Fixed Background Number (Texture) */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 mix-blend-overlay opacity-10"
        aria-hidden="true"
      >
        <span 
          className="font-serif font-black italic block leading-none"
          style={{ 
            fontSize: '40vw', 
            color: theme.isDark ? 'white' : 'black'
          }}
        >
          {currentAge}
        </span>
      </div>

      {/* 2. Asymmetrical Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left Column: Sidebar (30%) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 border-r border-white/5">
          <Sidebar 
            onPrevAge={handlePrevAge}
            onNextAge={handleNextAge}
            canGoPrev={currentAge > 0}
            canGoNext={currentAge < 100}
          />
        </div>

        {/* Right Column: Content (70%) */}
        <div className="col-span-1 lg:col-span-8 xl:col-span-9 p-6 md:p-12 lg:p-20">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden mb-12 flex justify-between items-end border-b border-white/10 pb-6">
             <div>
                <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: theme.textPrimary }}>Age</p>
                <h1 className="text-6xl font-serif font-black" style={{ color: theme.textPrimary }}>{currentAge}</h1>
             </div>
             <div className="flex gap-4">
                <button onClick={handlePrevAge} disabled={currentAge <= 0} className="px-4 py-2 opacity-60">Prev</button>
                <button onClick={handleNextAge} disabled={currentAge >= 100} className="px-4 py-2 opacity-60">Next</button>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
               <div className="h-64 flex items-center justify-center">
                 <div className="animate-spin text-2xl">⏳</div>
               </div>
            ) : (
              <motion.div
                key={currentAge}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                  <MasonryGrid 
                    posts={posts} 
                    onResonate={(id, count) => {
                      setPosts(p => p.map(x => x.id === id ? {...x, resonate_count: count} : x));
                    }} 
                  />
                  
                  {/* Empty state pusher */}
                  {posts.length > 0 && (
                    <div className="py-32 flex justify-center">
                       <button 
                         onClick={handleNextAge}
                         className="group flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity"
                         style={{ color: theme.textPrimary }}
                       >
                         <span className="h-16 w-px bg-current" />
                         <span className="text-xs uppercase tracking-widest">Continue to Age {currentAge + 1}</span>
                       </button>
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
}
