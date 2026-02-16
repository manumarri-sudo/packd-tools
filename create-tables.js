const fs = require('fs')

const envFile = fs.readFileSync('.env.local', 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = rest.join('=').trim()
  }
})

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function createTables() {
  console.log('📋 Creating tables via Supabase Management API...')
  
  // Enable RLS and create tables using SQL via Supabase API
  const queries = [
    // Create comparisons table
    `CREATE TABLE IF NOT EXISTS public.modelduel_comparisons (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid,
      mode text NOT NULL CHECK (mode IN ('single', 'multi')),
      prompt text NOT NULL,
      examples jsonb,
      results jsonb NOT NULL,
      winner text CHECK (winner IN ('gpt4', 'claude', 'gemini')),
      is_public boolean DEFAULT false,
      share_token text UNIQUE NOT NULL,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );`,
    
    // Create votes table
    `CREATE TABLE IF NOT EXISTS public.modelduel_votes (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      comparison_id uuid NOT NULL REFERENCES public.modelduel_comparisons(id) ON DELETE CASCADE,
      user_id uuid,
      voter_fingerprint text,
      winner text NOT NULL CHECK (winner IN ('gpt4', 'claude', 'gemini')),
      created_at timestamp with time zone DEFAULT now(),
      UNIQUE(comparison_id, voter_fingerprint)
    );`,
    
    // Enable RLS
    `ALTER TABLE public.modelduel_comparisons ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE public.modelduel_votes ENABLE ROW LEVEL SECURITY;`,
    
    // Create policies
    `CREATE POLICY IF NOT EXISTS "Public comparisons viewable" ON public.modelduel_comparisons FOR SELECT USING (is_public = true);`,
    `CREATE POLICY IF NOT EXISTS "Anyone can insert comparisons" ON public.modelduel_comparisons FOR INSERT WITH CHECK (true);`,
    `CREATE POLICY IF NOT EXISTS "Anyone can view votes" ON public.modelduel_votes FOR SELECT USING (true);`,
    `CREATE POLICY IF NOT EXISTS "Anyone can insert votes" ON public.modelduel_votes FOR INSERT WITH CHECK (true);`,
  ]
  
  for (const query of queries) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query })
      })
      
      if (response.ok) {
        console.log('✅', query.substring(0, 50) + '...')
      } else {
        const error = await response.text()
        console.log('⚠️', query.substring(0, 30), '...', error.substring(0, 100))
      }
    } catch (err) {
      console.log('⚠️ Error:', err.message)
    }
  }
  
  console.log('\n✅ Table creation complete!')
}

createTables()
