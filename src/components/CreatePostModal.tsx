'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useAge, getAgeTheme } from '@/context/AgeContext';
import { PostCategory, supabase, isSupabaseConfigured, Post } from '@/lib/supabase';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const categories: { value: PostCategory; label: string; emoji: string }[] = [
  { value: 'Struggle', label: 'Struggle', emoji: '💔' },
  { value: 'Joy', label: 'Joy', emoji: '✨' },
  { value: 'Realization', label: 'Realization', emoji: '💡' },
];

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const { currentAge } = useAge();
  const theme = currentAge !== null ? getAgeTheme(currentAge) : getAgeTheme(25);

  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = content.length;
  const maxChars = 280;
  const isValid = content.trim().length > 0 && selectedCategory !== null && charCount <= maxChars;

  const handleSubmit = async () => {
    if (!isValid || currentAge === null) return;

    setIsSubmitting(true);
    setError(null);

    // If Supabase is not configured, simulate success
    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setContent('');
        setSelectedCategory(null);
        setIsSubmitting(false);
        onPostCreated();
        onClose();
      }, 800);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('posts').insert({
        content: content.trim(),
        age_associated: currentAge,
        category: selectedCategory,
      });

      if (insertError) throw insertError;

      // Reset form
      setContent('');
      setSelectedCategory(null);
      onPostCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-lg rounded-3xl overflow-hidden backdrop-blur-xl"
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.4), 0 0 60px ${theme.accentGlow}20`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: theme.cardBorder }}
              >
                <div>
                  <h2 className="text-xl font-serif font-bold" style={{ color: theme.textPrimary }}>
                    Contribute to Age {currentAge}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                    Share a moment of wisdom
                    {!isSupabaseConfigured && ' (Demo Mode)'}
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: theme.textMuted }}
                  whileHover={{ scale: 1.1, color: theme.textPrimary }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Text area */}
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What did life teach you at this age?"
                    className="w-full h-32 px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all duration-300 font-serif text-lg"
                    style={{
                      background: currentAge && currentAge >= 40 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: theme.textPrimary,
                      border: `1px solid ${theme.cardBorder}`,
                    }}
                    maxLength={maxChars}
                  />
                  <div className="flex justify-end mt-2">
                    <span
                      className="text-sm"
                      style={{
                        color: charCount > maxChars ? '#ef4444' : theme.textMuted,
                      }}
                    >
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>

                {/* Category selection */}
                <div>
                  <label className="block text-sm mb-3" style={{ color: theme.textSecondary }}>
                    What kind of moment is this?
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                          background:
                            selectedCategory === cat.value
                              ? `${theme.categoryColors[cat.value]}30`
                              : currentAge && currentAge >= 40
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.05)',
                          color:
                            selectedCategory === cat.value
                              ? theme.categoryColors[cat.value]
                              : theme.textSecondary,
                          border: `1px solid ${
                            selectedCategory === cat.value
                              ? theme.categoryColors[cat.value]
                              : theme.cardBorder
                          }`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  className="w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentGlow})`,
                    color: currentAge && currentAge >= 40 ? 'white' : 'hsl(0,0%,10%)',
                    boxShadow: isValid ? `0 8px 24px ${theme.accent}40` : 'none',
                  }}
                  whileHover={isValid ? { scale: 1.02, boxShadow: `0 12px 32px ${theme.accent}50` } : {}}
                  whileTap={isValid ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⏳
                      </motion.span>
                      Sharing...
                    </span>
                  ) : (
                    'Share Your Wisdom'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
