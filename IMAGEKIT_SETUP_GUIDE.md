# 🚀 ImageKit.io Integration Guide - Property237

## Why ImageKit? (vs AWS S3)

✅ **5-minute setup** (vs 2+ hours with AWS S3)  
✅ **No permission headaches** (automatic public access)  
✅ **Built-in CDN** (global fast delivery)  
✅ **Automatic image optimization** (faster page loads)  
✅ **Real-time image transformations** (resize, crop, format conversion)  
✅ **Video support** (thumbnails, streaming)  
✅ **Free tier**: 20GB storage, 20GB bandwidth/month  

---

## 📋 Step 1: Create ImageKit Account (2 minutes)

1. **Go to**: https://imagekit.io/registration/
2. **Sign up** with your email (or use Google/GitHub)
3. **Verify your email**
4. **Complete the welcome wizard** (choose "Web Application")

---

## 🔑 Step 2: Get Your API Credentials (1 minute)

1. **Log into ImageKit dashboard**: https://imagekit.io/dashboard
2. **Click your profile icon** (top right) → **"API Keys"**
   OR go directly to: https://imagekit.io/dashboard/developer/api-keys

3. **Copy these 3 values**:

   ```
   Public Key:       pub_xxxxxxxxxxxxxxxxxxxxxxxx
   Private Key:      priv_xxxxxxxxxxxxxxxxxxxxxxxx
   URL Endpoint:     https://ik.imagekit.io/your_imagekit_id
   ```

4. **Keep these safe!** You'll need them for Render environment variables.

---

## ⚙️ Step 3: Add Environment Variables to Render (2 minutes)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Select your backend service** (property237-backend or similar)
3. **Go to "Environment" tab**
4. **Click "Add Environment Variable"** and add these **3 variables**:

   ```
   IMAGEKIT_PRIVATE_KEY=priv_xxxxxxxxxxxxxxxxxxxxxxxx
   IMAGEKIT_PUBLIC_KEY=pub_xxxxxxxxxxxxxxxxxxxxxxxx
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
   ```

5. **Click "Save Changes"**
6. **Render will automatically redeploy** (wait 2-3 minutes)

---

## 📦 Step 4: Deploy Backend Changes (Already Done! ✅)

The backend code is already configured:

✅ **ImageKit SDK installed** (`imagekitio==3.2.0`)  
✅ **Storage backend created** (`utils/imagekit_storage.py`)  
✅ **Upload endpoints ready** (`media/imagekit_views.py`)  
✅ **Django settings configured** (`config/settings.py`)  

Just push to GitHub and Render will deploy:

```bash
git add -A
git commit -m "feat: Integrate ImageKit.io for image storage and CDN"
git push origin main
```

---

## 🌐 Step 5: Update Next.js Frontend (5 minutes)

### Option A: Server-Side Uploads (Recommended - More Secure)

Your frontend uploads files to Django, Django uploads to ImageKit:

```typescript
// In your property upload component
const handleImageUpload = async (file: File, propertyId?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  if (propertyId) formData.append('property_id', propertyId.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/media/upload-property-media/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return data.url; // ImageKit CDN URL
};
```

### Option B: Client-Side Direct Uploads (Faster for Large Files)

Your frontend uploads directly to ImageKit (bypassing Django):

```typescript
// 1. Get auth params from your backend
const getAuthParams = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/media/imagekit-auth/`
  );
  return await response.json();
};

// 2. Upload directly to ImageKit
const uploadToImageKit = async (file: File) => {
  const authParams = await getAuthParams();
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('publicKey', authParams.public_key);
  formData.append('signature', authParams.signature);
  formData.append('expire', authParams.expire);
  formData.append('token', authParams.token);
  formData.append('folder', '/property237/property_images');

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.url;
};
```

---

## 🖼️ Step 6: Display Images in Next.js

### Basic Image Display

```tsx
<img 
  src={property.image_url} 
  alt={property.title}
  className="w-full h-64 object-cover"
/>
```

### With Next.js Image Component

Update `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['ik.imagekit.io'], // Allow ImageKit domain
  },
}
```

Then use Next.js Image:

```tsx
import Image from 'next/image';

<Image 
  src={property.image_url}
  alt={property.title}
  width={800}
  height={600}
  className="w-full h-64 object-cover"
/>
```

### With Image Transformations (Magic! ✨)

ImageKit allows real-time transformations via URL:

```tsx
// Original: https://ik.imagekit.io/your_id/property_images/image.jpg

// Resize to 400x300:
const thumbnailUrl = `${imageUrl}?tr=w-400,h-300`;

// Add blur effect:
const blurredUrl = `${imageUrl}?tr=bl-10`;

// Convert to WebP:
const webpUrl = `${imageUrl}?tr=f-webp`;

// Multiple transformations:
const optimizedUrl = `${imageUrl}?tr=w-800,h-600,f-webp,q-80`;
```

---

## ✅ Step 7: Test Your Setup

### Test 1: Check Render Logs

After Render redeploys, check logs for:

```
============================================================
MEDIA STORAGE CONFIGURATION
============================================================
IMAGEKIT_PRIVATE_KEY: True
IMAGEKIT_PUBLIC_KEY: True
IMAGEKIT_URL_ENDPOINT: https://ik.imagekit.io/your_id
✓ ImageKit configured successfully!
  URL Endpoint: https://ik.imagekit.io/your_id
  Storage Backend: utils.imagekit_storage.ImageKitStorage
  ✓ No permission configuration needed!
  ✓ Automatic optimization enabled!
  ✓ Global CDN enabled!
============================================================
```

### Test 2: Upload a Property Image

1. **Go to your Property237 website**
2. **Create or edit a property**
3. **Upload an image**
4. **Check the image displays immediately** ✅

### Test 3: Check ImageKit Dashboard

1. **Go to**: https://imagekit.io/dashboard/media-library
2. **You should see** your uploaded images in `/property237/property_images/`
3. **Click on an image** to see CDN URL and transformations

---

## 🎯 API Endpoints Available

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/media/upload-property-media/` | POST | ✅ Required | Upload property images |
| `/api/media/upload-profile-picture/` | POST | ✅ Required | Upload profile pictures |
| `/api/media/imagekit-auth/` | GET | ❌ Public | Get client-side upload auth |

---

## 🐛 Troubleshooting

### "Images not displaying"

**Check 1**: Verify environment variables in Render
```bash
# In Render dashboard, check:
IMAGEKIT_PRIVATE_KEY=priv_...
IMAGEKIT_PUBLIC_KEY=pub_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
```

**Check 2**: Check Render deployment logs
- Look for "✓ ImageKit configured successfully!"
- If not, environment variables are missing

**Check 3**: Check browser console
- Open Developer Tools → Console
- Look for any image loading errors
- ImageKit URLs should start with `https://ik.imagekit.io/`

### "Upload failed" error

**Check 1**: Verify API keys are correct
- Go to ImageKit dashboard → API Keys
- Copy the keys exactly (no extra spaces)

**Check 2**: Check file size
- ImageKit free tier: 25MB per file
- Upgrade if you need larger files

**Check 3**: Check Render logs
- Look for "❌ ImageKit upload failed"
- Error message will show the specific issue

### "ImageKit dashboard shows no files"

- Wait 1-2 minutes after upload (processing time)
- Check folder: `/property237/property_images/`
- Files might be in different folder if upload path changed

---

## 💰 ImageKit Pricing

### Free Tier (Perfect for Development & MVP)
- ✅ 20 GB storage
- ✅ 20 GB bandwidth per month
- ✅ Unlimited image transformations
- ✅ Unlimited CDN bandwidth
- ✅ No credit card required

### Paid Tiers (When You Scale)
- **Starter**: $29/month (100GB storage, 100GB bandwidth)
- **Growth**: $99/month (500GB storage, 500GB bandwidth)
- **Enterprise**: Custom pricing

**For comparison**: AWS S3 + CloudFront would cost similar but requires much more setup time.

---

## 🎨 Image Transformation Examples

```bash
# Original image
https://ik.imagekit.io/your_id/property_images/house.jpg

# Thumbnail (400x300)
https://ik.imagekit.io/your_id/property_images/house.jpg?tr=w-400,h-300

# Square crop (for profile pictures)
https://ik.imagekit.io/your_id/profile_pics/user.jpg?tr=w-200,h-200,c-at_max

# Blur background
https://ik.imagekit.io/your_id/property_images/house.jpg?tr=bl-20

# Add watermark (configure in dashboard)
https://ik.imagekit.io/your_id/property_images/house.jpg?tr=oi-logo.png

# Progressive JPEG (faster loading)
https://ik.imagekit.io/your_id/property_images/house.jpg?tr=pr-true

# Convert to WebP (smaller file size)
https://ik.imagekit.io/your_id/property_images/house.jpg?tr=f-webp
```

---

## 📊 Migration from AWS S3 (Optional)

If you have existing images in AWS S3 and want to migrate:

### Option 1: Bulk Upload via Dashboard
1. Download images from S3 (AWS Console → S3 → Download)
2. Upload to ImageKit dashboard (Media Library → Upload)

### Option 2: API Migration (Programmatic)
```python
# Run this script to migrate images from S3 to ImageKit
import boto3
from imagekitio import ImageKit

# Setup
s3 = boto3.client('s3')
imagekit = ImageKit(...)

# List S3 objects
objects = s3.list_objects_v2(Bucket='property237-media')

# Upload each to ImageKit
for obj in objects['Contents']:
    file_content = s3.get_object(Bucket='property237-media', Key=obj['Key'])['Body'].read()
    imagekit.upload_file(file=file_content, file_name=obj['Key'])
```

---

## 🎉 You're Done!

Your Property237 app now has:

✅ **Fast CDN image delivery** (global)  
✅ **Automatic optimization** (WebP, compression)  
✅ **Real-time transformations** (resize, crop, etc.)  
✅ **Simple uploads** (no permission headaches)  
✅ **Video support** (thumbnails, streaming)  

**Total setup time**: ~10 minutes (vs 2+ hours with AWS S3)

---

## 📞 Need Help?

- **ImageKit Docs**: https://docs.imagekit.io/
- **ImageKit Support**: https://imagekit.io/contact-us/
- **Community Forum**: https://community.imagekit.io/

**Good luck with your presentation in 72 hours!** 🚀🎤
