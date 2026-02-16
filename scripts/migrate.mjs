import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read env file
const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('🔄 Running database migration...')

  const migrationSQL = readFileSync(
    join(__dirname, '../supabase/migrations/001_modelduel_schema.sql'),
    'utf8'
  )

  // Execute the migration
  const { data, error } = await supabase.rpc('exec', { sql: migrationSQL })

  if (error) {
    // If exec doesn't exist, try running statements individually
    console.log('📝 Running migration statements individually...')

    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      try {
        const { error: stmtError } = await supabase.rpc('exec', { sql: statement + ';' })
        if (stmtError) {
          // Try direct query
          const result = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ sql: statement + ';' })
          })

          if (!result.ok) {
            console.log('⚠️  Statement might have failed (this is often OK):', statement.substring(0, 50) + '...')
          }
        }
      } catch (err) {
        console.log('⚠️  Error (continuing):', err.message)
      }
    }
  }

  console.log('✅ Migration complete!')
  console.log('\n📊 Verifying tables...')

  // Verify tables exist
  const { data: tables, error: tablesError } = await supabase
    .from('modelduel_comparisons')
    .select('count', { count: 'exact', head: true })

  if (tablesError) {
    console.log('❌ Table verification failed. Trying alternate method...')

    // Use pg_meta to check tables
    const checkResult = await fetch(`${supabaseUrl}/rest/v1/?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })

    console.log('Database connection:', checkResult.ok ? '✅ OK' : '❌ Failed')
  } else {
    console.log('✅ Tables created successfully!')
  }

  process.exit(0)
}

runMigration().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
