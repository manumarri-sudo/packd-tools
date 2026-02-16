export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Sign In</h1>
          <p className="text-slate-400">Authentication coming soon</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-8 text-center">
          <p className="text-slate-400 mb-4">
            For now, you can use all tools without authentication.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition font-medium"
          >
            Back to Tools
          </a>
        </div>
      </div>
    </div>
  )
}
