# Test Property Setup Guide

This guide explains how to create and test properties in the Property237 platform.

## Quick Start

### 1. Seed Initial Data

First, populate the database with property types, statuses, and locations:

```bash
python manage.py seed_all
```

This will create:
- Property types (Apartment, Studio, Villa, etc.)
- Property statuses (Available, Rented, Sold, etc.)
- Cameroon locations (Regions, Cities, Areas)

### 2. Create Test Property

Create a sample property with realistic data:

```bash
python manage.py create_test_property
```

Options:
```bash
# Specify a different user email
python manage.py create_test_property --email=youremail@example.com
```

This creates:
- A modern 2-bedroom apartment in Bastos, Yaoundé
- Complete with all amenities and utilities
- Assigned to your user account
- Ready for image uploads

### 3. Access Django Admin

1. Go to: `https://property237.onrender.com/admin/`
2. Login with your credentials
3. Navigate to **Properties** → **Properties**
4. Find the test property
5. Add images using the inline image upload form

## Testing Image Persistence

### Upload Test Images

1. In Django admin, edit the test property
2. Scroll to the "Property Images" section
3. Click "Add another Property Image"
4. Upload an image
5. Set caption and display order
6. Mark one as primary (for thumbnail)
7. Save the property

### Verify Persistence

1. Check image URL works: `https://property237.onrender.com/media/properties/your-image.jpg`
2. Trigger a new deployment (git push)
3. After deployment, verify the image still exists and loads
4. This confirms `/data/media` persistent disk is working

## Property Data Structure

### Test Property Details

The test property created has:

**Location:**
- Area: Bastos
- City: Yaoundé
- Region: Centre
- 200m from main road (tarred)

**Property Details:**
- 2 Bedrooms
- 2 Bathrooms (1 ensuite)
- 1 Living room
- 1 Full-size kitchen
- 1 Balcony
- 120 m² total size
- Floor 2 of 3

**Utilities:**
- Private electricity meter (prepaid)
- Camwater water supply
- AC pre-installed
- Hot water system
- Generator backup

**Amenities:**
- Secure parking
- 24/7 security
- Elevator access

**Pricing:**
- Rent: 250,000 XAF/month
- Initial payment: 3 months
- Caution: 2 months
- Visit fee: 5,000 XAF

**Agent Info:**
- Agency: Property237 Realty
- Commission: 10% (1 month)

## Management Commands Reference

### `seed_all`
Populates all initial data
```bash
python manage.py seed_all
```

### `populate_property_data`
Populates only property types and statuses
```bash
python manage.py populate_property_data
```

### `populate_cameroon_locations`
Populates Cameroon regions, cities, and areas
```bash
python manage.py populate_cameroon_locations
```

### `create_test_property`
Creates a realistic test property
```bash
python manage.py create_test_property [--email=EMAIL]
```

## Troubleshooting

### "User not found"
The command will automatically create an admin user if one doesn't exist:
- Email: admin@property237.com
- Password: Admin@123

### "Property already exists"
The command checks for existing properties and won't create duplicates.

### "Location not found"
Run `python manage.py populate_cameroon_locations` first.

### "Property type not found"
Run `python manage.py populate_property_data` first.

## Next Steps

After creating the test property:

1. **Add Images**: Upload 3-5 property images via Django admin
2. **Test Image URLs**: Verify images load in browser
3. **Test Persistence**: Push a new deployment and verify images persist
4. **API Testing**: Test property endpoints with images
5. **Frontend Integration**: Connect Vercel frontend to load property images

## Production Checklist

Before going live:

- [ ] All property types and statuses populated
- [ ] Location data (regions, cities, areas) populated
- [ ] Test property with images created
- [ ] Images persist across deployments
- [ ] Image URLs accessible from frontend
- [ ] /data/media directory has correct permissions
- [ ] Django admin accessible
- [ ] API endpoints returning property data with image URLs

## Support

For issues or questions:
- Check Render deployment logs
- Verify `/data` mount point exists
- Check Django MEDIA_ROOT settings
- Review CORS settings for image access

