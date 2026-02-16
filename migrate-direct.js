const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envFile = fs.readFileSync('.env.local', 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = rest.join('=').trim()
  }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const sql = fs.readFileSync('./supabase/migrations/001_modelduel_schema.sql', 'utf8')

async function migrate() {
  console.log('Creating tables...')
  
  // Create comparisons table
  const { error: e1 } = await supabase.rpc('exec_sql', {
    query: `CREATE TABLE IF NOT EXISTS modelduel_comparisons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      mode VARCHAR(20) NOT NULL CHECK (mode IN ('single', 'multi')),
      prompt TEXT NOT NULL,
      examples JSONB,
      results JSONB NOT NULL,
      winner VARCHAR(20) CHECK (winner IN ('gpt4', 'claude', 'gemini')),
      is_public BOOLEAN DEFAULT false,
      share_token VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`
  })
  if (e1) console.log('Comparisons table:', e1.message)
  
  // Create votes table
  const { error: e2 } = await supabase.rpc('exec_sql', {
    query: `CREATE TABLE IF NOT EXISTS modelduel_votes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      comparison_id UUID NOT NULL,
      user_id UUID,
      voter_fingerprint VARCHAR(100),
      winner VARCHAR(20) NOT NULL CHECK (winner IN ('gpt4', 'claude', 'gemini')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(comparison_id, voter_fingerprint)
    )`
  })
  if (e2) console.log('Votes table:', e2.message)
  
  console.log('✅ Tables created!')
}

migrate()
