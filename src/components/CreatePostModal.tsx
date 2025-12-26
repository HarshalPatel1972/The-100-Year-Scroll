'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useAge, getAgeTheme } from '@/context/AgeContext';
import { PostCategory, supabase, isSupabaseConfigured } from '@/lib/supabase';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const categories: { value: PostCategory; label: string }[] = [
  { value: 'Struggle', label: 'Struggle' },
  { value: 'Joy', label: 'Joy' },
  { value: 'Realization', label: 'Realization' },
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : getAgeTheme(25);
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !selectedCategory || currentAge === null) return;
    setIsSubmitting(true);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('posts').insert({
        content: content.trim(),
        age_associated: currentAge,
        category: selectedCategory,
      })
    } else {
        await new Promise(r => setTimeout(r, 800)); // Fake delay
    }

    setContent('');
    setSelectedCategory(null);
    setIsSubmitting(false);
    onPostCreated();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Floating Glass Pane */}
            <div
              className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/10 p-12 md:p-16 relative shadow-2xl"
            >
               <button onClick={onClose} className="absolute top-8 right-8 opacity-50 hover:opacity-100 transition-opacity text-white">
                  <X size={24} strokeWidth={1} />
               </button>

               <div className="mb-12">
                  <span className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-4">Contribute</span>
                  <h2 className="text-4xl font-serif text-white italic">Age {currentAge}</h2>
               </div>

               <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What is your truth at this age?"
                  className="w-full h-40 bg-transparent text-2xl md:text-3xl font-serif text-white placeholder-white/20 resize-none focus:outline-none leading-relaxed italic"
                  maxLength={280}
               />
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8">
                  <div className="space-y-4 w-full">
                     <label className="text-xs uppercase tracking-widest text-white/40 block">Category</label>
                     <div className="flex gap-4 flex-wrap">
                        {categories.map((cat) => (
                           <button
                              key={cat.value}
                              onClick={() => setSelectedCategory(cat.value)}
                              className={`px-6 py-2 border rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                                 selectedCategory === cat.value 
                                 ? 'bg-white text-black border-white' 
                                 : 'border-white/20 text-white/60 hover:border-white/60'
                              }`}
                           >
                              {cat.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  <button
                     onClick={handleSubmit}
                     disabled={!content.trim() || !selectedCategory || isSubmitting}
                     className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                     {isSubmitting ? 'Posting...' : 'Publish'}
                  </button>
               </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
