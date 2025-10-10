# 🚀 Deployment Guide - Render + Vercel

## Overview

This guide walks you through deploying your Property237 application using:
- **Render** - Backend (Django REST API) with PostgreSQL
- **Vercel** - Frontend (Next.js)
- **Local File Storage** - Images stored on Render's persistent disk

## Prerequisites

- GitHub account with your code repository
- Render account (free tier available)
- Vercel account (free tier available)

---

## Part 1: Backend Deployment on Render

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `property237-db`
   - **Database**: `property237_db`
   - **User**: `property237_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. **Save the Internal Database URL** (you'll need this)

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `property237-backend`
   - **Environment**: `Python 3`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan**: Free or Starter ($7/month recommended)

### Step 3: Add Persistent Disk (CRITICAL!)

Without this, uploaded images will be lost on each deployment.

1. In your web service, go to **"Disks"** tab
2. Click **"Add Disk"**
   - **Name**: `media-storage`
   - **Mount Path**: `/data`
   - **Size**: Start with **10 GB** (expandable to 100GB+)
3. Click **"Create"**

### Step 4: Configure Environment Variables

Go to **"Environment"** tab and add:

```bash
# Required Variables
DATABASE_URL=<Your Internal Database URL from Step 1>
SECRET_KEY=<Generate a secure random string - use https://djecrety.ir/>
DEBUG=False
ALLOWED_HOSTS=property237.onrender.com,property237-backend.onrender.com

# Optional but Recommended
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO:https

# JWT Settings (optional - defaults are fine)
JWT_ACCESS_TOKEN_MINUTES=15
JWT_REFRESH_TOKEN_DAYS=7

# If using SMS OTP (AfricasTalking)
AFRICASTALKING_USERNAME=<your_username>
AFRICASTALKING_API_KEY=<your_api_key>
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Your backend will be available at: `https://property237-backend.onrender.com`

### Step 6: Create Superuser (Admin Account)

1. In Render dashboard, go to your web service
2. Click **"Shell"** tab
3. Run:
```bash
python manage.py createsuperuser
```
4. Follow prompts to create admin account
5. Test admin at: `https://property237-backend.onrender.com/admin/`

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Configure Environment Variables

In Vercel project settings → Environment Variables:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://property237-backend.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://property237-backend.onrender.com/api
```

### Step 3: Update API Proxy

Your `vercel.json` already includes:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://property237.onrender.com/api/:path*"
    }
  ]
}
```

Update the destination URL to match your Render backend URL if different.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Your frontend will be available at: `https://property237.vercel.app`

---

## Part 3: Connect Everything

### Update CORS Settings

Make sure your backend `settings.py` includes your Vercel domain in CORS:

```python
CORS_ALLOWED_ORIGINS = [
    'https://property237.vercel.app',
    'http://localhost:3000',  # Local development
]
```

### Update Allowed Hosts

In Render environment variables, update `ALLOWED_HOSTS`:
```
ALLOWED_HOSTS=property237-backend.onrender.com,property237.onrender.com,property237.vercel.app
```

### Update Frontend Image Domains

Your `next.config.js` should include:
```javascript
images: {
  domains: [
    'property237-backend.onrender.com',
    'property237.onrender.com',
  ],
}
```

---

## Part 4: Custom Domains (Optional)

### For Backend (Render)

1. In Render web service → **"Settings"** → **"Custom Domain"**
2. Add: `api.property237.com`
3. Add CNAME record in your DNS:
   - Name: `api`
   - Value: `<your-service>.onrender.com`

### For Frontend (Vercel)

1. In Vercel project → **"Settings"** → **"Domains"**
2. Add: `property237.com` and `www.property237.com`
3. Follow Vercel's DNS instructions

---

## Testing Checklist

- [ ] Backend health check: `https://property237-backend.onrender.com/health/`
- [ ] Admin panel accessible: `https://property237-backend.onrender.com/admin/`
- [ ] API endpoint works: `https://property237-backend.onrender.com/api/properties/`
- [ ] Frontend loads: `https://property237.vercel.app`
- [ ] Can register new user
- [ ] Can login
- [ ] Can upload property image
- [ ] Image displays correctly after upload
- [ ] Image persists after redeployment

---

## Cost Breakdown

### Free Tier (Good for MVP/Testing)
- **Render Web Service**: Free (with limitations - sleeps after inactivity)
- **Render PostgreSQL**: Free (limited storage)
- **Render Disk**: First 1GB free
- **Vercel**: Free (hobby projects)
- **Total**: $0/month

### Production Ready
- **Render Web Service**: Starter ($7/month) - No sleep
- **Render PostgreSQL**: Starter ($7/month) - 256MB RAM
- **Render Disk**: 10GB ($2.50/month)
- **Vercel**: Free (or Pro $20/month for team features)
- **Total**: ~$16.50-36.50/month

---

## Troubleshooting

### Images not persisting
- Check that persistent disk is mounted at `/data`
- Verify `MEDIA_ROOT` is set to `/data/media` in production

### CORS errors
- Update `CORS_ALLOWED_ORIGINS` in backend settings
- Update `ALLOWED_HOSTS` environment variable

### Build fails on Render
- Check build logs
- Verify `requirements.txt` is up to date
- Ensure migrations are running: `python manage.py migrate`

### Frontend can't reach backend
- Check `vercel.json` rewrite rules
- Verify environment variables are set
- Check network tab in browser dev tools

---

## Scaling Tips

### When you outgrow free tier:
1. Upgrade Render plan to Starter ($7/month) - no sleep
2. Add Redis cache for sessions/caching
3. Increase disk size as needed
4. Consider Render Pro for auto-scaling

### When you have high traffic:
1. Add CDN (Cloudflare) in front of backend
2. Use Vercel's edge network (already included)
3. Consider database read replicas
4. Implement image CDN (Cloudflare Images, etc.)

---

## Migration to AWS S3 (Future)

If you later want to use AWS S3 for images:

1. Install: `pip install django-storages boto3`
2. Update settings.py with S3 configuration
3. Set environment variables for AWS credentials
4. Run: `python manage.py migrate_to_s3` (custom command)
5. No frontend changes needed!

---

## Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/stable/howto/deployment/

---

## Quick Reference

### Render Commands (in Shell)
```bash
# Create superuser
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Check disk usage
df -h /data

# View logs
# (Use Render dashboard → Logs tab)
```

### Vercel Commands (local)
```bash
# Deploy from CLI
vercel --prod

# View logs
vercel logs

# Environment variables
vercel env ls
```
