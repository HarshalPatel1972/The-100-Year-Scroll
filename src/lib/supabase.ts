import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Types for our database
export interface Post {
  id: string;
  content: string;
  age_associated: number;
  category: 'Struggle' | 'Joy' | 'Realization';
  resonate_count: number;
  created_at: string;
}

export type PostCategory = 'Struggle' | 'Joy' | 'Realization';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock data for development without Supabase
export const mockPosts: Post[] = [
  // Ages 0-19 (Dawn)
  {
    id: '1',
    content: 'Learning to walk was the first time I refused to give up. Every fall was just practice for getting back up.',
    age_associated: 1,
    category: 'Realization',
    resonate_count: 42,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'My first word was "no." Turns out, boundaries are learned early.',
    age_associated: 2,
    category: 'Joy',
    resonate_count: 28,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    content: 'Got lost in the supermarket. For five minutes, I understood true terror.',
    age_associated: 4,
    category: 'Struggle',
    resonate_count: 56,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    content: 'Made my first real friend today. Shared my sandwich. That was all it took.',
    age_associated: 5,
    category: 'Joy',
    resonate_count: 89,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    content: 'The tooth fairy taught me that loss comes with unexpected gifts.',
    age_associated: 6,
    category: 'Realization',
    resonate_count: 34,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    content: 'High school feels like the most important thing in the world. It is not.',
    age_associated: 15,
    category: 'Realization',
    resonate_count: 156,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    content: 'First heartbreak. The world kept spinning even when I wanted it to stop.',
    age_associated: 16,
    category: 'Struggle',
    resonate_count: 203,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    content: 'Learned to drive. Freedom has four wheels and a full tank of gas.',
    age_associated: 16,
    category: 'Joy',
    resonate_count: 178,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    content: 'Picked the wrong major. Picked again. Both were right for different reasons.',
    age_associated: 19,
    category: 'Realization',
    resonate_count: 145,
    created_at: new Date().toISOString(),
  },
  // Ages 20-39 (Noon)
  {
    id: '10',
    content: 'First apartment. Ramen and freedom taste the same.',
    age_associated: 22,
    category: 'Joy',
    resonate_count: 234,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    content: 'Your twenties are for making mistakes. Your thirties are for understanding them.',
    age_associated: 25,
    category: 'Realization',
    resonate_count: 312,
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    content: 'Nobody knows what they are doing. Everyone is pretending. This is liberating.',
    age_associated: 25,
    category: 'Realization',
    resonate_count: 445,
    created_at: new Date().toISOString(),
  },
  {
    id: '13',
    content: 'Comparison is the thief of joy. I learned to run my own race.',
    age_associated: 25,
    category: 'Struggle',
    resonate_count: 189,
    created_at: new Date().toISOString(),
  },
  {
    id: '14',
    content: 'Met someone who sees me. Really sees me. That is everything.',
    age_associated: 27,
    category: 'Joy',
    resonate_count: 378,
    created_at: new Date().toISOString(),
  },
  {
    id: '15',
    content: 'Work is not your worth. Took me too long to understand this.',
    age_associated: 28,
    category: 'Realization',
    resonate_count: 289,
    created_at: new Date().toISOString(),
  },
  {
    id: '16',
    content: 'Lost my job. Found myself. Fair trade.',
    age_associated: 32,
    category: 'Realization',
    resonate_count: 167,
    created_at: new Date().toISOString(),
  },
  {
    id: '17',
    content: 'Your parents are just people. Flawed, hopeful, trying their best people.',
    age_associated: 35,
    category: 'Realization',
    resonate_count: 423,
    created_at: new Date().toISOString(),
  },
  {
    id: '18',
    content: 'Built something with my own hands. Nothing compares to that satisfaction.',
    age_associated: 38,
    category: 'Joy',
    resonate_count: 198,
    created_at: new Date().toISOString(),
  },
  // Ages 40-59 (Dusk)
  {
    id: '19',
    content: 'The friends you keep past 40 are the ones who matter.',
    age_associated: 40,
    category: 'Realization',
    resonate_count: 356,
    created_at: new Date().toISOString(),
  },
  {
    id: '20',
    content: 'Health is not a given. Cherish every morning you wake up pain-free.',
    age_associated: 45,
    category: 'Struggle',
    resonate_count: 412,
    created_at: new Date().toISOString(),
  },
  {
    id: '21',
    content: 'Watched my child fail. Let them. Hardest and best parenting moment.',
    age_associated: 48,
    category: 'Realization',
    resonate_count: 289,
    created_at: new Date().toISOString(),
  },
  {
    id: '22',
    content: 'Career peak. It is emptier than I thought it would be.',
    age_associated: 50,
    category: 'Realization',
    resonate_count: 234,
    created_at: new Date().toISOString(),
  },
  {
    id: '23',
    content: 'Started saying no more often. Peace followed.',
    age_associated: 52,
    category: 'Joy',
    resonate_count: 345,
    created_at: new Date().toISOString(),
  },
  {
    id: '24',
    content: 'The body slows but the mind sharpens. A fair exchange.',
    age_associated: 55,
    category: 'Realization',
    resonate_count: 278,
    created_at: new Date().toISOString(),
  },
  // Ages 60-100 (Night/Starlight)
  {
    id: '25',
    content: 'Grandchildren: all the joy, fraction of the responsibility.',
    age_associated: 60,
    category: 'Joy',
    resonate_count: 456,
    created_at: new Date().toISOString(),
  },
  {
    id: '26',
    content: 'Retirement is not an ending. It is a permission slip.',
    age_associated: 65,
    category: 'Joy',
    resonate_count: 389,
    created_at: new Date().toISOString(),
  },
  {
    id: '27',
    content: 'Lost my partner of 40 years. Grief is love with nowhere to go.',
    age_associated: 72,
    category: 'Struggle',
    resonate_count: 567,
    created_at: new Date().toISOString(),
  },
  {
    id: '28',
    content: 'Every sunrise is a gift I stopped taking for granted decades ago.',
    age_associated: 75,
    category: 'Realization',
    resonate_count: 423,
    created_at: new Date().toISOString(),
  },
  {
    id: '29',
    content: 'Regret less, forgive more. The math is simple.',
    age_associated: 80,
    category: 'Realization',
    resonate_count: 534,
    created_at: new Date().toISOString(),
  },
  {
    id: '30',
    content: 'I have outlived friends, enemies, and my own expectations.',
    age_associated: 85,
    category: 'Realization',
    resonate_count: 312,
    created_at: new Date().toISOString(),
  },
  {
    id: '31',
    content: 'The secret to 90? Curiosity. Never stop asking questions.',
    age_associated: 90,
    category: 'Joy',
    resonate_count: 678,
    created_at: new Date().toISOString(),
  },
  {
    id: '32',
    content: 'I was here. I loved. I was loved. That is enough.',
    age_associated: 95,
    category: 'Realization',
    resonate_count: 892,
    created_at: new Date().toISOString(),
  },
  {
    id: '33',
    content: 'If you are reading this, you are not too late. Start today.',
    age_associated: 100,
    category: 'Joy',
    resonate_count: 1024,
    created_at: new Date().toISOString(),
  },
];

// Helper to get mock posts by age
export function getMockPostsByAge(age: number): Post[] {
  return mockPosts.filter((post) => post.age_associated === age);
}
