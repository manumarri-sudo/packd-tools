import { createClient } from '@supabase/supabase-js'

let supabaseAdminInstance: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseUrl || !supabaseKey) {
      // Return a mock client for build time
      return createClient('https://placeholder.supabase.co', 'placeholder-key', {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return supabaseAdminInstance
})()
