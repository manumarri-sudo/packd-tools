'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function MigratePage() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState('')

  const runMigration = async () => {
    setRunning(true)
    setResult('')

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Migration completed!')
        setResult('✅ Database tables created successfully!\n\n' + JSON.stringify(data, null, 2))
      } else {
        toast.error('Migration failed')
        setResult('❌ Migration failed:\n\n' + JSON.stringify(data, null, 2))
      }
    } catch (error: any) {
      toast.error('Migration error')
      setResult('❌ Error: ' + error.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Database Migration</h1>
          <p className="text-slate-400">Run this once to create the database tables</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-8">
          <button
            onClick={runMigration}
            disabled={running}
            className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-lg"
          >
            {running ? 'Running Migration...' : 'Run Database Migration'}
          </button>

          {result && (
            <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-white/10">
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{result}</pre>
            </div>
          )}

          <div className="mt-6 text-sm text-slate-400 space-y-2">
            <p>This will create:</p>
            <ul className="list-disc list-inside ml-4">
              <li>modelduel_comparisons table</li>
              <li>modelduel_votes table</li>
              <li>Row Level Security (RLS) policies</li>
              <li>Necessary indexes</li>
            </ul>
            <p className="mt-4">Safe to run multiple times (uses IF NOT EXISTS).</p>
          </div>
        </div>
      </div>
    </div>
  )
}
