# Property237 Complete Testing & Fix Guide

## 🎯 Complete System Check

Run these steps in order to test and fix everything.

---

## Part 1: Backend Debug (Render Shell)

### Step 1: Access Render Shell
1. Go to https://dashboard.render.com
2. Select your **property237** service
3. Click **Shell** tab

### Step 2: Run These Commands (Copy & Paste)

#### Check 1: Properties in Database
```python
from properties.models import Property
from agents.models import AgentProfile
from users.models import CustomUser

print("=== PROPERTY CHECK ===")
print(f"Total properties: {Property.objects.count()}")

for prop in Property.objects.all():
    print(f"\n📦 Property ID: {prop.id}")
    print(f"   Title: {prop.title}")
    print(f"   Status: {prop.status.name}")
    print(f"   Is Active: {prop.is_active}")
    print(f"   Agent: {prop.agent.user.email if prop.agent else 'None'}")
    print(f"   Images: {prop.images.count()}")
```

**Expected:** Should show your property with `status='available'` and `is_active=True`

---

#### Check 2: Your Agent Profile
```python
from users.models import CustomUser
from agents.models import AgentProfile

user = CustomUser.objects.get(email='nmajut@gmail.com')
print(f"\n=== YOUR ACCOUNT ===")
print(f"Email: {user.email}")
print(f"User Type: {user.user_type}")

try:
    agent = user.agents_profile
    print(f"\n✅ Agent Profile ID: {agent.id}")
    print(f"   Properties: {agent.properties.count()}")
    
    for prop in agent.properties.all():
        print(f"   - {prop.title}")
except Exception as e:
    print(f"\n❌ No agent profile: {e}")
```

**Expected:** Should show agent profile with property count

---

#### Check 3: API Query Test
```python
from properties.models import Property

# Simulate what the public API does
public_properties = Property.objects.filter(
    is_active=True
).exclude(
    status__name='draft'
)

print(f"\n=== PUBLIC API TEST ===")
print(f"Properties visible to public: {public_properties.count()}")

for prop in public_properties:
    print(f"\n✅ {prop.title}")
    print(f"   Status: {prop.status.name}")
    print(f"   Price: {prop.price} {prop.currency}")
```

**Expected:** Should show at least 1 property

---

### Step 3: Fix If Needed

**If property exists but has wrong status:**
```python
from properties.models import Property, PropertyStatus

# Get your property
prop = Property.objects.last()
print(f"Current status: {prop.status.name}")

# Change to 'available'
available_status = PropertyStatus.objects.get(name='available')
prop.status = available_status
prop.is_active = True
prop.save()

print(f"✅ Updated to: {prop.status.name}")
```

**If property exists but wrong agent:**
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

# Assign property
prop = Property.objects.last()
prop.agent = agent_profile
prop.save()

print(f"✅ Property assigned to agent #{agent_profile.id}")
```

---

## Part 2: Test APIs (PowerShell)

### Test 1: Public Properties API
```powershell
curl https://property237.onrender.com/api/properties/
```

**Expected Response:**
```json
{
  "count": 1,
  "results": [{
    "id": 1,
    "title": "Appartment at st luke street buea",
    "price": "100000.00",
    ...
  }]
}
```

### Test 2: My Properties API (Authenticated)
```powershell
# Replace YOUR_TOKEN with actual JWT token
curl -H "Authorization: Bearer YOUR_TOKEN" https://property237.onrender.com/api/properties/my-properties/
```

**Expected:** Should show your properties

### Test 3: Image Serving
```powershell
curl -I https://property237.onrender.com/media/property_images/appartment_at_st_luke_street_buea.jpg
```

**Expected:** Should return `200 OK` (not 404)

---

## Part 3: Check Images on Disk

### In Render Shell:
```bash
# Check if images exist
ls -lh /data/media/property_images/

# Expected: Should show .jpg files
```

**If no images found:**
The image needs to be re-uploaded via Django admin.

---

## Part 4: Test Frontend

### Wait for Vercel Deployment
1. Check https://vercel.com/dashboard
2. Wait for "Ready" status (~2-3 min)

### Test Typography
1. Open your Vercel URL
2. Right-click any heading → Inspect
3. Check Computed → font-family
4. **Expected:** Headings = "Craftwork Grotesk"

### Test Body Text
1. Right-click any paragraph → Inspect
2. Check font-family
3. **Expected:** Body = "DM Sans"

### Test Properties Display
1. Navigate to properties page
2. **Expected:** Should see property cards

---

## Part 5: Complete Property Setup (If Needed)

### Via Django Admin Panel

1. **Go to:** https://property237.onrender.com/admin/
2. **Login** with your credentials

#### Add/Update Property:
1. Click **Properties** → **Properties**
2. Click your property OR **Add Property**
3. Fill in:
   - ✅ Title: "Luxury Apartment at St Luke Street"
   - ✅ Status: **Available** (not Draft!)
   - ✅ Property Type: Apartment
   - ✅ Area: Select location
   - ✅ Price: 450000
   - ✅ Bedrooms: 3
   - ✅ Bathrooms: 3
   - ✅ Is Active: **✓ Checked**

4. **Scroll to Property Images section**
5. Click "Add another Property Image"
6. Upload 3-5 images:
   - Image Type: Exterior, Interior, Bedroom, etc.
   - Title: "Living room view"
   - Order: 1, 2, 3...
   - Is Primary: Check for main photo

7. **Click Save**

---

## Part 6: Verification Checklist

### Backend ✅
- [ ] Property exists in database
- [ ] Property status = 'available'
- [ ] Property is_active = True
- [ ] Property has correct agent assigned
- [ ] Property has images uploaded
- [ ] Public API returns property

### Frontend ✅
- [ ] Vercel deployed successfully
- [ ] Craftwork Grotesk loads for headings
- [ ] DM Sans loads for body text
- [ ] Properties display on frontend
- [ ] Images load correctly

### Media ✅
- [ ] Images exist at /data/media/property_images/
- [ ] Image URLs return 200 OK
- [ ] Images display in frontend cards

---

## 🚨 Common Issues & Fixes

### Issue 1: API Returns Empty Array
**Fix:** Property status is 'draft' or is_active=False
```python
prop = Property.objects.last()
prop.status = PropertyStatus.objects.get(name='available')
prop.is_active = True
prop.save()
```

### Issue 2: Image 404 Error
**Fix:** Render deployment might have cleared /data/media
- Re-upload images via Django admin
- OR check if persistent disk is mounted

### Issue 3: Property Not Assigned to You
**Fix:** Run agent assignment command (see Step 3 above)

### Issue 4: Frontend Shows No Properties
**Fix:** Check browser console for:
- CORS errors
- API endpoint errors
- 401 authentication errors

---

## 📊 Success Criteria

When everything works:

✅ **Backend:**
```bash
curl https://property237.onrender.com/api/properties/
# Returns: {"count": 1, "results": [...]}
```

✅ **Images:**
```bash
curl -I https://property237.onrender.com/media/property_images/image.jpg
# Returns: HTTP/1.1 200 OK
```

✅ **Frontend:**
- Headings use Craftwork Grotesk (inspect font-family)
- Property cards display with images
- Click property → Detail page shows all info

---

## 🎯 Quick Start

**Run these 3 commands first:**

1. **Render Shell:**
   ```python
   from properties.models import Property
   print(f"Properties: {Property.objects.filter(is_active=True).exclude(status__name='draft').count()}")
   ```

2. **PowerShell:**
   ```powershell
   curl https://property237.onrender.com/api/properties/
   ```

3. **Browser:**
   Open your Vercel URL and check for properties

If all 3 work → You're done! 🎉
If any fail → Follow the relevant section above to fix.

---

## Need Help?

**Stuck on a step?** Run this debug command:
```python
from properties.models import Property
p = Property.objects.last()
print(f"Title: {p.title}")
print(f"Status: {p.status.name}")
print(f"Active: {p.is_active}")
print(f"Agent: {p.agent.user.email if p.agent else 'None'}")
print(f"Images: {p.images.count()}")
```

This shows exactly what's wrong!
