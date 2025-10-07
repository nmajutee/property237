#!/bin/bash

# Backend Setup Script for Property237
# This script sets up the professional credit-based backend

set -e

echo "========================================="
echo "Property237 Backend Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python 3 found${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
pip install --upgrade pip

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check if .env exists
if [ ! -f "../.env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > ../.env << 'EOF'
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production-$(openssl rand -base64 32)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,testserver

# Database (SQLite for development)
DB_ENGINE=sqlite
USE_SQLITE=True

# JWT Settings
JWT_ACCESS_TOKEN_MINUTES=15
JWT_REFRESH_TOKEN_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173

# SMS Provider (TODO: Configure in production)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=

# Email (Console backend for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Run migrations
echo -e "${YELLOW}Creating migrations...${NC}"
python3 manage.py makemigrations authentication
python3 manage.py makemigrations credits

echo -e "${YELLOW}Running migrations...${NC}"
python3 manage.py migrate

echo -e "${GREEN}✓ Migrations completed${NC}"

# Create superuser prompt
echo ""
echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}Create Superuser${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo -e "Create an admin account to access Django admin?"
read -p "Create superuser now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python3 manage.py createsuperuser
fi

# Create default credit packages
echo ""
echo -e "${YELLOW}Creating default credit packages...${NC}"
python3 manage.py shell << 'EOF'
from credits.models import CreditPackage, CreditPricing
from decimal import Decimal

# Create credit packages
packages = [
    {'name': 'Starter', 'credits': 10, 'bonus_credits': 0, 'price': Decimal('1000.00'), 'currency': 'XAF', 'display_order': 1},
    {'name': 'Basic', 'credits': 25, 'bonus_credits': 5, 'price': Decimal('2000.00'), 'currency': 'XAF', 'display_order': 2},
    {'name': 'Popular', 'credits': 50, 'bonus_credits': 15, 'price': Decimal('3500.00'), 'currency': 'XAF', 'is_popular': True, 'display_order': 3},
    {'name': 'Premium', 'credits': 100, 'bonus_credits': 30, 'price': Decimal('6000.00'), 'currency': 'XAF', 'display_order': 4},
    {'name': 'Business', 'credits': 250, 'bonus_credits': 100, 'price': Decimal('12500.00'), 'currency': 'XAF', 'display_order': 5},
]

for pkg_data in packages:
    pkg, created = CreditPackage.objects.get_or_create(
        name=pkg_data['name'],
        defaults=pkg_data
    )
    if created:
        print(f"✓ Created package: {pkg.name}")
    else:
        print(f"- Package already exists: {pkg.name}")

# Create pricing rules
pricing_rules = [
    {
        'action': CreditPricing.ACTION_VIEW_PROPERTY,
        'credits_required': Decimal('1.00'),
        'description': '1 credit to view full property details including contact information'
    },
    {
        'action': CreditPricing.ACTION_LIST_PROPERTY,
        'credits_required': Decimal('5.00'),
        'description': '5 credits to list a property (unlimited duration)'
    },
    {
        'action': CreditPricing.ACTION_FEATURED_LISTING,
        'credits_required': Decimal('2.00'),
        'description': '2 credits per day for featured listing (higher visibility)'
    },
    {
        'action': CreditPricing.ACTION_CONTACT_REVEAL,
        'credits_required': Decimal('0.50'),
        'description': '0.5 credits to reveal contact information only'
    },
]

for rule_data in pricing_rules:
    rule, created = CreditPricing.objects.get_or_create(
        action=rule_data['action'],
        defaults={
            'credits_required': rule_data['credits_required'],
            'description': rule_data['description'],
            'is_active': True
        }
    )
    if created:
        print(f"✓ Created pricing rule: {rule.get_action_display()}")
    else:
        print(f"- Pricing rule already exists: {rule.get_action_display()}")

print("\n✓ Credit system configured successfully!")
EOF

echo -e "${GREEN}✓ Credit packages and pricing created${NC}"

# Summary
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Start development server: python3 manage.py runserver"
echo "3. Access admin panel: http://localhost:8000/admin/"
echo "4. View API docs: http://localhost:8000/api/"
echo ""
echo "API Endpoints:"
echo "  Authentication: http://localhost:8000/api/auth/"
echo "  Credits: http://localhost:8000/api/credits/"
echo ""
echo "Read BACKEND_README.md for complete documentation"
echo ""
