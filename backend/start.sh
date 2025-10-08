#!/usr/bin/env bash
set -e  # Exit on error

# Run migrations
echo "==== Running migrations ===="
python manage.py migrate --noinput

# Collect static files
echo "==== Collecting static files ===="
python manage.py collectstatic --noinput

# Seed property types and statuses (idempotent - won't duplicate)
echo "==== Seeding property types and statuses ===="
python manage.py populate_property_data || echo "Warning: Failed to populate property data"

# Seed Cameroon locations (idempotent - won't duplicate)
echo "==== Seeding Cameroon locations ===="
python manage.py populate_cameroon_locations || echo "Warning: Failed to populate locations"

# Start Gunicorn
echo "==== Starting Gunicorn ===="
exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120
