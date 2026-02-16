# PACKD Tools - AI Utilities Marketplace

Professional AI utilities built for power users. Compare models, track costs, and manage context—all in one place.

## 🚀 Live Demo

Visit: [Your Vercel URL will be here]

## 🛠️ Tools

### 1. ModelDuel + PromptLab ✅ (LIVE)
Compare AI model responses side-by-side (GPT-4, Claude Sonnet, Gemini Pro)
- Single prompt comparison
- Multi-example testing
- Voting system
- Shareable results

### 2. API Cost Tracker (Coming Soon)
Real-time tracking and forecasting of AI API costs

### 3. ContextKeeper (Coming Soon)
Browser extension for context window monitoring

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account
- API keys for OpenAI, Anthropic, Google AI

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd packd-tools
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GOOGLE_AI_API_KEY` - Google AI API key

3. **Run database migration**

Go to your Supabase SQL Editor and run:
```sql
-- Copy the contents of supabase/migrations/001_modelduel_schema.sql
```

4. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

## 🚢 Deployment to Vercel

### Option 1: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import this Git repository
3. Add environment variables from `.env.local`
4. Deploy!

### Option 2: Via CLI

```bash
# Login to Vercel (first time only)
npx vercel login

# Deploy
npx vercel

# Deploy to production
npx vercel --prod
```

## 📊 Database Schema

Tables:
- `modelduel_comparisons` - Stores AI model comparison results
- `modelduel_votes` - Stores user votes on comparisons

All tables have Row Level Security (RLS) enabled.

## 🔐 Security

- All API keys stored server-side only
- Supabase RLS policies prevent unauthorized access
- Rate limiting ready (needs Upstash Redis)
- Input validation with Zod
- XSS protection

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **AI SDKs**: OpenAI, Anthropic, Google AI
- **Type Safety**: TypeScript
- **Deployment**: Vercel

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ for AI power users
