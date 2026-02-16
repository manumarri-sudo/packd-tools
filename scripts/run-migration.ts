import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/001_modelduel_schema.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  console.log('Running database migration...')

  // Split by semicolon and run each statement
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
      if (error) {
        console.error('Migration error:', error)
      }
    } catch (error) {
      console.error('Failed to execute statement:', statement.substring(0, 100))
      console.error(error)
    }
  }

  console.log('Migration complete!')
}

runMigration()
