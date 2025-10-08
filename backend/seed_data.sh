#!/bin/bash
# Script to seed initial data for Property237

echo "Starting data seeding..."

# Populate property types and statuses
echo "Populating property types and statuses..."
python manage.py populate_property_data

# Populate Cameroon locations (regions, cities, areas)
echo "Populating Cameroon locations..."
python manage.py populate_cameroon_locations

echo "Data seeding complete!"
