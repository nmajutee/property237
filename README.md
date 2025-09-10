# Property237

**Cameroon’s No.1 Property Platform**

Property237 is a robust web application enabling users to find, filter, and contact landlords and realtors for rentals, sales, and guesthouses across Cameroon and the CEMAC region. Realtors and landlords can list properties, complete KYC verification, pay posting fees, and manage ads. The platform features advanced property filtering, secure payments, and agent verification badges.

---

## Features

- **User Registration & Authentication:** Secure signup, role-based access (user/realtor), email verification.
- **Property Listings:** Realtors/landlords can list diverse property types with detailed attributes and images.
- **Advanced Filtering:** Filter by location, price, bedrooms, amenities, and more.
- **KYC Verification:** Realtors complete identity checks and document uploads for badge verification.
- **Payments:** Ad posting payments integrated via Flutterwave and Tranzak.net.
- **Admin Dashboard:** Manage ads, KYC, reviews, and agent status.
- **Responsive API:** Built with Django REST Framework for frontend, mobile, and third-party integrations.
- **Dockerized:** Easily deployable with Docker & Docker Compose.
- **Production-Ready:** Secure settings, logging, backup, and deployment scripts.

---

## Tech Stack

- **Backend:** Python 3.11+, Django 4.x, Django REST Framework
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose
- **Payments:** Flutterwave, Tranzak.net
- **Testing:** Pytest, Django Test, DRF Test
- **Other:** Celery (async tasks), Gunicorn/Nginx (production), Swagger/OpenAPI (API docs)

---

## Local development

- Backend (SQLite dev):
	- cd backend
	- python -m venv .venv && source .venv/bin/activate
	- pip install -r requirements.txt
	- export USE_SQLITE=true
	- python manage.py migrate
	- python manage.py runserver

- Frontend:
	- cd frontend
	- npm ci
	- npm run dev

## Production configuration

Copy `.env.production.example` to your environment (or secret manager) and set values:

- DEBUG=False
- SECRET_KEY: long, random, kept secret
- ALLOWED_HOSTS: your domain(s)
- Database: POSTGRES_DB/USER/PASSWORD/HOST/PORT
- CORS/CSRF: include your frontend origin(s)
- HTTPS: SECURE_SSL_REDIRECT=True, HSTS enabled, secure cookies
- If behind a proxy: SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO:https

Then:

- Apply migrations: `python manage.py migrate`
- Collect static: `python manage.py collectstatic --noinput`
- Run under Gunicorn/Uvicorn with a reverse proxy (Nginx/Caddy) serving static and forwarding to Django.

Frontend production:

- Set `VITE_API_BASE_URL` to your API URL (e.g., https://yourdomain.com/api)
- Build with `npm run build` and serve `frontend/dist` via your web server or CDN.

## Deployment notes

- Use a process manager (systemd, Supervisor) to run Gunicorn/Uvicorn.
- Put Nginx/Caddy in front to terminate TLS and serve static assets with proper caching.
- Set the security env vars from `.env.production.example`.
- Enable logging/monitoring, database backups, and periodic security updates.

