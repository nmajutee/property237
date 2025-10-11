# Property & Image Upload Testing Guide

## Quick Setup Commands

### Step 1: Access Render Shell
Go to your Render dashboard → Your service → Shell tab

### Step 2: Run These Commands (Copy & Paste)

```bash
# Seed property types, statuses, and locations
python manage.py seed_all

# Create a test property
python manage.py create_test_property
```

---

## Test Property Data (Copy & Paste into Django Admin)

### Property 1: Luxury Apartment

**Title:**
```
Luxury 3-Bedroom Penthouse with Pool View
```

**Description:**
```
Stunning penthouse apartment with panoramic city views. Features include:

✨ Premium Features:
- Marble flooring throughout
- Italian designer kitchen
- Smart home automation system
- Private 50m² terrace
- Floor-to-ceiling windows

🏢 Building Amenities:
- 24/7 professional security
- State-of-the-art gym
- Infinity pool with city views
- Underground parking (2 spaces)
- High-speed elevators

📍 Prime Location:
- 5 min to international schools
- Walking distance to shopping centers
- Near embassies and business district
- Excellent public transport access

Perfect for executives, diplomats, or families seeking luxury living in the heart of the city.
```

**Details:**
- Property Type: Apartment
- Status: Available
- Listing Type: For Rent
- Bedrooms: 3
- Bathrooms: 3
- Living Rooms: 2
- Kitchen Type: Full Size
- Balconies: 2
- Total Floors: 5
- Floor Number: 5 (Top Floor)
- Room Size: 180 m²
- Price: 450,000 XAF/month
- Initial Payment: 3 months
- Caution: 2 months
- Visit Fee: 10,000 XAF

**Utilities & Amenities:**
- ✅ Private Electricity Meter (Prepaid)
- ✅ Camwater Supply
- ✅ AC Pre-installed (all rooms)
- ✅ Hot Water System
- ✅ Generator Backup
- ✅ Secure Parking
- ✅ 24/7 Security
- ✅ Swimming Pool
- ✅ Gym Access
- ✅ Elevator
- ✅ Dressing Cupboards

---

### Property 2: Budget Studio

**Title:**
```
Affordable Studio Apartment Near University
```

**Description:**
```
Cozy studio apartment perfect for students or young professionals starting their careers.

🏠 Features:
- Recently renovated
- Modern finishes
- Open-plan living
- Kitchenette included
- Private bathroom

📚 Perfect For Students:
- 5 min walk to university campus
- Close to libraries and study centers
- Quiet study environment
- Affordable monthly rent

🚶 Convenient Location:
- Walking distance to shops
- Near public transport
- Restaurants and cafes nearby
- Safe neighborhood with security

Ideal first apartment with everything you need. Move-in ready!
```

**Details:**
- Property Type: Studio
- Status: Available
- Listing Type: For Rent
- Bedrooms: 0 (Studio)
- Bathrooms: 1
- Living Rooms: 1
- Kitchen Type: Partial/Corner
- Room Size: 30 m²
- Price: 65,000 XAF/month
- Initial Payment: 2 months
- Caution: 1 month
- Visit Fee: 2,000 XAF

**Utilities & Amenities:**
- ⚡ Shared Electricity Meter (Postpaid)
- 💧 Camwater Supply
- 🔐 Security Guard
- 🚶 Walk-in accessible

---

### Property 3: Family Villa

**Title:**
```
Spacious 5-Bedroom Villa with Garden
```

**Description:**
```
Beautiful family home in peaceful residential neighborhood. Perfect for growing families!

🏡 Main House:
- 5 generous bedrooms (all with built-in wardrobes)
- Master suite with ensuite bathroom
- 2 living areas (formal + family room)
- Modern full-size kitchen
- Separate dining room
- Home office/study
- 4 bathrooms total

🌳 Outdoor Space:
- Large private garden (500m²)
- Perfect for children to play
- Garden shed
- Covered patio for entertaining
- Outdoor parking (3+ vehicles)

👨‍👩‍👧‍👦 Family-Friendly:
- Quiet residential area
- Near international schools
- Parks and playgrounds nearby
- Family-oriented community

🛡️ Security:
- Perimeter wall (2.5m high)
- Electric gate with intercom
- External security lighting
- Neighborhood watch active

Additional: Separate staff quarters with bathroom.
```

**Details:**
- Property Type: Villa/Duplex
- Status: Available
- Listing Type: For Rent
- Bedrooms: 5
- Bathrooms: 4
- Living Rooms: 2
- Kitchens: 2 (Main + Staff)
- Balconies: 3
- Floors: 2
- Room Size: 350 m²
- Price: 600,000 XAF/month
- Initial Payment: 6 months
- Caution: 3 months
- Visit Fee: 15,000 XAF

**Utilities & Amenities:**
- ⚡ Private Meter (Postpaid)
- 💧 Forage/Borehole Water
- ❄️ AC Pre-installed
- 🔥 Hot Water System
- ⚙️ Generator Backup
- 🚗 Private Parking
- 🔐 High Security
- 🌳 Large Garden

---

### Property 4: Commercial Office

**Title:**
```
Modern Office Space in Business District
```

**Description:**
```
Premium office space in prestigious commercial building. Ready for immediate occupation.

🏢 Office Layout:
- Open-plan workspace (120m²)
- 3 private offices with glass partitions
- Executive boardroom (seats 12)
- Professional reception area
- Kitchenette/break room
- 3 modern restrooms

💼 Business Amenities:
- High-speed fiber internet (1Gbps)
- Dedicated backup power
- Central air conditioning
- Professional cleaning service
- Mail and package handling

🅿️ Parking & Access:
- Ample parking (10+ spaces)
- Visitor parking available
- 24/7 building access
- Security checkpoint
- High-speed elevators

📍 Prime Location:
- Heart of business district
- Near banks and government offices
- Walking distance to hotels
- Excellent for client meetings

Perfect for consulting firms, tech startups, or corporate offices.
```

**Details:**
- Property Type: Office
- Status: Available
- Listing Type: For Rent
- Bedrooms: 0
- Bathrooms: 3
- Office Rooms: 5
- Kitchen Type: Partial
- Floor: 3 of 8
- Room Size: 200 m²
- Price: 800,000 XAF/month
- Initial Payment: 6 months
- Caution: 3 months
- Visit Fee: 20,000 XAF

**Utilities & Amenities:**
- ⚡ Private Meter (Prepaid)
- 💧 Camwater Supply
- ❄️ Central AC
- ⚙️ Backup Generator
- 🚗 Parking Spaces
- 🔐 24/7 Security
- 🛗 Elevator Access

---

### Property 5: Guest House

**Title:**
```
Boutique Guest House - Daily/Weekly Rental
```

**Description:**
```
Charming guest house perfect for short-term stays. Your home away from home!

🏠 Accommodation:
- 2 comfortable bedrooms
- Queen-size beds with premium linens
- Modern bathroom with hot shower
- Fully equipped kitchen
- Cozy living area

📺 Entertainment & Comfort:
- Fast WiFi throughout
- DSTV with sports channels
- Smart TV in living room
- Air conditioning in all rooms
- Hot water 24/7

🧹 Services Included:
- Daily cleaning service
- Fresh towels and linens
- Toiletries provided
- Complimentary coffee/tea

👥 Perfect For:
- Business travelers
- Tourists visiting Cameroon
- Family visiting for events
- Short-term consultants
- Pre-relocation accommodation

💰 Flexible Rates:
- Daily: 25,000 XAF
- Weekly: 150,000 XAF (save 14%)
- Monthly: 500,000 XAF (save 33%)

Located in safe, accessible neighborhood with restaurants and shops nearby.
```

**Details:**
- Property Type: Guest House
- Status: Available
- Listing Type: Guest House
- Bedrooms: 2
- Bathrooms: 2
- Living Rooms: 1
- Kitchen Type: Full Size
- Balconies: 1
- Room Size: 80 m²
- Daily Rate: 25,000 XAF
- Monthly Rate: 150,000 XAF
- Visit Fee: 5,000 XAF

**Utilities & Amenities:**
- ⚡ Private Meter (Prepaid)
- 💧 Camwater Supply
- ❄️ AC in all rooms
- 🔥 Hot Water 24/7
- ⚙️ Generator Backup
- 🚗 Private Parking
- 🔐 Secure Compound
- 📶 High-Speed WiFi

---

### Property 6: Land for Sale

**Title:**
```
Prime Land Plot with Title Deed - Ready to Build
```

**Description:**
```
Excellent investment opportunity in rapidly developing area!

📄 Legal Status:
- FULL TITLE DEED (Titre Foncier)
- All documentation complete
- Ready for immediate transfer
- No legal disputes
- Cadastral plan available

📏 Land Details:
- Size: 500 m² (25m x 20m)
- Flat terrain, easy to develop
- Good drainage
- Direct road access (tarred)
- Utilities nearby

🏗️ Development Potential:
- Residential: Build your dream home
- Commercial: Shop/office building
- Apartment block (check zoning)
- Investment: Hold for appreciation

📍 Location Advantages:
- Growing neighborhood
- Property values rising
- New developments nearby
- Infrastructure improving
- Good accessibility

💼 Investment Highlights:
- Area appreciation: 15-20% annually
- High demand location
- Near planned projects
- Easy bank financing
- Prime for development

Serious buyers only. Viewing by appointment. Negotiable for cash buyers.
```

**Details:**
- Property Type: Land Plot
- Status: Available
- Listing Type: For Sale
- Land Size: 500 m²
- Price: 15,000,000 XAF (30,000 XAF/m²)
- Has Title: Yes
- Title Type: Private Land
- Cadastral ID: CAD-2025-001
- Land Type: Private Land
- Area: Dry (not swampy)
- Visit Fee: 10,000 XAF

**Location:**
- Distance from Main Road: 200m
- Road Type: Tarred
- Vehicle Access: SUV accessible
- Electricity: Available nearby
- Water: Forage possible

---

## Image Upload Testing Checklist

### Test Images to Upload (3-5 per property)

**For Luxury Apartment:**
1. Living room with city view
2. Modern kitchen
3. Master bedroom
4. Bathroom with fixtures
5. Building exterior/pool

**For Studio:**
1. Overall room layout
2. Kitchenette area
3. Bathroom
4. Building exterior

**For Villa:**
1. Front exterior
2. Living room
3. Master bedroom
4. Garden/outdoor
5. Kitchen

**For Office:**
1. Open-plan workspace
2. Boardroom
3. Reception area
4. Building exterior

**For Guest House:**
1. Bedroom
2. Living area
3. Kitchen
4. Bathroom
5. Exterior

**For Land:**
1. Land overview
2. Street view
3. Corner markers
4. Title deed (photo)

---

## Image Upload Steps

1. **Log into Django Admin:**
   ```
   https://property237.onrender.com/admin/
   ```

2. **Navigate to:**
   Properties → Properties

3. **Select a property**

4. **Scroll to "Property Images" section** (inline form)

5. **Click "Add another Property Image"**

6. **Fill in for each image:**
   - 📁 Image: Choose file
   - 📝 Caption: "Living room with city view"
   - ⭐ Is Primary: Check for main photo
   - 🔢 Display Order: 1, 2, 3, etc.

7. **Click "Save"**

8. **Verify image URL:**
   ```
   https://property237.onrender.com/media/properties/[property-id]/image.jpg
   ```

9. **Test persistence:**
   - Make a small change and redeploy
   - Check if images still load

---

## Quick Testing Script

### After uploading images, test with this:

```bash
# Via Render Shell
ls -lh /data/media/properties/

# Count images
find /data/media/properties/ -type f | wc -l

# Check disk usage
df -h /data

# View recent images
ls -lht /data/media/properties/ | head -20
```

---

## Expected Results

✅ **Success Indicators:**
- Images upload without errors
- Images display in admin
- Image URLs work: `/media/properties/*/image.jpg`
- Images persist after redeployment
- Disk space shows files: `/data/media`

❌ **Failure Indicators:**
- Upload errors
- 404 on image URLs
- Images disappear after redeploy
- Permission denied errors

---

## Troubleshooting

### Issue: Images not uploading
**Solution:** Check file size (<10MB) and format (jpg, png)

### Issue: 404 on image URLs
**Solution:** Check `MEDIA_URL` and `MEDIA_ROOT` in settings

### Issue: Images disappear after deploy
**Solution:** Verify persistent disk mounted at `/data`

### Issue: Permission denied
**Solution:** Check `/data/media` directory permissions

---

## Success Metrics

After testing, you should have:
- ✅ 6 test properties created
- ✅ 3-5 images per property (15-30 total)
- ✅ All image URLs working
- ✅ Images persistent across deploys
- ✅ Disk usage visible in `/data`

**You're now ready for production image uploads!** 🎉

