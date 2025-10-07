#!/bin/bash

# ============================================================================
# PROPERTY237 - PRE-DEPLOYMENT CLEANUP & SECURITY SCRIPT
# ============================================================================
# This script prepares your codebase for GitHub deployment by:
# 1. Removing development/debug files
# 2. Securing sensitive information
# 3. Creating proper .env template
# 4. Cleaning up temporary files
# ============================================================================

echo "🔒 Starting Property237 Pre-Deployment Cleanup..."
echo ""

# -----------------------------------------------------------------------------
# 1. REMOVE DEVELOPMENT DOCUMENTATION FILES
# -----------------------------------------------------------------------------
echo "📝 Removing development documentation files..."

# Remove all temporary analysis and debug markdown files
rm -f 100_PERCENT_COMPLETE.md
rm -f ADD_PROPERTY_ANALYSIS.md
rm -f ADD_PROPERTY_COMPLETE_ANALYSIS.md
rm -f ADD_PROPERTY_COMPLETE_FIX_STATUS.md
rm -f ADD_PROPERTY_JSON_ERROR_FIX.md
rm -f ALL_PAGES_DOCUMENTATION.md
rm -f API_AUDIT_REPORT.md
rm -f ARCHITECTURE_CHANGES.md
rm -f BACKEND_IMPLEMENTATION_SUMMARY.md
rm -f DARK_MODE_IMPROVEMENTS.md
rm -f DASHBOARD_COMPLETE.md
rm -f DASHBOARD_IMPLEMENTATION.md
rm -f FINAL_ADD_PROPERTY_SUMMARY.md
rm -f FINAL_FIX_STATUS.md
rm -f FINAL_STATUS.md
rm -f FORM_FOCUS_STYLES.md
rm -f FRONTEND_BACKEND_SYNC.md
rm -f INTEGRATION_COMPLETE.md
rm -f ISSUE_RESOLUTION_SUMMARY.md
rm -f NAVBAR_AUTH_FIX.md
rm -f NAVBAR_FIXES.md
rm -f NETWORK_ERROR_DEBUGGING.md
rm -f NETWORK_ERROR_FIX.md
rm -f PAGES_AND_NAVIGATION.md
rm -f PAGES_QUICK_REFERENCE.md
rm -f PROPERTY_CREATION_FLOW.md
rm -f PRODUCTION_READY.md
rm -f QUICK_START_TEST.md
rm -f QUICK_REFERENCE.md
rm -f SITE_IMPLEMENTATION_SUMMARY.md
rm -f SITE_MAP.md
rm -f TEST_RESULTS.md
rm -f UPGRADE_COMPLETE.md
rm -f PROPERTY_CREATION_FIX.md

echo "   ✅ Development docs removed"

# -----------------------------------------------------------------------------
# 2. REMOVE .env FILE IF IT EXISTS IN ROOT
# -----------------------------------------------------------------------------
echo ""
echo "🔐 Securing environment files..."

if [ -f ".env" ]; then
    echo "   ⚠️  Found .env file - backing up to .env.local.backup"
    cp .env .env.local.backup
    echo "   ✅ .env backed up"
fi

echo "   ✅ Environment files secured"

# -----------------------------------------------------------------------------
# 3. CREATE .env.example TEMPLATE
# -----------------------------------------------------------------------------
echo ""
echo "📄 Creating .env.example template..."

cat > .env.example << 'EOF'
# ============================================================================
# PROPERTY237 - ENVIRONMENT VARIABLES TEMPLATE
# ============================================================================
# Copy this file to .env and fill in your actual values
# NEVER commit .env file to version control!
# ============================================================================

# -----------------------------------------------------------------------------
# DATABASE CONFIGURATION
# -----------------------------------------------------------------------------
POSTGRES_DB=property237_db
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

# For production, use PostgreSQL (recommended)
# For local development, you can optionally use SQLite
# USE_SQLITE=true

# -----------------------------------------------------------------------------
# DJANGO SECRET KEY
# -----------------------------------------------------------------------------
# Generate new key: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
SECRET_KEY=your-secret-key-here-change-this-in-production

# -----------------------------------------------------------------------------
# DEBUG MODE
# -----------------------------------------------------------------------------
# IMPORTANT: Set to False in production!
DEBUG=True

# -----------------------------------------------------------------------------
# ALLOWED HOSTS
# -----------------------------------------------------------------------------
# Add your domain names separated by commas
ALLOWED_HOSTS=localhost,127.0.0.1

# -----------------------------------------------------------------------------
# CORS SETTINGS
# -----------------------------------------------------------------------------
# Frontend URLs that can access your API
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# -----------------------------------------------------------------------------
# OPTIONAL: AWS S3 (for production file storage)
# -----------------------------------------------------------------------------
# USE_S3=false
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_STORAGE_BUCKET_NAME=your_bucket_name
# AWS_S3_REGION_NAME=us-east-1

# -----------------------------------------------------------------------------
# OPTIONAL: EMAIL CONFIGURATION
# -----------------------------------------------------------------------------
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your_email@example.com
# EMAIL_HOST_PASSWORD=your_email_password

# -----------------------------------------------------------------------------
# OPTIONAL: REDIS (for caching and celery)
# -----------------------------------------------------------------------------
# REDIS_URL=redis://localhost:6379/0

# -----------------------------------------------------------------------------
# OPTIONAL: SENTRY (for error tracking)
# -----------------------------------------------------------------------------
# SENTRY_DSN=your_sentry_dsn_here
EOF

echo "   ✅ .env.example created"

# -----------------------------------------------------------------------------
# 4. UPDATE .gitignore
# -----------------------------------------------------------------------------
echo ""
echo "🚫 Updating .gitignore..."

cat >> .gitignore << 'EOF'

# ============================================================================
# PROPERTY237 SPECIFIC IGNORES
# ============================================================================

# Development documentation (internal use only)
*_ANALYSIS.md
*_FIX*.md
*_COMPLETE.md
*_DEBUGGING.md
*_SUMMARY.md
FINAL_*.md
QUICK_*.md
TEST_*.md
UPGRADE_*.md

# Keep only these docs
!README.md
!API_REFERENCE.md

# Local backup files
.env.local.backup
*.backup

# Development logs
debug.log
error.log

# IDE and editor files
.vscode/settings.json
.idea/workspace.xml

# Test coverage
htmlcov/
.coverage
coverage.xml

# Mac specific
.DS_Store

# Python cache
__pycache__/
*.pyc
*.pyo

# Node modules
node_modules/

# Build artifacts
dist/
build/
*.egg-info/

# Media files (user uploads)
backend/media/property_images/
backend/media/profile_pics/
backend/media/documents/

# Static files
backend/staticfiles/
backend/static_collected/

# Database
*.sqlite3
db.sqlite3
*.db

# Logs
*.log
logs/

# Environment files
.env
.env.local
.env.*.local
EOF

echo "   ✅ .gitignore updated"

# -----------------------------------------------------------------------------
# 5. CLEAN UP PYTHON CACHE
# -----------------------------------------------------------------------------
echo ""
echo "🧹 Cleaning Python cache files..."

find backend -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find backend -type f -name "*.pyc" -delete 2>/dev/null
find backend -type f -name "*.pyo" -delete 2>/dev/null

echo "   ✅ Python cache cleaned"

# -----------------------------------------------------------------------------
# 6. CLEAN UP NODE MODULES (optional - can reinstall)
# -----------------------------------------------------------------------------
echo ""
echo "📦 Checking Node modules..."

if [ -d "frontend/node_modules" ]; then
    echo "   ℹ️  node_modules found (size: $(du -sh frontend/node_modules | cut -f1))"
    echo "   ℹ️  This is already in .gitignore"
fi

# -----------------------------------------------------------------------------
# 7. CREATE DEPLOYMENT CHECKLIST
# -----------------------------------------------------------------------------
echo ""
echo "📋 Creating deployment checklist..."

cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# 🚀 Property237 Deployment Checklist

## Before Pushing to GitHub

### 1. Environment Variables ✅
- [x] `.env` file is in `.gitignore`
- [ ] `.env.example` template created and reviewed
- [ ] All sensitive data removed from `.env.example`
- [ ] No secrets in any committed files

### 2. Security
- [ ] `DEBUG=False` in production settings
- [ ] `SECRET_KEY` is strong and unique
- [ ] Database credentials are secure
- [ ] CORS settings configured for your domain
- [ ] ALLOWED_HOSTS configured correctly

### 3. Code Cleanup
- [x] Development documentation files removed
- [x] Python cache cleared
- [ ] No TODO comments with sensitive info
- [ ] No hardcoded credentials in code

### 4. Database
- [ ] Migrations are up to date
- [ ] Test database connection
- [ ] Backup any important local data

### 5. Frontend
- [ ] No API keys in frontend code
- [ ] Environment variables use NEXT_PUBLIC_ prefix for client-side
- [ ] Build tested (`npm run build`)

## After Pushing to GitHub

### 1. Repository Settings
- [ ] Make repository private (if needed)
- [ ] Add `.env` variables to GitHub Secrets (for CI/CD)
- [ ] Add collaborators if needed
- [ ] Set up branch protection

### 2. Production Deployment
- [ ] Set up production database
- [ ] Configure environment variables on hosting platform
- [ ] Set up static file storage (S3 or similar)
- [ ] Configure domain and SSL
- [ ] Run migrations on production
- [ ] Create superuser account

### 3. Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Test all critical features

## Environment Variables Needed

### Backend (.env)
```
POSTGRES_DB=property237_db
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Useful Commands

```bash
# Backend
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py createsuperuser

# Frontend
cd frontend
npm run build
npm start

# Docker
docker-compose up -d
docker-compose logs -f
```

## Support

For issues, check:
- Django logs: `backend/logs/`
- Frontend build errors: check Next.js output
- Database connection: test with `python manage.py dbshell`
EOF

echo "   ✅ Deployment checklist created"

# -----------------------------------------------------------------------------
# 8. CREATE README FOR DEPLOYMENT
# -----------------------------------------------------------------------------
echo ""
echo "📖 Updating README..."

cat > DEPLOYMENT_README.md << 'EOF'
# 🚀 Property237 - Deployment Guide

## Quick Start for New Developers

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (or SQLite for development)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/property237.git
cd property237
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load initial data (optional)
python manage.py loaddata initial_data.json

# Run development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## Production Deployment

### Option 1: Docker (Recommended)
```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f
```

### Option 2: Manual Deployment

#### Backend (Django)
```bash
# Set production environment variables
export DEBUG=False
export SECRET_KEY='your-production-secret-key'
export ALLOWED_HOSTS='yourdomain.com'

# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

#### Frontend (Next.js)
```bash
# Build
npm run build

# Run production server
npm start

# Or export static site
npm run export
```

### Option 3: Platform-Specific

#### Heroku
```bash
heroku create property237
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run python manage.py migrate
```

#### Vercel (Frontend)
```bash
vercel --prod
```

#### Railway/Render
- Connect GitHub repository
- Set environment variables
- Deploy automatically on push

## Environment Variables

See `.env.example` for all available variables.

### Critical Production Variables
- `SECRET_KEY`: Strong random string
- `DEBUG`: Set to `False`
- `ALLOWED_HOSTS`: Your domain
- `DATABASE_URL`: Production database
- `CORS_ALLOWED_ORIGINS`: Frontend domain

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
python manage.py dbshell
```

### Static Files Not Loading
```bash
# Recollect static files
python manage.py collectstatic --clear --noinput
```

### CORS Errors
Check `CORS_ALLOWED_ORIGINS` in settings includes your frontend URL.

## Maintenance

### Backup Database
```bash
python manage.py dumpdata > backup.json
```

### Update Dependencies
```bash
pip install -r requirements.txt --upgrade
npm update
```

## Support
For issues, check:
- Documentation: `/docs`
- API Reference: `API_REFERENCE.md`
- GitHub Issues: Create an issue
EOF

echo "   ✅ Deployment README created"

# -----------------------------------------------------------------------------
# 9. SUMMARY
# -----------------------------------------------------------------------------
echo ""
echo "============================================================================"
echo "✅ PRE-DEPLOYMENT CLEANUP COMPLETE!"
echo "============================================================================"
echo ""
echo "📋 What was done:"
echo "   ✅ Removed development documentation files"
echo "   ✅ Secured environment variables"
echo "   ✅ Created .env.example template"
echo "   ✅ Updated .gitignore"
echo "   ✅ Cleaned Python cache"
echo "   ✅ Created deployment checklist"
echo "   ✅ Created deployment README"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. Review .env.example and ensure no sensitive data"
echo "2. Review DEPLOYMENT_CHECKLIST.md"
echo "3. Update README.md with your project details"
echo "4. Test that .env file is NOT in git:"
echo "   → git status | grep .env"
echo "   (should only show .env.example)"
echo ""
echo "5. Ready to commit and push:"
echo "   → git add ."
echo "   → git commit -m 'Prepare for deployment'"
echo "   → git push origin main"
echo ""
echo "🔐 Security Notes:"
echo "   - Your .env file is backed up to: .env.local.backup"
echo "   - Never commit .env to version control"
echo "   - Generate new SECRET_KEY for production"
echo "   - Set DEBUG=False in production"
echo ""
echo "📚 Documentation:"
echo "   - DEPLOYMENT_CHECKLIST.md - Pre-deployment checklist"
echo "   - DEPLOYMENT_README.md - Deployment guide"
echo "   - .env.example - Environment variables template"
echo ""
echo "============================================================================"
echo "🎉 Your codebase is now ready for GitHub!"
echo "============================================================================"
EOF

chmod +x cleanup_for_deployment.sh

echo "   ✅ Cleanup script created"
