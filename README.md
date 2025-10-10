# 🏠 Property237# Property237# Property237



**Modern Real Estate Platform for Cameroon**



A full-stack property listing and management platform built with Django REST Framework and Next.js, featuring real-time search, agent management, and integrated payment processing.**Cameroon's Premier Property Platform****Cameroon’s No.1 Property Platform**



[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![Django](https://img.shields.io/badge/Django-5.1.2-green.svg)](https://www.djangoproject.com/)

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)A modern real estate platform connecting property seekers with verified agents and landlords across Cameroon. Built with Django REST Framework and Next.js.Property237 is a robust web application enabling users to find, filter, and contact landlords and realtors for rentals, sales, and guesthouses across Cameroon and the CEMAC region. Realtors and landlords can list properties, complete KYC verification, pay posting fees, and manage ads. The platform features advanced property filtering, secure payments, and agent verification badges.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)



---

------

## 🌟 Features



### For Property Seekers

- 🔍 **Advanced Search & Filters** - Find properties by location, price, type, and amenities## 🚀 Features## Features

- 📍 **Location-Based Discovery** - Browse by region, city, and neighborhood

- 📱 **Mobile-Responsive Design** - Seamless experience across all devices

- 💬 **Direct Messaging** - Chat with property owners and agents

- ⭐ **Saved Favorites** - Bookmark properties for later viewing- **Property Listings** - Browse and search properties with advanced filters- **User Registration & Authentication:** Secure signup, role-based access (user/realtor), email verification.



### For Property Owners & Agents- **Agent Verification** - KYC-verified agents with trust badges- **Property Listings:** Realtors/landlords can list diverse property types with detailed attributes and images.

- 📝 **Easy Listing Management** - Create and edit property listings with rich media

- 🖼️ **Image Optimization** - Automatic image processing and CDN delivery via ImageKit- **Multi-Step Wizard** - Easy 5-step property submission with image uploads- **Advanced Filtering:** Filter by location, price, bedrooms, amenities, and more.

- 📊 **Analytics Dashboard** - Track views, inquiries, and engagement

- 🎯 **Targeted Advertising** - Promote listings to reach more buyers/renters- **Location System** - Complete Cameroon regions, cities, and areas- **KYC Verification:** Realtors complete identity checks and document uploads for badge verification.

- 💳 **Integrated Payments** - Secure payment processing for ads and subscriptions

- **Secure Payments** - Integrated payment processing (Flutterwave, Tranzak)- **Payments:** Ad posting payments integrated via Flutterwave and Tranzak.net.

### For Administrators

- 👥 **User Management** - Manage users, agents, and permissions- **Responsive Design** - Mobile-first, works on all devices- **Admin Dashboard:** Manage ads, KYC, reviews, and agent status.

- 🏢 **Agent Verification** - Verify and approve agent accounts

- 📈 **Platform Analytics** - Monitor platform usage and performance- **REST API** - Full-featured API for integrations- **Responsive API:** Built with Django REST Framework for frontend, mobile, and third-party integrations.

- ⚙️ **System Configuration** - Manage property types, statuses, and locations

- **Dockerized:** Easily deployable with Docker & Docker Compose.

---

---- **Production-Ready:** Secure settings, logging, backup, and deployment scripts.

## 🛠️ Tech Stack



### Backend

- **Framework**: Django 5.1.2 + Django REST Framework 3.15.2## 🛠️ Tech Stack---

- **Database**: PostgreSQL 16

- **Authentication**: JWT (djangorestframework-simplejwt)

- **File Storage**: ImageKit.io (CDN + optimization)

- **SMS**: Africa's Talking (OTP verification)**Backend:**## Tech Stack

- **Caching**: Redis

- **API Documentation**: DRF Spectacular (OpenAPI/Swagger)- Python 3.10+



### Frontend- Django 5.1.2- **Backend:** Python 3.11+, Django 4.x, Django REST Framework

- **Framework**: Next.js 14 (App Router)

- **Language**: TypeScript 5- Django REST Framework- **Database:** PostgreSQL

- **Styling**: Tailwind CSS 3

- **State Management**: React Hooks + Context API- PostgreSQL- **Containerization:** Docker, Docker Compose

- **Forms**: React Hook Form

- **HTTP Client**: Fetch API- JWT Authentication- **Payments:** Flutterwave, Tranzak.net



### Infrastructure- **Testing:** Pytest, Django Test, DRF Test

- **Backend Hosting**: Render.com

- **Frontend Hosting**: Vercel**Frontend:**- **Other:** Celery (async tasks), Gunicorn/Nginx (production), Swagger/OpenAPI (API docs)

- **Database**: Render PostgreSQL

- **CDN**: ImageKit.io- Next.js 15.5.3

- **CI/CD**: GitHub Actions

- React 19---

---

- TypeScript

## 📋 Prerequisites

- Tailwind CSS## Local development

- Python 3.12+

- Node.js 18+ and npm/yarn

- PostgreSQL 14+

- Redis 7+ (optional, for caching)---- Backend (SQLite dev):



---	- cd backend



## 🚀 Quick Start## 📦 Quick Start	- python -m venv .venv && source .venv/bin/activate



### 1. Clone the Repository	- pip install -r requirements.txt



```bash### Prerequisites	- export USE_SQLITE=true

git clone https://github.com/nmajutee/property237.git

cd property237- Python 3.10+	- python manage.py migrate

```

- Node.js 18+	- python manage.py runserver

### 2. Backend Setup

- PostgreSQL (or use SQLite for development)

```bash

cd backend- Frontend:



# Create virtual environment### Backend Setup	- cd frontend

python -m venv venv

source venv/bin/activate  # On Windows: venv\Scripts\activate	- npm ci



# Install dependencies```bash	- npm run dev

pip install -r requirements.txt

cd backend

# Create .env file

cp .env.example .envpython -m venv venv## Production configuration

# Edit .env with your configuration

source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run migrations

python manage.py migratepip install -r requirements.txtCopy `.env.production.example` to your environment (or secret manager) and set values:



# Create superuser

python manage.py createsuperuser

# Development with SQLite- DEBUG=False

# Load sample data (optional)

python manage.py loaddata locations property_typesexport USE_SQLITE=true- SECRET_KEY: long, random, kept secret



# Run development serverpython manage.py migrate- ALLOWED_HOSTS: your domain(s)

python manage.py runserver

```python manage.py runserver- Database: POSTGRES_DB/USER/PASSWORD/HOST/PORT



Backend will be available at `http://localhost:8000````- CORS/CSRF: include your frontend origin(s)



### 3. Frontend Setup- HTTPS: SECURE_SSL_REDIRECT=True, HSTS enabled, secure cookies



```bash### Frontend Setup- If behind a proxy: SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO:https

cd frontend



# Install dependencies

npm install```bashThen:



# Create .env.local filecd frontend

cp .env.example .env.local

# Edit .env.local with your configurationnpm install- Apply migrations: `python manage.py migrate`



# Run development servernpm run dev- Collect static: `python manage.py collectstatic --noinput`

npm run dev

``````- Run under Gunicorn/Uvicorn with a reverse proxy (Nginx/Caddy) serving static and forwarding to Django.



Frontend will be available at `http://localhost:3000`



---The application will be available at:Frontend production:



## 🔧 Configuration- **Frontend:** http://localhost:3000



### Backend Environment Variables- **Backend API:** http://localhost:8000- Set `VITE_API_BASE_URL` to your API URL (e.g., https://yourdomain.com/api)



```bash- **API Docs:** http://localhost:8000/api/swagger/- Build with `npm run build` and serve `frontend/dist` via your web server or CDN.

# Database

DATABASE_URL=postgresql://user:password@localhost:5432/property237



# Django---## Deployment notes

SECRET_KEY=your-secret-key-here

DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

## 🔧 Configuration- Use a process manager (systemd, Supervisor) to run Gunicorn/Uvicorn.

# JWT

JWT_ACCESS_TOKEN_LIFETIME=60  # minutes- Put Nginx/Caddy in front to terminate TLS and serve static assets with proper caching.

JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes

### Environment Variables- Set the security env vars from `.env.production.example`.

# ImageKit (Image Storage & CDN)

IMAGEKIT_PRIVATE_KEY=your_private_key- Enable logging/monitoring, database backups, and periodic security updates.

IMAGEKIT_PUBLIC_KEY=your_public_key

IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_idCreate a `.env` file in the project root:



# SMS (Optional - for OTP)

AFRICASTALKING_USERNAME=your_username```env

AFRICASTALKING_API_KEY=your_api_key# Database

POSTGRES_DB=property237_db

# Email (Optional)POSTGRES_USER=property237_user

EMAIL_HOST=smtp.gmail.comPOSTGRES_PASSWORD=your_secure_password

EMAIL_PORT=587

EMAIL_HOST_USER=your_email@gmail.com# Security

EMAIL_HOST_PASSWORD=your_app_passwordSECRET_KEY=your_secret_key_here

DEBUG=False

# Redis (Optional - for caching)ALLOWED_HOSTS=localhost,127.0.0.1

REDIS_URL=redis://localhost:6379/0

```# Optional: Use SQLite for development

USE_SQLITE=true

### Frontend Environment Variables```



```bash**Important:** Never commit `.env` files to version control. Use `.env.example` as a template.

# API Endpoint

NEXT_PUBLIC_API_URL=http://localhost:8000/api---



# Optional: Analytics, etc.## 🗂️ Project Structure

NEXT_PUBLIC_GA_ID=your_google_analytics_id

``````

property237/

---├── backend/              # Django backend

│   ├── config/          # Project settings

## 📁 Project Structure│   ├── properties/      # Property management

│   ├── users/           # User authentication

```│   ├── agentprofile/    # Agent profiles & KYC

property237/│   ├── locations/       # Location hierarchy

├── backend/                    # Django REST API│   ├── media/           # Media file handling

│   ├── config/                # Django settings & config│   └── manage.py

│   ├── users/                 # User authentication & profiles├── frontend/            # Next.js frontend

│   ├── properties/            # Property listings & management│   ├── src/

│   ├── locations/             # Regions, cities, areas│   │   ├── app/        # Pages and routes

│   ├── media/                 # Image/file uploads│   │   └── components/ # Reusable components

│   ├── agentprofile/          # Agent-specific features│   └── package.json

│   ├── ad/                    # Advertising system└── README.md

│   ├── payment/               # Payment processing```

│   ├── tariffplans/           # Subscription plans

│   └── utils/                 # Shared utilities---

├── frontend/                   # Next.js application

│   ├── src/## 📝 API Documentation

│   │   ├── app/              # Next.js 14 App Router pages

│   │   ├── components/       # React componentsInteractive API documentation available at `/api/swagger/` when running.

│   │   ├── services/         # API services

│   │   ├── hooks/            # Custom React hooks**Key Endpoints:**

│   │   └── utils/            # Utility functions- `POST /api/auth/register/` - User registration

│   └── public/               # Static assets- `POST /api/auth/login/` - User login

├── docs/                       # Documentation- `GET /api/properties/` - List all properties

└── README.md                   # This file- `POST /api/properties/` - Create property (agents only)

```- `GET /api/properties/my-properties/` - Get agent's properties

- `GET /api/locations/regions/` - Get regions

---- `GET /api/locations/cities/` - Get cities by region



## 🌐 API Documentation---



Once the backend is running, API documentation is available at:## 🚀 Production Deployment



- **Swagger UI**: `http://localhost:8000/api/schema/swagger-ui/`1. **Configure environment variables** (see Configuration section)

- **ReDoc**: `http://localhost:8000/api/schema/redoc/`2. **Set up PostgreSQL database**

- **OpenAPI Schema**: `http://localhost:8000/api/schema/`3. **Run migrations:** `python manage.py migrate`

4. **Collect static files:** `python manage.py collectstatic`

---5. **Build frontend:** `npm run build` in frontend directory

6. **Deploy with Docker Compose** or manually with Gunicorn + Nginx

## 🧪 Testing

---

### Backend Tests

## 🤝 Contributing

```bash

cd backendContributions are welcome! Please feel free to submit a Pull Request.



# Run all tests---

python manage.py test

## 📄 License

# Run specific app tests

python manage.py test propertiesThis project is proprietary software. All rights reserved.



# Run with coverage---

coverage run --source='.' manage.py test

coverage report## 📞 Support

```

For support, email: support@property237.cm

### Frontend Tests

```bash
cd frontend

# Run tests (when configured)
npm test

# Run with coverage
npm test -- --coverage
```

---

## 📦 Deployment

### Backend Deployment (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables
4. Set build command: `pip install -r backend/requirements.txt`
5. Set start command: `cd backend && gunicorn config.wsgi:application`

### Frontend Deployment (Vercel)

1. Import project from GitHub
2. Set root directory to `frontend/`
3. Configure environment variables
4. Deploy automatically on git push

See [IMAGEKIT_SETUP_GUIDE.md](./IMAGEKIT_SETUP_GUIDE.md) for image storage configuration.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Nmaju Terence
- **Project**: Property237
- **Location**: Cameroon

---

## 📞 Support

For support, email nmajuterence2002@gmail.com or create an issue in the GitHub repository.

---

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- Next.js team for the excellent React framework
- ImageKit.io for image optimization and CDN
- Africa's Talking for SMS services
- All contributors and users of Property237

---

## 🗺️ Roadmap

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current development status and upcoming features.

---

**Built with ❤️ in Cameroon 🇨🇲**
