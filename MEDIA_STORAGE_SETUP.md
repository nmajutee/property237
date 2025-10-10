# Media Storage Setup - Render File System Approach

## Overview
We use **local file system storage** on Render with persistent disks - a simple, cost-effective solution perfect for Render deployments.

## Architecture

```
┌─────────────────────────────────────────────────┐
│ User Uploads Image                               │
│  └─> Frontend (Vercel) sends to API             │
│       └─> Backend (Render) saves to /data/media/│
│            └─> Returns URL: /media/image.jpg    │
│                 └─> Frontend displays image      │
└─────────────────────────────────────────────────┘
```

## Benefits

✅ **No Third Party** - No AWS, ImageKit, Cloudinary needed
✅ **Cost Effective** - Use Render's included disk space
✅ **Simple Setup** - No complex cloud storage configuration
✅ **Full Control** - Your files, your server
✅ **Production Ready** - Standard Django file handling
✅ **Easy Migration** - Can switch to cloud storage later if needed

## Render Configuration

### 1. Add Persistent Disk (REQUIRED for Production)

**Important**: Render's ephemeral file system is temporary. Without a persistent disk, uploaded images will be lost on each deployment.

In your Render dashboard:

1. Go to your backend web service (property237 or similar)
2. Navigate to **"Disks"** section
3. Click **"Add Disk"**
   - **Name**: `media-storage`
   - **Mount Path**: `/data`
   - **Size**: Start with **10 GB** (can expand to 100GB+ later)
4. Click **"Save"** and redeploy your service

### 2. Environment Variables

**No external service credentials needed!**

Remove these if present:
- ❌ `IMAGEKIT_PRIVATE_KEY`
- ❌ `IMAGEKIT_PUBLIC_KEY`
- ❌ `IMAGEKIT_URL_ENDPOINT`
- ❌ `AWS_ACCESS_KEY_ID`
- ❌ `AWS_SECRET_ACCESS_KEY`
- ❌ `AWS_STORAGE_BUCKET_NAME`

The app automatically uses local file system storage.

### 3. Directory Structure

```
/data/
  └── media/
       ├── property_images/     # Property photos
       │    ├── img_001.jpg
       │    └── img_002.jpg
       ├── profile_pics/        # User avatars
       └── documents/           # Title deeds, etc.
```

## How It Works

### Upload Flow

1. **Frontend** → Sends multipart/form-data with image
2. **Django** → Receives file via `request.FILES`
3. **Django** → Saves to `/data/media/property_images/abc123.jpg`
4. **Database** → Stores path: `property_images/abc123.jpg`
5. **Frontend** → Displays: `https://yourdomain.com/media/property_images/abc123.jpg`

### Code Example

```python
# Django automatically handles this
image = request.FILES.get('image')
property_image = PropertyImage.objects.create(
    property=property,
    image=image  # Django saves to MEDIA_ROOT/property_images/
)
# property_image.image.url returns: /media/property_images/filename.jpg
```

## Performance Optimization

### Current: Django Serves Files
- ✅ Works immediately
- ⚠️ Not optimal for high traffic

### Future: Add WhiteNoise (Already Included!)
WhiteNoise is already in your `requirements.txt` and configured. It efficiently serves static and media files in production.

### Scale Up: Add CDN
When you have thousands of users:
1. Keep file system storage
2. Add CloudFlare CDN (free tier) in front
3. CloudFlare caches images globally
4. Zero code changes needed

## Migration Path to Cloud Storage (Future)

When you're ready to scale to millions of users:

```python
# Just change one setting in settings.py:
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

All existing code works - Django abstracts the storage layer!

## Monitoring & Maintenance

### Check Disk Usage
```bash
# SSH into Render
df -h /data
du -sh /data/media/*
```

### Backup Strategy
- Render includes automated disk snapshots
- Can also sync to S3 for redundancy:
  ```bash
  # Weekly backup cron job
  aws s3 sync /data/media s3://your-backup-bucket/media/
  ```

## Security Best Practices

✅ **Validation** - Check file types and sizes (already implemented)
✅ **Unique Names** - Django auto-generates unique filenames
✅ **Access Control** - Only authenticated users can upload
✅ **HTTPS** - All media served over HTTPS (Render provides this)

## Cost Comparison

| Solution | Monthly Cost (1000 images) |
|----------|---------------------------|
| File System (10GB disk) | $0 (included) |
| AWS S3 | ~$0.23 + $0.90 transfer = $1.13 |
| ImageKit | $49/month (starter plan) |
| Cloudinary | $99/month (plus plan) |

## Troubleshooting

### Images Not Showing After Upload
```bash
# Check if file was saved
ls -lh /data/media/property_images/

# Check Django logs
tail -f /var/log/django.log
```

### Disk Full
```bash
# Check usage
df -h /data

# Clear old files if needed
find /data/media -type f -mtime +365 -delete  # Delete 1yr+ old files
```

## Enterprise Examples Using File System Storage

- **Instagram** (early days) - File system + CDN
- **Pinterest** - File system → S3 migration path
- **Dropbox** - Custom file system storage
- **GitLab** - File system for repositories

This is a **proven enterprise pattern** for MVPs and scale-ups!

---

## Summary

✅ Simple, reliable, no dependencies
✅ Production-ready with Render persistent disk
✅ Easy to scale later (add CDN or migrate to S3)
✅ Industry-standard approach
✅ **Your images, your control!**
