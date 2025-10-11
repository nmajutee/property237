# Debug Properties Issue

## Run these commands in Render Shell

### 1. Check if property exists
```python
from properties.models import Property
from agents.models import AgentProfile
from users.models import CustomUser

# Check total properties
print(f"Total properties: {Property.objects.count()}")

# Check all properties
for prop in Property.objects.all():
    print(f"\nProperty ID: {prop.id}")
    print(f"  Title: {prop.title}")
    print(f"  Agent ID: {prop.agent.id if prop.agent else None}")
    print(f"  Agent User: {prop.agent.user.email if prop.agent else None}")
    print(f"  Is Active: {prop.is_active}")
    print(f"  Created: {prop.created_at}")
```

### 2. Check agent profiles
```python
from agents.models import AgentProfile

print(f"\nTotal agent profiles: {AgentProfile.objects.count()}")

for agent in AgentProfile.objects.all():
    print(f"\nAgent Profile ID: {agent.id}")
    print(f"  User: {agent.user.email}")
    print(f"  User ID: {agent.user.id}")
    print(f"  Properties count: {agent.properties.count()}")
    if agent.properties.exists():
        for prop in agent.properties.all():
            print(f"    - {prop.title}")
```

### 3. Check your user
```python
from users.models import CustomUser

# Replace with your email
user = CustomUser.objects.get(email='nmajut@gmail.com')
print(f"\nUser: {user.email}")
print(f"User ID: {user.id}")
print(f"User Type: {user.user_type}")

# Check if user has agent profile
try:
    agent = user.agents_profile
    print(f"Agent Profile ID: {agent.id}")
    print(f"Agent Properties: {agent.properties.count()}")
except:
    print("No agent profile found!")
```

### 4. Fix: Assign property to your agent profile
```python
from properties.models import Property
from users.models import CustomUser
from agents.models import AgentProfile

# Get your user
user = CustomUser.objects.get(email='nmajut@gmail.com')

# Get or create agent profile
agent_profile, created = AgentProfile.objects.get_or_create(
    user=user,
    defaults={
        'agency_name': f'{user.get_full_name()} Realty',
        'is_verified': True,
        'is_active': True,
        'bio': 'Professional real estate agent'
    }
)

print(f"Agent Profile: {agent_profile.id} (created: {created})")

# Get the property and assign it
prop = Property.objects.last()
if prop:
    print(f"\nProperty: {prop.title}")
    print(f"Current agent: {prop.agent.id if prop.agent else None}")

    # Assign to your agent profile
    prop.agent = agent_profile
    prop.save()

    print(f"Updated agent to: {prop.agent.id}")
    print("✅ Property assigned successfully!")
else:
    print("❌ No properties found!")
```

## Expected Results

After running the fix command, you should see:
- Agent profile found or created
- Property exists
- Property assigned to your agent profile
- Frontend should now show the property

## API Test

After fix, test the API:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://property237.onrender.com/api/properties/my-properties/
```

Should return your property!
