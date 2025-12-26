-- Supabase SQL Schema for "The 100-Year Scroll"
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
-- First, create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL CHECK (char_length(content) <= 280),
    age_associated INTEGER NOT NULL CHECK (age_associated >= 0 AND age_associated <= 100),
    category TEXT NOT NULL CHECK (category IN ('Struggle', 'Joy', 'Realization')),
    resonate_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on age_associated for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_age ON posts(age_associated);

-- Create an index on resonate_count for sorting by popularity
CREATE INDEX IF NOT EXISTS idx_posts_resonate ON posts(resonate_count DESC);

-- Enable Row Level Security (but allow anonymous access)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read posts
CREATE POLICY "Anyone can read posts" ON posts
    FOR SELECT USING (true);

-- Policy: Anyone can insert posts (anonymous posting)
CREATE POLICY "Anyone can insert posts" ON posts
    FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update resonate_count (for the Resonate button)
CREATE POLICY "Anyone can update resonate count" ON posts
    FOR UPDATE USING (true) WITH CHECK (true);

-- Optional: Create a function to increment resonate_count atomically
CREATE OR REPLACE FUNCTION increment_resonate(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET resonate_count = resonate_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample seed data (optional - for testing)
INSERT INTO posts (content, age_associated, category) VALUES
    ('Learning to walk was the first time I refused to give up. Every fall was just practice for getting back up.', 1, 'Realization'),
    ('My first word was "no." Turns out, boundaries are learned early.', 2, 'Joy'),
    ('The tooth fairy taught me that loss comes with unexpected gifts.', 6, 'Realization'),
    ('Made my first real friend today. Shared my sandwich. That was all it took.', 5, 'Joy'),
    ('Got lost in the supermarket. For five minutes, I understood true terror.', 4, 'Struggle'),
    ('High school feels like the most important thing in the world. It is not.', 15, 'Realization'),
    ('First heartbreak. The world kept spinning even when I wanted it to stop.', 16, 'Struggle'),
    ('Learned to drive. Freedom has four wheels and a full tank of gas.', 16, 'Joy'),
    ('Picked the wrong major. Picked again. Both were right for different reasons.', 19, 'Realization'),
    ('First apartment. Ramen and freedom taste the same.', 22, 'Joy'),
    ('Work is not your worth. Took me too long to understand this.', 28, 'Realization'),
    ('Met someone who sees me. Really sees me. That is everything.', 27, 'Joy'),
    ('Lost my job. Found myself. Fair trade.', 32, 'Realization'),
    ('Your parents are just people. Flawed, hopeful, trying their best people.', 35, 'Realization'),
    ('Built something with my own hands. Nothing compares to that satisfaction.', 38, 'Joy'),
    ('The friends you keep past 30 are the ones who matter.', 40, 'Realization'),
    ('Health is not a given. Cherish every morning you wake up pain-free.', 45, 'Struggle'),
    ('Watched my child fail. Let them. Hardest and best parenting moment.', 48, 'Realization'),
    ('Career peak. It is emptier than I thought it would be.', 50, 'Realization'),
    ('Started saying no more often. Peace followed.', 52, 'Joy'),
    ('The body slows but the mind sharpens. A fair exchange.', 55, 'Realization'),
    ('Grandchildren: all the joy, fraction of the responsibility.', 60, 'Joy'),
    ('Retirement is not an ending. It is a permission slip.', 65, 'Joy'),
    ('Lost my partner of 40 years. Grief is love with nowhere to go.', 72, 'Struggle'),
    ('Every sunrise is a gift I stopped taking for granted decades ago.', 75, 'Realization'),
    ('Regret less, forgive more. The math is simple.', 80, 'Realization'),
    ('I have outlived friends, enemies, and my own expectations.', 85, 'Realization'),
    ('The secret to 90? Curiosity. Never stop asking questions.', 90, 'Joy'),
    ('I was here. I loved. I was loved. That is enough.', 95, 'Realization'),
    ('If you are reading this, you are not too late. Start today.', 100, 'Joy');
