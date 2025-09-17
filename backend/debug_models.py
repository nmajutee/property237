#!/usr/bin/env python
"""
Debug script to check Django model registry issues
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, '/home/ngs/property237/backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.apps import apps
from django.core.checks import run_checks

print("=== Django Apps Registry Debug ===")
print("\nRegistered Apps:")
for app_config in apps.get_app_configs():
    print(f"  {app_config.label}: {app_config.name}")

print("\n=== Payment App Models ===")
try:
    payment_models = apps.get_app_config('payment').get_models()
    for model in payment_models:
        print(f"  {model.__name__}: {model}")
        if hasattr(model, 'escrow'):
            escrow_field = model._meta.get_field('escrow')
            print(f"    escrow field: {escrow_field}")
            print(f"    escrow target: {escrow_field.related_model}")
except Exception as e:
    print(f"Error getting payment models: {e}")

print("\n=== Chat App Models ===")
try:
    chat_models = apps.get_app_config('chat').get_models()
    for model in chat_models:
        print(f"  {model.__name__}: {model}")
        if hasattr(model, 'escrow'):
            escrow_field = model._meta.get_field('escrow')
            print(f"    escrow field: {escrow_field}")
            print(f"    escrow target: {escrow_field.related_model}")
except Exception as e:
    print(f"Error getting chat models: {e}")

print("\n=== Running System Checks ===")
try:
    errors = run_checks()
    for error in errors:
        print(f"  {error.level}: {error.msg}")
        print(f"    Object: {error.obj}")
        print(f"    ID: {error.id}")
        if hasattr(error, 'hint'):
            print(f"    Hint: {error.hint}")
except Exception as e:
    print(f"Error running checks: {e}")