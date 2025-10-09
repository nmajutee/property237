#!/bin/bash
# Migration script to create missing chat tables

echo "🔧 Running migrations for chat app..."

# Run makemigrations for chat app
python manage.py makemigrations chat

# Run migrate for chat app
python manage.py migrate chat

# Run all pending migrations
python manage.py migrate

echo "✅ Migrations completed!"
