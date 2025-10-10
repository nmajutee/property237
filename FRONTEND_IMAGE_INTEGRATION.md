# 🖼️ Frontend Image Upload Integration

## ✅ Good News: Your Current Code Already Works!

Your existing property upload code will work automatically with ImageKit because:
1. You upload images to `/api/properties/` endpoint
2. Django's `PropertyImage` model saves images
3. Our `ImageKitStorage` backend intercepts the save
4. Images go to ImageKit automatically
5. ImageKit URL is returned

**No frontend changes required!** 🎉

---

## Current Flow (Automatic ImageKit Upload)

```typescript
// In /frontend/src/app/add-property/page.tsx (lines 374-390)

const formDataToSend = new FormData()

// Append all form fields
Object.entries(formData).forEach(([key, value]) => {
  if (value === false || value === 0 || (value !== '' && value !== null && value !== undefined)) {
    formDataToSend.append(key, value.toString())
  }
})

// Append images - these will go to ImageKit via Django storage backend
images.forEach((image) => {
  formDataToSend.append('images', image, image.name)
})

// Submit to Django
const response = await fetch(`${apiBaseUrl}/properties/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formDataToSend,  // Images included here
})
```

### What Happens Behind the Scenes:

1. **Frontend** → Sends images to Django `/api/properties/`
2. **Django** → Receives property data + images
3. **PropertyImage.save()** → Triggers our ImageKit storage backend
4. **ImageKitStorage._save()** → Uploads to ImageKit
5. **ImageKit** → Returns CDN URL
6. **Django** → Saves URL in database
7. **Frontend** → Property created with ImageKit URLs ✅

---

## Optional: Direct ImageKit Upload Endpoint

If you want to upload images **separately** (before creating property), you can use the dedicated endpoint:

```typescript
// Optional: Upload images individually first

const uploadSingleImage = async (imageFile: File, propertyId?: number) => {
  const formData = new FormData()
  formData.append('file', imageFile)
  if (propertyId) formData.append('property_id', propertyId.toString())

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/media/upload-property-media/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    }
  )

  const data = await response.json()
  return {
    url: data.url,
    file_id: data.file_id,
    name: data.name,
  }
}

// Upload all images first
const uploadedImages = await Promise.all(
  images.map(img => uploadSingleImage(img))
)

// Then create property with ImageKit URLs
const propertyData = {
  ...formData,
  image_urls: uploadedImages.map(img => img.url),
}
```

**When to use this:**
- You want to show upload progress for each image
- You want to validate images before creating property
- You want to allow image reordering before submission

---

## Testing Your Current Setup

### Test 1: Create a Property with Images

1. **Go to**: https://property237.vercel.app/add-property
2. **Fill in property details**
3. **Upload 3+ images**
4. **Submit the form**
5. **Check the property page** - images should display ✅

### Test 2: Verify ImageKit Storage

After creating a property, check Render logs:

```
📤 Uploading image.jpg to ImageKit folder: /property237/property_images
✅ ImageKit upload successful!
   📎 URL: https://ik.imagekit.io/your_id/property237/property_images/...
   🆔 File ID: xxx...
```

### Test 3: Check ImageKit Dashboard

1. **Go to**: https://imagekit.io/dashboard/media-library
2. **Navigate to**: `/property237/property_images/`
3. **You should see** your uploaded images ✅

---

## Image Display (No Changes Needed)

Your current image display code works as-is:

```tsx
// Property images display automatically with ImageKit URLs
<img
  src={property.images[0].image}  // This is now ImageKit URL
  alt={property.title}
  className="w-full h-64 object-cover"
/>
```

---

## Optional: Add Image Transformations

ImageKit allows real-time transformations via URL parameters:

```tsx
// Original image
const imageUrl = property.images[0].image
// https://ik.imagekit.io/your_id/property237/property_images/house.jpg

// Generate thumbnail (400x300)
const thumbnail = `${imageUrl}?tr=w-400,h-300`

// Generate WebP version (smaller file size)
const webp = `${imageUrl}?tr=f-webp,q-80`

// Multiple transformations
const optimized = `${imageUrl}?tr=w-800,h-600,f-webp,q-85,fo-auto`
```

### Example: Property Card with Thumbnails

```tsx
// In your property card component
<img
  src={`${property.images[0].image}?tr=w-400,h-300,f-webp,q-80`}
  alt={property.title}
  className="w-full h-48 object-cover"
  loading="lazy"
/>
```

### Example: Full-Size Gallery Image

```tsx
// In property detail gallery
<img
  src={`${image.image}?tr=w-1200,h-800,f-webp,q-90`}
  alt={property.title}
  className="w-full h-full object-contain"
/>
```

---

## Profile Picture Upload (Similar Flow)

For user profile pictures, the same automatic flow works:

```typescript
// Current code in your profile edit component (no changes needed)
const formData = new FormData()
formData.append('profile_picture', profileImageFile)

const response = await fetch(
  `${apiBaseUrl}/users/profile/`,
  {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  }
)
// Profile picture automatically goes to ImageKit ✅
```

Or use the dedicated endpoint:

```typescript
// Optional: Direct profile picture upload
const response = await fetch(
  `${apiBaseUrl}/api/media/upload-profile-picture/`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,  // Contains 'file' field
  }
)
```

---

## Summary

### ✅ What's Already Working:

1. Property image uploads (via `/api/properties/`)
2. Profile picture uploads (via `/users/profile/`)
3. Automatic ImageKit storage backend
4. Image display with CDN URLs

### 📝 No Frontend Changes Required!

Your current code is fully compatible. Django handles ImageKit automatically.

### 🎨 Optional Enhancements:

1. **Add image transformations** for thumbnails
2. **Use dedicated upload endpoint** for better progress tracking
3. **Add image preview** before upload
4. **Add upload progress bars** for large files

---

## Next Steps

1. ✅ **Test current flow** - Create a property with images
2. ✅ **Verify Render logs** - Check for ImageKit upload success
3. ✅ **Check ImageKit dashboard** - See uploaded files
4. ✅ **Test image display** - Verify images show on property page

**Your app should work immediately with no code changes!** 🚀

---

## Quick Test Commands

```bash
# Check if Render deployed successfully
curl -I https://your-backend.onrender.com/health

# Test image upload (after creating property)
# Check response includes ImageKit URL
curl https://your-backend.onrender.com/api/properties/1/ | grep "ik.imagekit.io"
```

---

## Troubleshooting

### Images not uploading?

1. **Check Render logs** for errors
2. **Verify environment variables** in Render
3. **Check ImageKit API keys** are correct

### Images not displaying?

1. **Check network tab** in browser DevTools
2. **Verify image URL** starts with `https://ik.imagekit.io/`
3. **Check CORS** (ImageKit has CORS enabled by default)

### Upload is slow?

1. Images are being processed by ImageKit (normal)
2. Consider using dedicated upload endpoint for progress
3. ImageKit optimizes images automatically (adds time but improves delivery)

---

**You're ready to test! No frontend changes needed.** 🎉
