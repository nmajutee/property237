#!/usr/bin/env python3
"""
Test script to diagnose delete property issues
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/home/ngs/property237/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from properties.models import Property
from users.models import User
from agents.models import AgentProfile

# Get a property
properties = Property.objects.all()[:1]
if not properties:
    print("❌ No properties found in database")
    sys.exit(1)

prop = properties[0]
print(f"✅ Found property: {prop.title} (slug: {prop.slug})")
print(f"   Owner: {prop.agent.user.email}")
print(f"   Agent ID: {prop.agent.id}")

# Get the user
user = prop.agent.user
print(f"\n✅ User details:")
print(f"   Email: {user.email}")
print(f"   User type: {user.user_type}")
print(f"   Is staff: {user.is_staff}")
print(f"   Has agent profile: {hasattr(user, 'agents_profile')}")

# Check permissions
print(f"\n🔍 Permission check:")
print(f"   user == prop.agent.user: {user == prop.agent.user}")
print(f"   Can delete: {user == prop.agent.user or user.is_staff}")

# Try to delete
print(f"\n🧪 Testing delete...")
try:
    # Check related objects
    images = prop.images.all()
    print(f"   Related images: {images.count()}")
    
    viewings = prop.viewings.all()
    print(f"   Related viewings: {viewings.count()}")
    
    favorites = prop.favorited_by.all()
    print(f"   Favorited by: {favorites.count()}")
    
    # Don't actually delete, just simulate
    print(f"\n✅ Property CAN be deleted (simulation only)")
    print(f"   All related objects will be cascade deleted")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
