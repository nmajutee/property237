# Property237# Property237



**Cameroon's Premier Property Platform****Cameroon’s No.1 Property Platform**



A modern real estate platform connecting property seekers with verified agents and landlords across Cameroon. Built with Django REST Framework and Next.js.Property237 is a robust web application enabling users to find, filter, and contact landlords and realtors for rentals, sales, and guesthouses across Cameroon and the CEMAC region. Realtors and landlords can list properties, complete KYC verification, pay posting fees, and manage ads. The platform features advanced property filtering, secure payments, and agent verification badges.



------



## 🚀 Features## Features



- **Property Listings** - Browse and search properties with advanced filters- **User Registration & Authentication:** Secure signup, role-based access (user/realtor), email verification.

- **Agent Verification** - KYC-verified agents with trust badges- **Property Listings:** Realtors/landlords can list diverse property types with detailed attributes and images.

- **Multi-Step Wizard** - Easy 5-step property submission with image uploads- **Advanced Filtering:** Filter by location, price, bedrooms, amenities, and more.

- **Location System** - Complete Cameroon regions, cities, and areas- **KYC Verification:** Realtors complete identity checks and document uploads for badge verification.

- **Secure Payments** - Integrated payment processing (Flutterwave, Tranzak)- **Payments:** Ad posting payments integrated via Flutterwave and Tranzak.net.

- **Responsive Design** - Mobile-first, works on all devices- **Admin Dashboard:** Manage ads, KYC, reviews, and agent status.

- **REST API** - Full-featured API for integrations- **Responsive API:** Built with Django REST Framework for frontend, mobile, and third-party integrations.

- **Dockerized:** Easily deployable with Docker & Docker Compose.

---- **Production-Ready:** Secure settings, logging, backup, and deployment scripts.



## 🛠️ Tech Stack---



**Backend:**## Tech Stack

- Python 3.10+

- Django 5.1.2- **Backend:** Python 3.11+, Django 4.x, Django REST Framework

- Django REST Framework- **Database:** PostgreSQL

- PostgreSQL- **Containerization:** Docker, Docker Compose

- JWT Authentication- **Payments:** Flutterwave, Tranzak.net

- **Testing:** Pytest, Django Test, DRF Test

**Frontend:**- **Other:** Celery (async tasks), Gunicorn/Nginx (production), Swagger/OpenAPI (API docs)

- Next.js 15.5.3

- React 19---

- TypeScript

- Tailwind CSS## Local development



---- Backend (SQLite dev):

	- cd backend

## 📦 Quick Start	- python -m venv .venv && source .venv/bin/activate

	- pip install -r requirements.txt

### Prerequisites	- export USE_SQLITE=true

- Python 3.10+	- python manage.py migrate

- Node.js 18+	- python manage.py runserver

- PostgreSQL (or use SQLite for development)

- Frontend:

### Backend Setup	- cd frontend

	- npm ci

```bash	- npm run dev

cd backend

python -m venv venv## Production configuration

source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txtCopy `.env.production.example` to your environment (or secret manager) and set values:



# Development with SQLite- DEBUG=False

export USE_SQLITE=true- SECRET_KEY: long, random, kept secret

python manage.py migrate- ALLOWED_HOSTS: your domain(s)

python manage.py runserver- Database: POSTGRES_DB/USER/PASSWORD/HOST/PORT

```- CORS/CSRF: include your frontend origin(s)

- HTTPS: SECURE_SSL_REDIRECT=True, HSTS enabled, secure cookies

### Frontend Setup- If behind a proxy: SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO:https



```bashThen:

cd frontend

npm install- Apply migrations: `python manage.py migrate`

npm run dev- Collect static: `python manage.py collectstatic --noinput`

```- Run under Gunicorn/Uvicorn with a reverse proxy (Nginx/Caddy) serving static and forwarding to Django.



The application will be available at:Frontend production:

- **Frontend:** http://localhost:3000

- **Backend API:** http://localhost:8000- Set `VITE_API_BASE_URL` to your API URL (e.g., https://yourdomain.com/api)

- **API Docs:** http://localhost:8000/api/swagger/- Build with `npm run build` and serve `frontend/dist` via your web server or CDN.



---## Deployment notes



## 🔧 Configuration- Use a process manager (systemd, Supervisor) to run Gunicorn/Uvicorn.

- Put Nginx/Caddy in front to terminate TLS and serve static assets with proper caching.

### Environment Variables- Set the security env vars from `.env.production.example`.

- Enable logging/monitoring, database backups, and periodic security updates.

Create a `.env` file in the project root:


```env
# Database
POSTGRES_DB=property237_db
POSTGRES_USER=property237_user
POSTGRES_PASSWORD=your_secure_password

# Security
SECRET_KEY=your_secret_key_here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# Optional: Use SQLite for development
USE_SQLITE=true
```

**Important:** Never commit `.env` files to version control. Use `.env.example` as a template.

---

## 🗂️ Project Structure

```
property237/
├── backend/              # Django backend
│   ├── config/          # Project settings
│   ├── properties/      # Property management
│   ├── users/           # User authentication
│   ├── agentprofile/    # Agent profiles & KYC
│   ├── locations/       # Location hierarchy
│   ├── media/           # Media file handling
│   └── manage.py
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # Pages and routes
│   │   └── components/ # Reusable components
│   └── package.json
└── README.md
```

---

## 📝 API Documentation

Interactive API documentation available at `/api/swagger/` when running.

**Key Endpoints:**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/properties/` - List all properties
- `POST /api/properties/` - Create property (agents only)
- `GET /api/properties/my-properties/` - Get agent's properties
- `GET /api/locations/regions/` - Get regions
- `GET /api/locations/cities/` - Get cities by region

---

## 🚀 Production Deployment

1. **Configure environment variables** (see Configuration section)
2. **Set up PostgreSQL database**
3. **Run migrations:** `python manage.py migrate`
4. **Collect static files:** `python manage.py collectstatic`
5. **Build frontend:** `npm run build` in frontend directory
6. **Deploy with Docker Compose** or manually with Gunicorn + Nginx

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For support, email: support@property237.cm
