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
