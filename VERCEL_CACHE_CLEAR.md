# Vercel Cache Clear Instructions

## Option 1: Via Vercel Dashboard (RECOMMENDED)

1. Go to https://vercel.com/dashboard
2. Select your **property237** project
3. Go to **Settings** → **General**
4. Scroll to **Build & Development Settings**
5. Add these environment variables:
   - `NEXT_TELEMETRY_DISABLED=1`
   - `DISABLE_ESLINT_PLUGIN=true` (optional, speeds up build)
6. Click **Deployments** tab
7. Find the latest deployment
8. Click **⋯** (three dots) → **Redeploy**
9. ✅ Check **"Use existing Build Cache"** to **UNCHECK IT**
10. Click **Redeploy**

## Option 2: Via Vercel CLI (if you have it installed)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy without cache
vercel --force
```

## Option 3: Git Push with Cache Buster (EASIEST - We'll do this)

The changes I just made will force a clean build:
- `package.json`: Added postinstall script to clear .next
- `vercel.json`: Changed to use `npm ci` for fresh installs
- `.vercelignore`: Ignore cache directories

Just push to GitHub and Vercel will rebuild from scratch!

## What Changed:

1. **package.json**: 
   - Build script now clears .next before building
   - Postinstall script clears .next after npm install

2. **vercel.json**: 
   - Changed installCommand to `npm ci --legacy-peer-deps` (clean install)
   - Added empty `crons` array to trigger config change

3. **.vercelignore**: 
   - Forces Vercel to ignore cache directories

## After Push:

Vercel will:
1. ✅ Delete .next directory
2. ✅ Fresh npm ci install (no cache)
3. ✅ Clean Next.js build
4. ✅ Find fonts at correct path: `./fonts/craftwork-grotesk/`

Ready to push!
