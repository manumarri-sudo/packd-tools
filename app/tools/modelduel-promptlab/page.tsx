'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Share2, Trophy } from 'lucide-react'
import { toast } from 'sonner'

type AIModel = 'gpt4' | 'claude' | 'gemini'

interface ModelResponse {
  content: string
  responseTime: number
  error?: string
}

interface ComparisonResults {
  gpt4: ModelResponse
  claude: ModelResponse
  gemini: ModelResponse
}

const modelInfo = {
  gpt4: {
    name: 'GPT-4',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-400',
  },
  claude: {
    name: 'Claude Sonnet',
    color: 'from-purple-500 to-blue-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    textColor: 'text-purple-400',
  },
  gemini: {
    name: 'Gemini Pro',
    color: 'from-orange-500 to-pink-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-400',
  },
}

export default function ModelDuelPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ComparisonResults | null>(null)
  const [shareToken, setShareToken] = useState<string>('')
  const [votes, setVotes] = useState({ gpt4: 0, claude: 0, gemini: 0 })
  const [userVote, setUserVote] = useState<AIModel | null>(null)

  const handleCompare = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    setResults(null)
    setShareToken('')

    try {
      const response = await fetch('/api/tools/modelduel-promptlab/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'single',
          prompt,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || 'Comparison failed')
        return
      }

      setResults(data.data.results)
      setShareToken(data.data.shareToken)
      toast.success('Comparison complete!')
    } catch (error) {
      toast.error('Failed to compare models')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (model: AIModel) => {
    if (!shareToken) return

    try {
      const response = await fetch('/api/tools/modelduel-promptlab/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparisonId: shareToken,
          winner: model,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setUserVote(model)
        setVotes(data.data.votes)
        toast.success(`Voted for ${modelInfo[model].name}!`)
      }
    } catch (error) {
      toast.error('Failed to record vote')
    }
  }

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${shareToken}`
    navigator.clipboard.writeText(url)
    toast.success('Share link copied!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-slate-950/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Tools</span>
            </Link>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-bold gradient-text">ModelDuel</h1>
              <span className="text-xs text-slate-500">+ PromptLab</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Prompt Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Enter your prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Explain quantum computing to a 10-year-old..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-slate-900 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-500">{prompt.length} / 5000 characters</span>
            <button
              onClick={handleCompare}
              disabled={loading || !prompt.trim()}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Comparing...
                </>
              ) : (
                'Compare Models'
              )}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {(loading || results) && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {(['gpt4', 'claude', 'gemini'] as AIModel[]).map((model) => {
                const info = modelInfo[model]
                const result = results?.[model]

                return (
                  <div
                    key={model}
                    className={`rounded-xl border ${info.borderColor} ${info.bgColor} backdrop-blur-sm p-6`}
                  >
                    {/* Model Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${info.color} text-xs font-bold`}>
                        {info.name}
                      </div>
                      {result && !result.error && (
                        <span className="text-xs text-slate-500">{result.responseTime}ms</span>
                      )}
                    </div>

                    {/* Response Content */}
                    <div className="min-h-[200px]">
                      {loading && !result && (
                        <div className="flex items-center justify-center h-[200px]">
                          <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                        </div>
                      )}

                      {result?.error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          Error: {result.error}
                        </div>
                      )}

                      {result && !result.error && (
                        <div className="text-sm text-slate-300 whitespace-pre-wrap">{result.content}</div>
                      )}
                    </div>

                    {/* Vote Button */}
                    {result && !result.error && (
                      <button
                        onClick={() => handleVote(model)}
                        disabled={userVote !== null}
                        className={`mt-4 w-full px-4 py-2 rounded-lg border ${
                          userVote === model
                            ? `${info.bgColor} ${info.borderColor} ${info.textColor}`
                            : 'border-white/10 hover:bg-white/5'
                        } transition flex items-center justify-center gap-2 text-sm font-medium disabled:cursor-not-allowed`}
                      >
                        {userVote === model && <Trophy className="w-4 h-4" />}
                        {userVote === model ? 'Your Vote' : 'Vote for this'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Share Button */}
            {shareToken && (
              <div className="flex justify-center">
                <button
                  onClick={copyShareLink}
                  className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Share Link
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !results && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-2">Ready to Compare</h3>
            <p className="text-slate-400">
              Enter a prompt above to see how GPT-4, Claude, and Gemini respond side-by-side
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
