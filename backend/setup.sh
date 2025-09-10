#!/bin/bash

# Setup script for Property237 Django backend
set -e

echo "🏗️  Setting up Property237 Django Backend..."

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this from the backend directory."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv .venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Set up environment for SQLite (for easy development)
export USE_SQLITE=true

# Run migrations
echo "🔄 Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo "👤 Would you like to create a superuser? (y/n)"
read -r create_superuser
if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

# Run tests
echo "🧪 Running tests..."
python manage.py test properties --keepdb

echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  source .venv/bin/activate"
echo "  export USE_SQLITE=true"
echo "  python manage.py runserver"
echo ""
echo "The API will be available at: http://127.0.0.1:8000/api/"
echo "Admin panel: http://127.0.0.1:8000/admin/"
