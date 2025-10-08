# Cloudinary Setup for Property237

## Why Cloudinary?
Render's free tier doesn't have persistent storage - uploaded files are lost on server restart. Cloudinary provides:
- ✅ **Free tier**: 25 GB storage, 25 GB bandwidth/month
- ✅ **Persistent storage**: Files never lost
- ✅ **Image optimization**: Automatic compression & transformations
- ✅ **CDN delivery**: Fast worldwide image loading

## Setup Instructions

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email

### 2. Get Your Credentials
1. Log in to https://cloudinary.com/console
2. On the dashboard, you'll see:
   - **Cloud Name**: e.g., `dxyz123abc`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: e.g., `abcdefghijklmnop` (click "Reveal" to see it)

### 3. Add Environment Variables to Render
1. Go to https://dashboard.render.com
2. Click on your backend service (property237)
3. Go to **Environment** tab
4. Click **Add Environment Variable** and add these three:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

4. Click **Save Changes**
5. Render will automatically redeploy with the new environment variables

### 4. Test It!
Once deployed:
1. Go to your add-property page
2. Upload images
3. Click "Publish Property"
4. Images will be stored on Cloudinary and served via their CDN

## How It Works

### Image Upload Flow:
1. User uploads image in browser
2. Frontend sends image to backend via multipart/form-data
3. Backend receives image and saves to Cloudinary
4. Cloudinary returns image URL
5. URL stored in database
6. Images served from Cloudinary CDN (fast!)

### Image URLs:
Instead of:
```
https://property237.onrender.com/media/property_images/image.jpg (❌ temporary)
```

You get:
```
https://res.cloudinary.com/your-cloud/image/upload/v123456/property_images/image.jpg (✅ permanent)
```

### Benefits:
- 📦 **No storage limits** on Render
- 🚀 **Fast delivery** via global CDN
- 🖼️ **Image transformations** on-the-fly (resize, crop, optimize)
- 💾 **Persistent** - never lost
- 💰 **Free** for up to 25GB

## Optional: Image Optimization

You can add image transformations in your PropertyImage model's `save()` method:

```python
from cloudinary.uploader import upload

def save(self, *args, **kwargs):
    if self.image:
        # Upload with optimizations
        result = upload(
            self.image,
            folder="property_images",
            transformation=[
                {'width': 1200, 'height': 800, 'crop': 'limit'},
                {'quality': 'auto:good'},
                {'fetch_format': 'auto'}
            ]
        )
        self.image = result['secure_url']
    super().save(*args, **kwargs)
```

## Troubleshooting

### "Upload failed" error:
- Check environment variables are set correctly in Render
- Verify API Secret is correct (no extra spaces)
- Check Cloudinary dashboard for quota limits

### Images not displaying:
- Check image URL in browser
- Verify CORS settings in Cloudinary dashboard
- Check browser console for errors

### Quota exceeded:
- Free tier: 25GB/month bandwidth
- Monitor usage at cloudinary.com/console
- Upgrade plan if needed (paid plans start at $99/month)

## Migration Notes

If you already have images in local storage or S3:
1. Download all images
2. Re-upload via Cloudinary Media Library
3. Update database URLs

Or use Cloudinary's fetch feature:
```python
from cloudinary.uploader import upload

# Fetch from existing URL and store in Cloudinary
result = upload("https://old-domain.com/image.jpg", folder="property_images")
```

## Support
- Cloudinary Docs: https://cloudinary.com/documentation
- Python SDK: https://cloudinary.com/documentation/django_integration
