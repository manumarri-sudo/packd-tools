import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST() {
  try {
    console.log('🔄 Running database migration...')

    // Create modelduel_comparisons table
    const { error: error1 } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.modelduel_comparisons (
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
        );

        CREATE INDEX IF NOT EXISTS idx_modelduel_share ON public.modelduel_comparisons(share_token);
        CREATE INDEX IF NOT EXISTS idx_modelduel_created ON public.modelduel_comparisons(created_at DESC);
      `,
    })

    if (error1 && !error1.message.includes('already exists')) {
      // Try direct table creation
      const { error: createError } = await supabaseAdmin.from('modelduel_comparisons').select('count').limit(0)

      if (createError) {
        console.error('Error checking table:', createError)
      }
    }

    // Create modelduel_votes table
    const { error: error2 } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.modelduel_votes (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          comparison_id uuid NOT NULL,
          user_id uuid,
          voter_fingerprint text,
          winner text NOT NULL CHECK (winner IN ('gpt4', 'claude', 'gemini')),
          created_at timestamp with time zone DEFAULT now()
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_unique ON public.modelduel_votes(comparison_id, voter_fingerprint);
        CREATE INDEX IF NOT EXISTS idx_votes_comparison ON public.modelduel_votes(comparison_id);
      `,
    })

    // Enable RLS
    await supabaseAdmin.rpc('exec', {
      sql: `
        ALTER TABLE public.modelduel_comparisons ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.modelduel_votes ENABLE ROW LEVEL SECURITY;
      `,
    })

    // Create policies
    await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Public comparisons viewable"
          ON public.modelduel_comparisons FOR SELECT
          USING (is_public = true);

        CREATE POLICY IF NOT EXISTS "Anyone can insert comparisons"
          ON public.modelduel_comparisons FOR INSERT
          WITH CHECK (true);

        CREATE POLICY IF NOT EXISTS "Anyone can view votes"
          ON public.modelduel_votes FOR SELECT
          USING (true);

        CREATE POLICY IF NOT EXISTS "Anyone can insert votes"
          ON public.modelduel_votes FOR INSERT
          WITH CHECK (true);
      `,
    })

    // Verify tables exist
    const { data, error: verifyError } = await supabaseAdmin
      .from('modelduel_comparisons')
      .select('count')
      .limit(0)

    if (verifyError) {
      return NextResponse.json({
        success: false,
        error: 'Tables may not have been created. Error: ' + verifyError.message,
        message:
          'The RPC method might not be available. Please run the SQL manually in Supabase SQL Editor.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully!',
      tables: ['modelduel_comparisons', 'modelduel_votes'],
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      fallbackMessage:
        'If this fails, please run the SQL from supabase/migrations/001_modelduel_schema.sql manually in Supabase SQL Editor.',
    })
  }
}
