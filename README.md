# 🏠 Property237

**Cameroon's Premier Property Platform**

A modern real estate platform connecting property seekers with verified agents and landlords across Cameroon. Built with Django REST Framework and Next.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-5.1.2-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## 🌟 Features

### For Property Seekers
- 🔍 **Advanced Search & Filters** - Find properties by location, price, type, and amenities
- 📍 **Location-Based Discovery** - Browse by region, city, and neighborhood  
- 📱 **Mobile-Responsive Design** - Seamless experience across all devices
- 💬 **Direct Messaging** - Chat with property owners and agents
- ⭐ **Saved Favorites** - Bookmark properties for later viewing

### For Property Owners & Agents
- 📝 **Easy Listing Management** - Create and edit property listings with rich media
- 🖼️ **Image Upload** - Upload multiple property images with automatic optimization
- 📊 **Analytics Dashboard** - Track views, inquiries, and engagement
- 🎯 **Targeted Advertising** - Promote listings to reach more buyers/renters
- ✅ **Agent Verification** - KYC-verified agents with trust badges
- 💳 **Integrated Payments** - Secure payment processing for ads and subscriptions

### For Administrators
- 👥 **User Management** - Manage users, agents, and permissions
- 🏢 **Agent Verification** - Verify and approve agent accounts
- 📈 **Platform Analytics** - Monitor platform usage and performance
- ⚙️ **System Configuration** - Manage property types, statuses, and locations

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.1.2 + Django REST Framework 3.15.2
- **Database**: PostgreSQL 16
- **Authentication**: JWT (djangorestframework-simplejwt)
- **File Storage**: Local file system with persistent disk
- **SMS**: Africa's Talking (OTP verification)
- **Caching**: Redis
- **API Documentation**: DRF Spectacular (OpenAPI/Swagger)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Hooks + Context API
- **Forms**: React Hook Form
- **HTTP Client**: Fetch API

### Infrastructure & Deployment
- **Backend Hosting**: Render.com
- **Frontend Hosting**: Vercel
- **Database**: Render PostgreSQL
- **File Storage**: Render Persistent Disk
- **CI/CD**: GitHub Actions

---

## 📋 Prerequisites

For local development:
- Python 3.12+
- Node.js 18+ and npm
- PostgreSQL 14+ (or use SQLite for quick testing)
- Git

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/nmajutee/property237.git
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

# Create .env file (optional for SQLite development)
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api" >> .env.local

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## 🌐 Deployment

We use **Render** for backend and **Vercel** for frontend deployment.

### Quick Deployment Checklist

**Backend (Render):**
1. Create PostgreSQL database
2. Create Web Service
3. Add Persistent Disk (mount path: `/data`, size: 10GB+)
4. Set environment variables
5. Deploy

**Frontend (Vercel):**
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Set environment variables
4. Deploy

### Full Deployment Guide

See [**DEPLOYMENT_GUIDE_RENDER_VERCEL.md**](./DEPLOYMENT_GUIDE_RENDER_VERCEL.md) for detailed step-by-step instructions.

### Cost Estimates

**Free Tier (Development/Testing):**
- Backend: Free (with sleep)
- Database: Free (limited)
- Frontend: Free
- Total: **$0/month**

**Production (Recommended):**
- Backend: $7/month (Starter)
- Database: $7/month (Starter)
- Disk: $2.50/month (10GB)
- Frontend: Free (Vercel)
- Total: **~$16.50/month**

---

## 📁 Project Structure

```
property237/
├── backend/                 # Django REST API
│   ├── config/             # Project settings & URLs
│   ├── users/              # User management
│   ├── authentication/     # JWT & OTP authentication
│   ├── properties/         # Property listings
│   ├── agents/             # Agent management
│   ├── tenants/            # Tenant applications
│   ├── leases/             # Lease management
│   ├── maintenance/        # Maintenance requests
│   ├── payment/            # Payment processing
│   ├── locations/          # Location data (Cameroon)
│   ├── credits/            # Credit system
│   ├── notifications/      # Notification system
│   ├── chat/               # Messaging system
│   ├── analytics/          # Analytics & reporting
│   ├── media/              # Media file handling
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & helpers
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   └── next.config.js     # Next.js configuration
│
├── docker-compose.yml     # Local development setup
├── DEPLOYMENT_GUIDE_RENDER_VERCEL.md  # Deployment instructions
├── MEDIA_STORAGE_SETUP.md             # Media storage guide
└── README.md              # This file
```

---

## 🔧 Environment Variables

### Backend (.env)

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database (automatically set by Render)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Security (Production)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000

# JWT
JWT_ACCESS_TOKEN_MINUTES=15
JWT_REFRESH_TOKEN_DAYS=7

# SMS OTP (Optional - Africa's Talking)
AFRICASTALKING_USERNAME=your_username
AFRICASTALKING_API_KEY=your_api_key

# CORS (Update with your frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact & Support

- **Project Owner**: [@nmajutee](https://github.com/nmajutee)
- **Issues**: [GitHub Issues](https://github.com/nmajutee/property237/issues)
- **Documentation**: See `docs/` folder for detailed documentation

---

## 🙏 Acknowledgments

- Django REST Framework team
- Next.js team
- Render.com for affordable hosting
- Vercel for excellent frontend hosting
- All contributors and supporters

---

## 🗺️ Roadmap

- [ ] Mobile apps (React Native)
- [ ] Virtual property tours (360° images)
- [ ] AI-powered property recommendations
- [ ] Multi-language support (English/French)
- [ ] Payment gateway expansion
- [ ] Property valuation tools
- [ ] Mortgage calculator
- [ ] Tenant screening system
- [ ] Document management (leases, contracts)
- [ ] Reporting & analytics dashboard

---

**Made with ❤️ in Cameroon**
