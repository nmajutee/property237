# AWS S3 Storage Setup for Property237

## Overview
Property237 uses AWS S3 for persistent image storage. All property images and profile pictures are stored in your S3 bucket and served via AWS infrastructure.

## Prerequisites
- AWS Account (free tier available)
- S3 Bucket created
- IAM User with S3 access

## Environment Variables Required

Add these to your Render service environment:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_STORAGE_BUCKET_NAME=property237-media
AWS_S3_REGION_NAME=eu-west-1
```

## S3 Bucket Configuration

### 1. Bucket Policy (Public Read Access)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::property237-media/*"
    }
  ]
}
```

### 2. CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## How It Works

1. User uploads image via frontend
2. Frontend sends image to backend API
3. Backend saves image directly to S3 using `django-storages`
4. S3 returns public URL
5. Backend stores URL in database
6. Frontend displays image from S3 URL

## Image Upload Flow

```
Frontend → Backend API → AWS S3 → Public URL → Database → Frontend Display
```

## Testing

After deployment, check Render logs for:
```
============================================================
AWS S3 STORAGE CONFIGURATION
============================================================
AWS_STORAGE_BUCKET_NAME: True
AWS_ACCESS_KEY_ID: True
AWS_SECRET_ACCESS_KEY: True
✓ AWS S3 configured successfully!
  Bucket: property237-media
  Region: eu-west-1
============================================================
```

## Image URLs

All images will have URLs like:
```
https://property237-media.s3.eu-west-1.amazonaws.com/property_images/image_123.jpg
https://property237-media.s3.eu-west-1.amazonaws.com/profile_pics/user_456.jpg
```

## Features

- ✅ Automatic S3 upload on image save
- ✅ Public read access for all images
- ✅ Direct S3 URLs (no proxying)
- ✅ Persistent storage (files never lost)
- ✅ Fast CDN delivery
- ✅ Automatic file type detection
- ✅ Simple and efficient

## Troubleshooting

### Images not uploading
1. Check S3 credentials in Render environment
2. Verify bucket policy allows public read
3. Check Render logs for errors

### Images not displaying
1. Verify bucket policy is set
2. Check image URLs in database
3. Test S3 URL directly in browser

## Cost
- AWS S3 Free Tier: 5GB storage, 20,000 GET requests/month
- After free tier: ~$0.023/GB/month
- Property237 typical usage: < $1/month
