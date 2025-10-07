#!/usr/bin/env bash

# Start Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120
