export type AIModel = 'gpt4' | 'claude' | 'gemini'

export type ComparisonMode = 'single' | 'multi'

export interface ComparisonExample {
  input: string
  variables?: Record<string, string>
}

export interface ModelResponse {
  content: string
  responseTime: number
  error?: string
}

export interface ComparisonResults {
  gpt4: ModelResponse
  claude: ModelResponse
  gemini: ModelResponse
}

export interface Comparison {
  id: string
  userId: string
  mode: ComparisonMode
  prompt: string
  examples?: ComparisonExample[]
  results: ComparisonResults
  winner?: AIModel
  isPublic: boolean
  shareToken: string
  createdAt: string
  updatedAt: string
}

export interface Vote {
  id: string
  comparisonId: string
  userId?: string
  voterFingerprint: string
  winner: AIModel
  createdAt: string
}

export interface VoteCounts {
  gpt4: number
  claude: number
  gemini: number
}
