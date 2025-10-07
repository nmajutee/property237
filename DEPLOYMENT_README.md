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
