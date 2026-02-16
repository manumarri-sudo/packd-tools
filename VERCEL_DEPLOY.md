# 🚀 Quick Vercel Deployment

## Step 1: Import Project

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select: **`manumarri-sudo/packd-tools`**
4. Click **"Import"**

## Step 2: Configure Project

**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `./` (leave as is)
**Build Command:** `npm run build` (auto-filled)
**Output Directory:** `.next` (auto-filled)

Click **"Deploy"** but it will FAIL because environment variables are missing. That's okay!

## Step 3: Add Environment Variables

After the failed deployment, go to:
**Project Settings > Environment Variables**

Add these (copy from your `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
ANTHROPIC_API_KEY
GOOGLE_AI_API_KEY
```

**Important:** For each variable:
- Set environment: **Production**, **Preview**, AND **Development**
- This ensures it works in all environments

## Step 4: Redeploy

Click **"Deployments"** tab
Click **"Redeploy"** on the latest deployment
Wait ~2 minutes

## Step 5: Run Migration

Once deployed, your URL will be something like:
```
https://packd-tools-xxxxx.vercel.app
```

Visit:
```
https://packd-tools-xxxxx.vercel.app/admin/migrate
```

Click **"Run Database Migration"**

## Step 6: Test ModelDuel!

Visit:
```
https://packd-tools-xxxxx.vercel.app/tools/modelduel-promptlab
```

Enter a prompt and watch the magic happen! ✨

---

## Troubleshooting

**Build fails?**
- Check all environment variables are set
- Make sure you added them to all 3 environments

**Migration fails?**
- Run the SQL manually in Supabase dashboard
- Go to: https://supabase.com/dashboard/project/dcrfsckfltofpkdyoqps/editor
- Copy SQL from `supabase/migrations/001_modelduel_schema.sql`

**Models not responding?**
- Check API keys are valid
- Check Vercel function logs
- Verify environment variables are set

---

## Custom Domain (Optional)

1. Go to **Project Settings > Domains**
2. Add your domain (e.g., `packd.tools`)
3. Follow DNS instructions
4. SSL certificate auto-generated!

---

That's it! Your app is live! 🎉
