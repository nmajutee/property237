#!/bin/bash

# Property237 - Complete System Check and Fix Script
# This script will:
# 1. Check Cloudinary configuration
# 2. Fix property is_active status
# 3. Verify the fixes

echo "🚀 Property237 - System Check and Fix"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Cloudinary
echo "📋 Step 1: Checking Cloudinary Configuration..."
echo "----------------------------------------------"

if [ -z "$CLOUDINARY_CLOUD_NAME" ]; then
    echo -e "${RED}❌ CLOUDINARY_CLOUD_NAME not set${NC}"
    CLOUDINARY_OK=false
else
    echo -e "${GREEN}✅ CLOUDINARY_CLOUD_NAME: $CLOUDINARY_CLOUD_NAME${NC}"
    CLOUDINARY_OK=true
fi

if [ -z "$CLOUDINARY_API_KEY" ]; then
    echo -e "${RED}❌ CLOUDINARY_API_KEY not set${NC}"
    CLOUDINARY_OK=false
else
    # Mask the key
    MASKED_KEY="${CLOUDINARY_API_KEY:0:4}...${CLOUDINARY_API_KEY: -4}"
    echo -e "${GREEN}✅ CLOUDINARY_API_KEY: $MASKED_KEY${NC}"
fi

if [ -z "$CLOUDINARY_API_SECRET" ]; then
    echo -e "${RED}❌ CLOUDINARY_API_SECRET not set${NC}"
    CLOUDINARY_OK=false
else
    echo -e "${GREEN}✅ CLOUDINARY_API_SECRET: Set (hidden)${NC}"
fi

echo ""

# Step 2: Run Django management commands
echo "📋 Step 2: Running Django Checks..."
echo "----------------------------------------------"

# Check Cloudinary via Django
echo ""
echo "Running check_cloudinary command..."
python manage.py check_cloudinary

echo ""
echo "----------------------------------------------"
echo ""

# Step 3: Fix property status
echo "📋 Step 3: Fixing Property Status..."
echo "----------------------------------------------"
python manage.py fix_property_status

echo ""
echo "----------------------------------------------"
echo ""

# Step 4: Verify properties
echo "📋 Step 4: Verifying Properties..."
echo "----------------------------------------------"
echo "Fetching property statistics..."

# Create a simple Python script to check properties
python << EOF
from properties.models import Property
from users.models import User

print("\n📊 Current Statistics:")
print("=" * 50)

# Property stats
total_properties = Property.objects.count()
active_properties = Property.objects.filter(is_active=True).count()
inactive_properties = Property.objects.filter(is_active=False).count()

print(f"Total Properties: {total_properties}")
print(f"  └─ Active: {active_properties} (Available)")
print(f"  └─ Inactive: {inactive_properties} (Unavailable)")

if total_properties > 0:
    print("\nProperty Details:")
    for prop in Property.objects.all():
        status = "✅ Available" if prop.is_active else "❌ Unavailable"
        image_count = prop.images.count() if hasattr(prop, 'images') else 0
        print(f"  • {prop.title}")
        print(f"    └─ Status: {status}")
        print(f"    └─ Images: {image_count}")
        print(f"    └─ Slug: {prop.slug}")

# User stats
total_users = User.objects.count()
agents = User.objects.filter(user_type='agent').count()
tenants = User.objects.filter(user_type='tenant').count()

print(f"\n👥 Users: {total_users} total")
print(f"  └─ Agents: {agents}")
print(f"  └─ Tenants: {tenants}")

print("\n" + "=" * 50)
EOF

echo ""
echo "======================================"
echo "✅ System check complete!"
echo ""

# Final recommendations
if [ "$CLOUDINARY_OK" = false ]; then
    echo -e "${YELLOW}⚠️  ACTION REQUIRED:${NC}"
    echo "1. Go to Render Dashboard: https://dashboard.render.com"
    echo "2. Click on your backend service"
    echo "3. Go to Environment tab"
    echo "4. Add missing Cloudinary environment variables"
    echo "5. Get credentials from: https://cloudinary.com/console"
    echo ""
fi

echo "Next Steps:"
echo "1. Check output above for any errors"
echo "2. If Cloudinary is configured, test by uploading a new property"
echo "3. Verify images appear in Cloudinary dashboard"
echo "4. Check frontend for green 'Available' badges"
echo ""
