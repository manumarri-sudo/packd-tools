const { Client } = require('pg')
const fs = require('fs')

// Parse .env.local for database URL
const envFile = fs.readFileSync('.env.local', 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = rest.join('=').trim()
  }
})

// You'll need to provide the password
const connectionString = `postgresql://postgres.dcrfsckfltofpkdyoqps:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

const client = new Client({ connectionString })

const sql = fs.readFileSync('./supabase/migrations/001_modelduel_schema.sql', 'utf8')

async function run() {
  await client.connect()
  console.log('✅ Connected to database')
  
  console.log('🔄 Running migration...')
  await client.query(sql)
  
  console.log('✅ Migration complete!')
  await client.end()
}

run().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
