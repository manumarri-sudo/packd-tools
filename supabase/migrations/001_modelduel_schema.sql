-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Comparisons table
CREATE TABLE IF NOT EXISTS modelduel_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('single', 'multi')),
  prompt TEXT NOT NULL,
  examples JSONB,
  results JSONB NOT NULL,
  winner VARCHAR(20) CHECK (winner IN ('gpt4', 'claude', 'gemini')),
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_modelduel_user ON modelduel_comparisons(user_id);
CREATE INDEX idx_modelduel_share ON modelduel_comparisons(share_token);
CREATE INDEX idx_modelduel_public ON modelduel_comparisons(is_public) WHERE is_public = true;
CREATE INDEX idx_modelduel_created ON modelduel_comparisons(created_at DESC);

-- Votes table
CREATE TABLE IF NOT EXISTS modelduel_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comparison_id UUID NOT NULL REFERENCES modelduel_comparisons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  voter_fingerprint VARCHAR(100),
  winner VARCHAR(20) NOT NULL CHECK (winner IN ('gpt4', 'claude', 'gemini')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comparison_id, voter_fingerprint)
);

-- Index for vote lookups
CREATE INDEX idx_votes_comparison ON modelduel_votes(comparison_id);

-- Row Level Security Policies
ALTER TABLE modelduel_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelduel_votes ENABLE ROW LEVEL SECURITY;

-- Comparisons policies
CREATE POLICY "Users can view own comparisons"
  ON modelduel_comparisons FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own comparisons"
  ON modelduel_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comparisons"
  ON modelduel_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comparisons"
  ON modelduel_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Anyone can view votes"
  ON modelduel_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON modelduel_votes FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_modelduel_comparisons_updated_at
  BEFORE UPDATE ON modelduel_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
