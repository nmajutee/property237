#!/bin/bash
# Quick Debug Script - Run in Render Shell

echo "=== Property237 Debug ==="
echo ""

# 1. Check if property exists
echo "1. Total properties in database:"
python manage.py shell -c "from properties.models import Property; print(f'Total: {Property.objects.count()}')"

# 2. Check property details
echo ""
echo "2. Property details:"
python manage.py shell -c "
from properties.models import Property
for p in Property.objects.all():
    print(f'  ID: {p.id}')
    print(f'  Title: {p.title}')
    print(f'  Status: {p.status.name}')
    print(f'  Agent ID: {p.agent.id if p.agent else None}')
    print(f'  Is Active: {p.is_active}')
    print()
"

# 3. Check your agent profile
echo "3. Your agent profile:"
python manage.py shell -c "
from users.models import CustomUser
from agents.models import AgentProfile
user = CustomUser.objects.get(email='nmajut@gmail.com')
try:
    agent = user.agents_profile
    print(f'  Agent ID: {agent.id}')
    print(f'  Properties: {agent.properties.count()}')
except:
    print('  No agent profile!')
"

# 4. Check property status
echo ""
echo "4. Property statuses:"
python manage.py shell -c "
from properties.models import PropertyStatus
for s in PropertyStatus.objects.all():
    print(f'  {s.name}: {s.description}')
"

echo ""
echo "=== End Debug ==="
