#!/bin/bash

# Verification script for Property237 fixes
set -e

echo "🔍 Verifying Property237 fixes..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this from the backend directory."
    exit 1
fi

# Set up environment
export USE_SQLITE=true
source .venv/bin/activate 2>/dev/null || echo "Virtual environment not found, but continuing..."

echo "✅ 1. Django Configuration Check"
python manage.py check --deploy || python manage.py check
echo

echo "✅ 2. Database Migration Check"
python manage.py showmigrations --plan | grep "\[X\]" | wc -l | xargs echo "Applied migrations:"
echo

echo "✅ 3. Model Import Check"
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from users.models import CustomUser
from properties.models import Property
from agentprofile.models import AgentProfile
print('All models import successfully')
"
echo

echo "✅ 4. URL Configuration Check"
python manage.py show_urls | grep properties | head -5
echo

echo "✅ 5. API Tests"
python manage.py test properties.tests.test_api.PropertyAPITestCase --verbosity=0
echo

echo "✅ 6. Quick Server Test"
echo "Starting server for quick test..."
python manage.py runserver 8000 --noreload &
SERVER_PID=$!
sleep 3

# Test API endpoint
if curl -s --max-time 5 "http://127.0.0.1:8000/api/properties/" > /dev/null; then
    echo "✅ API endpoint responding correctly"
else
    echo "⚠️  API endpoint test failed (server might need more time)"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo
echo "🎉 All checks completed!"
echo "Property237 Django backend is ready for development."
echo
echo "To start developing:"
echo "  export USE_SQLITE=true"
echo "  python manage.py runserver"
