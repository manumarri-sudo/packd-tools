# 🚀 Deployment Guide - PACKD Tools

## Quick Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/packd-tools.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `packd-tools` repository
4. Click "Import"

### Step 3: Add Environment Variables

In Vercel, go to **Settings > Environment Variables** and add all the values from your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
OPENAI_API_KEY=<your-openai-api-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
GOOGLE_AI_API_KEY=<your-google-ai-api-key>
```

Copy the actual values from your local `.env.local` file.

### Step 4: Deploy!

Click **"Deploy"** and wait ~2 minutes.

### Step 5: Run Database Migration

Once deployed, visit:
```
https://YOUR-APP-NAME.vercel.app/admin/migrate
```

Click **"Run Database Migration"** button.

✅ Done! Your app is live!

---

## Alternative: Manual Deployment

If automatic deployment fails:

### 1. Build Locally

```bash
npm run build
```

### 2. Test Production Build

```bash
npm start
```

### 3. Deploy via Vercel CLI

```bash
npx vercel --prod
```

---

## Troubleshooting

### Database Migration Fails?

Run the SQL manually in Supabase:

1. Go to https://supabase.com/dashboard/project/dcrfsckfltofpkdyoqps/editor
2. Click **SQL Editor**
3. Copy contents of `supabase/migrations/001_modelduel_schema.sql`
4. Paste and click **Run**

### Build Errors?

Check that all environment variables are set correctly in Vercel.

### API Errors?

- Verify API keys are valid
- Check Supabase connection
- Look at Vercel logs: https://vercel.com/dashboard > Your Project > Logs

---

## Custom Domain (Optional)

1. Go to Vercel Project > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Next Steps

After deployment:
- Test ModelDuel at `/tools/modelduel-promptlab`
- Share the app with users
- Monitor usage in Vercel Analytics
- Build the next tool (API Cost Tracker or ContextKeeper)

🎉 Congratulations! Your app is live!
