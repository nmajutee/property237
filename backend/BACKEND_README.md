# Credit System & Authentication Backend

## Overview
Professional, secure backend implementation for the Property237 platform with:
- **Credit-based monetization system**
- **Simplified authentication with OTP verification**
- **JWT token-based security**
- **Comprehensive audit trails**

## Architecture

### 1. Authentication System (`authentication` app)

#### Features:
- **Simple signup**: Phone/email/username with OTP verification
- **Flexible login**: Support for username, email, or phone number
- **OTP verification**: SMS-based phone verification
- **Password reset**: Secure token-based password reset
- **Security monitoring**: Login attempt tracking and lockout protection
- **JWT tokens**: Access and refresh token management

#### Models:
- `OTPVerification`: Phone/email verification codes
- `LoginAttempt`: Security audit trail
- `PasswordResetToken`: Secure password reset tokens

#### API Endpoints:
```
POST /api/auth/signup/              # Create account
POST /api/auth/login/               # Login
POST /api/auth/logout/              # Logout
POST /api/auth/otp/request/         # Request OTP
POST /api/auth/otp/verify/          # Verify OTP
POST /api/auth/password/reset/request/  # Request password reset
POST /api/auth/password/reset/confirm/  # Confirm password reset
GET  /api/auth/profile/             # Get profile
PATCH /api/auth/profile/update/    # Update profile
POST /api/auth/token/refresh/       # Refresh access token
```

### 2. Credit System (`credits` app)

#### Features:
- **Credit balance management**: Track user credits
- **Credit packages**: Multiple pricing tiers with bonuses
- **Transaction history**: Complete audit trail
- **Credit pricing**: Configurable pricing for actions
- **Property views**: Track viewed properties to prevent double-charging
- **Mobile money integration**: MTN MoMo support (ready)

#### Models:
- `CreditBalance`: User credit balance (one per user)
- `CreditPackage`: Available credit packages for purchase
- `CreditTransaction`: Immutable transaction history
- `CreditPricing`: Pricing rules for different actions
- `PropertyView`: Track property views by users

#### Credit Pricing (Default):
- **View property details**: 1 credit
- **List property**: 5 credits
- **Featured listing (per day)**: 2 credits
- **Reveal contact info**: 0.5 credits

#### API Endpoints:
```
GET  /api/credits/balance/          # Get credit balance
GET  /api/credits/statistics/       # Get credit statistics
GET  /api/credits/packages/         # List credit packages
GET  /api/credits/pricing/          # List pricing rules
POST /api/credits/purchase/         # Purchase credits
POST /api/credits/use/              # Use credits for action
GET  /api/credits/check-access/<property_id>/  # Check property access
GET  /api/credits/property-views/   # View history
GET  /api/credits/transactions/     # Transaction history
POST /api/credits/payment/momo/initiate/  # Initiate MoMo payment
POST /api/credits/payment/momo/verify/    # Verify MoMo payment
```

## Security Features

### 1. Authentication Security
- **Password validation**: Django's built-in validators
- **Rate limiting**: Login attempt tracking and lockout
- **JWT tokens**: Short-lived access tokens (15 min), refresh tokens (7 days)
- **Token blacklisting**: Invalidate tokens on logout
- **OTP security**: 6-digit codes, 10-minute expiry, 3 attempts max
- **IP tracking**: Monitor login attempts by IP
- **User agent tracking**: Detect suspicious activity

### 2. Credit System Security
- **Atomic transactions**: Database-level consistency
- **Immutable audit trail**: All transactions are permanent records
- **Balance validation**: Prevent negative balances
- **Double-spend protection**: Track property views
- **IP and user agent logging**: Security audit trail
- **Transaction metadata**: Store contextual information

### 3. API Security
- **CORS configuration**: Whitelist allowed origins
- **HTTPS enforcement**: Production SSL settings
- **CSRF protection**: Django CSRF tokens
- **Security headers**: HSTS, Content-Type sniffing prevention
- **Input validation**: Serializer validation
- **Permission classes**: Authentication required by default

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Create `.env` file in project root:
```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=postgresql
POSTGRES_DB=property237_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_ACCESS_TOKEN_MINUTES=15
JWT_REFRESH_TOKEN_DAYS=7
JWT_SIGNING_KEY=your-jwt-signing-key

# SMS Provider (TODO: Configure)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=

# Email (TODO: Configure)
# EMAIL_HOST=
# EMAIL_PORT=
# EMAIL_HOST_USER=
# EMAIL_HOST_PASSWORD=
```

### 3. Run Migrations
```bash
python manage.py makemigrations authentication
python manage.py makemigrations credits
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
```

### 5. Create Default Credit Pricing
```bash
python manage.py shell
```
```python
from credits.models import CreditPricing
from decimal import Decimal

CreditPricing.objects.get_or_create(
    action='view_property',
    defaults={'credits_required': Decimal('1.00'), 'description': 'View full property details'}
)
CreditPricing.objects.get_or_create(
    action='list_property',
    defaults={'credits_required': Decimal('5.00'), 'description': 'List a property'}
)
```

### 6. Create Credit Packages
```bash
python manage.py shell
```
```python
from credits.models import CreditPackage

packages = [
    {'name': 'Starter', 'credits': 10, 'bonus_credits': 0, 'price': 1000, 'display_order': 1},
    {'name': 'Basic', 'credits': 25, 'bonus_credits': 5, 'price': 2000, 'display_order': 2},
    {'name': 'Popular', 'credits': 50, 'bonus_credits': 15, 'price': 3500, 'is_popular': True, 'display_order': 3},
    {'name': 'Premium', 'credits': 100, 'bonus_credits': 30, 'price': 6000, 'display_order': 4},
    {'name': 'Business', 'credits': 250, 'bonus_credits': 100, 'price': 12500, 'display_order': 5},
]

for pkg in packages:
    CreditPackage.objects.get_or_create(name=pkg['name'], defaults=pkg)
```

### 7. Start Development Server
```bash
python manage.py runserver
```

## Usage Examples

### 1. User Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone_number": "+237670000000",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "user_type": "tenant",
    "terms_accepted": true
  }'
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:8000/api/auth/otp/verify/ \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "+237670000000",
    "otp_code": "123456",
    "purpose": "signup"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "johndoe",
    "password": "SecurePass123!",
    "remember_me": false
  }'
```

### 4. Get Credit Balance
```bash
curl -X GET http://localhost:8000/api/credits/balance/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Purchase Credits
```bash
curl -X POST http://localhost:8000/api/credits/purchase/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": "PACKAGE_UUID",
    "payment_method": "momo",
    "phone_number": "+237670000000"
  }'
```

### 6. Use Credits to View Property
```bash
curl -X POST http://localhost:8000/api/credits/use/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "view_property",
    "reference_id": "123"
  }'
```

## TODO: Production Deployment

### 1. SMS Integration
- [ ] Integrate with Twilio or Africa's Talking for SMS
- [ ] Configure SMS templates
- [ ] Set up SMS delivery monitoring

### 2. Email Integration
- [ ] Configure SMTP or SendGrid
- [ ] Create email templates
- [ ] Set up email delivery monitoring

### 3. Payment Gateway
- [ ] Integrate MTN Mobile Money API
- [ ] Integrate Orange Money API
- [ ] Add credit card processing (Stripe/Flutterwave)
- [ ] Implement webhook handlers for payment confirmation

### 4. Production Settings
- [ ] Set DEBUG=False
- [ ] Configure secure SECRET_KEY
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure Redis for caching and sessions
- [ ] Set up PostgreSQL connection pooling
- [ ] Configure Gunicorn/uWSGI
- [ ] Set up Nginx reverse proxy
- [ ] Configure logging to external service (e.g., Sentry)

### 5. Security Hardening
- [ ] Enable HSTS
- [ ] Configure CSP headers
- [ ] Set up rate limiting (django-ratelimit or API gateway)
- [ ] Implement IP whitelisting for admin
- [ ] Regular security audits
- [ ] Set up automated backups

### 6. Monitoring & Analytics
- [ ] Set up application monitoring (New Relic, DataDog)
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Create admin dashboards
- [ ] Set up alerts for critical events

## Admin Interface

Access Django admin at: http://localhost:8000/admin/

### Credit Management:
- View and manage credit balances
- Create/edit credit packages
- View transaction history
- Monitor property views
- Adjust pricing rules

### Authentication:
- View OTP verifications
- Monitor login attempts
- Manage password reset tokens

### User Management:
- View/edit users
- Suspend accounts
- Verify users manually
- Grant admin privileges

## Testing

### Run Tests
```bash
python manage.py test authentication
python manage.py test credits
```

### Test Coverage
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## License
Proprietary - Property237 Platform

## Support
For support, contact: support@property237.com
