import Link from 'next/link'
import { ArrowRight, Zap, DollarSign, Database } from 'lucide-react'

const tools = [
  {
    id: 'modelduel-promptlab',
    name: 'ModelDuel + PromptLab',
    description: 'Compare AI model responses side-by-side. Test prompts across GPT-4, Claude, and Gemini.',
    icon: Zap,
    gradient: 'from-purple-500 to-blue-500',
    features: ['Side-by-side comparison', 'Multi-example testing', 'Shareable results', 'Voting system'],
    price: '$8/mo',
    status: 'available' as const,
  },
  {
    id: 'api-cost-tracker',
    name: 'API Cost Tracker',
    description: 'Real-time tracking and forecasting of AI API costs across all major providers.',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500',
    features: ['Real-time tracking', 'Budget alerts', 'Spend forecasting', 'CSV export'],
    price: '$12/mo',
    status: 'coming-soon' as const,
  },
  {
    id: 'context-keeper',
    name: 'ContextKeeper',
    description: 'Browser extension for context window monitoring and conversation preservation.',
    icon: Database,
    gradient: 'from-orange-500 to-pink-500',
    features: ['Token counter overlay', 'Save conversations', 'Share contexts', 'Export as Markdown'],
    price: '$6/mo',
    status: 'coming-soon' as const,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-bold gradient-text">PACKD</h1>
              <span className="text-sm text-slate-400">AI Utilities Marketplace</span>
            </div>
            <nav className="flex gap-4">
              <Link href="#tools" className="text-sm text-slate-400 hover:text-white transition">
                Tools
              </Link>
              <Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition">
                Pricing
              </Link>
              <Link
                href="/auth/login"
                className="text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Professional AI Utilities
            <br />
            <span className="gradient-text">Built for Power Users</span>
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Stop wasting time on manual tasks. Compare models, track costs, and manage context—all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="#tools"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition flex items-center gap-2 font-medium"
            >
              Explore Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools/modelduel-promptlab"
              className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition font-medium"
            >
              Try ModelDuel Free
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Three Essential Tools</h3>
          <p className="text-slate-400">Each tool solves a specific problem. Use one or bundle all three.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <div
                key={tool.id}
                className="relative group rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6 hover:border-white/20 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Status Badge */}
                {tool.status === 'coming-soon' && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs font-medium text-orange-300">
                    Coming Soon
                  </div>
                )}

                {/* Icon with gradient */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold mb-2">{tool.name}</h4>
                <p className="text-slate-400 text-sm mb-4">{tool.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-lg font-bold gradient-text">{tool.price}</span>
                  {tool.status === 'available' ? (
                    <Link
                      href={`/tools/${tool.id}`}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-medium flex items-center gap-1"
                    >
                      Launch
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-500 text-sm font-medium cursor-not-allowed"
                    >
                      Soon
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Simple Pricing</h3>
          <p className="text-slate-400">Pay per tool or save with a bundle.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-8">
            <h4 className="text-2xl font-bold mb-2">Individual Tool</h4>
            <p className="text-slate-400 mb-6">Pick the tool you need</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$6-12</span>
              <span className="text-slate-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Usage limits (Free tier available)
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                30-day history
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Email support
              </li>
            </ul>
          </div>

          {/* Bundle */}
          <div className="rounded-2xl border-2 border-purple-500 bg-gradient-to-br from-purple-950/50 to-blue-950/50 backdrop-blur-sm p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold">
              BEST VALUE
            </div>
            <h4 className="text-2xl font-bold mb-2">All Tools Bundle</h4>
            <p className="text-slate-400 mb-6">Get all three tools</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$20</span>
              <span className="text-slate-400">/month</span>
              <div className="text-sm text-green-400 mt-1">Save $6/month</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                All tools included
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Unlimited history
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Priority support
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Early access to new tools
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition text-center font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-slate-400 text-sm">
          <p>&copy; 2026 PACKD Tools. Built for power users who demand more.</p>
        </div>
      </footer>
    </div>
  )
}
