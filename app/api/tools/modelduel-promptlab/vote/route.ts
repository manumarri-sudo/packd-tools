import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateFingerprint } from '@/lib/utils/share-token'

const VoteSchema = z.object({
  comparisonId: z.string().uuid(),
  winner: z.enum(['gpt4', 'claude', 'gemini']),
  fingerprint: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = VoteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { comparisonId, winner } = validation.data
    const voterFingerprint = body.fingerprint || generateFingerprint(req)

    // Insert or update vote
    const { error: voteError } = await supabaseAdmin.from('modelduel_votes').upsert(
      {
        comparison_id: comparisonId,
        voter_fingerprint: voterFingerprint,
        winner,
      },
      {
        onConflict: 'comparison_id,voter_fingerprint',
      }
    )

    if (voteError) {
      console.error('Vote error:', voteError)
      return NextResponse.json({ success: false, error: 'Failed to record vote' }, { status: 500 })
    }

    // Get updated vote counts
    const { data: votes, error: countError } = await supabaseAdmin
      .from('modelduel_votes')
      .select('winner')
      .eq('comparison_id', comparisonId)

    if (countError) {
      console.error('Count error:', countError)
    }

    const voteCounts = {
      gpt4: votes?.filter((v) => v.winner === 'gpt4').length || 0,
      claude: votes?.filter((v) => v.winner === 'claude').length || 0,
      gemini: votes?.filter((v) => v.winner === 'gemini').length || 0,
    }

    return NextResponse.json({
      success: true,
      data: { votes: voteCounts },
    })
  } catch (error: any) {
    console.error('Vote API Error:', error)
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 })
  }
}
