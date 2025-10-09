# Cloudinary Configuration Fix

## What Was Fixed

The application now automatically parses the `CLOUDINARY_URL` environment variable (format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`) instead of requiring three separate environment variables.

## What You Need to Do

### Step 1: Wait for Deployment
Your changes have been pushed to GitHub. Wait for Render to automatically redeploy your backend service (this usually takes 3-5 minutes).

### Step 2: Check the Logs
Once deployed, check your Render logs. You should see:
```
✓ Cloudinary configured: cloud_name=YOUR_CLOUD_NAME
✓ Using storage backend: utils.cloudinary_storage.OptimizedCloudinaryStorage
✓ Media URL: https://res.cloudinary.com/YOUR_CLOUD_NAME/
```

If you see `⚠ Using local media storage`, Cloudinary is NOT configured properly.

### Step 3: Fix Existing Images

You have **one existing property with a broken local image path**. You have two options:

#### Option A: Upload New Images (Easiest)
1. Go to your property in the app
2. Edit the property
3. Delete the old broken image
4. Upload a new image - it will automatically be stored on Cloudinary

#### Option B: Run Migration Command (For Multiple Images)
If you have many properties with local images, SSH into your Render instance and run:

```bash
python manage.py upload_to_cloudinary --dry-run  # First, see what will happen
python manage.py upload_to_cloudinary             # Actually migrate the images
```

**Note:** This command only works if the old image files still exist on the server's disk. If they don't exist (which is likely on Render), you'll need to re-upload them manually using Option A.

### Step 4: Test New Uploads
1. Create a new property or edit an existing one
2. Upload an image
3. Check that the image displays correctly
4. Verify the image URL starts with `https://res.cloudinary.com/`

## Current Status

- ✅ Cloudinary integration configured
- ✅ Automatic URL parsing from `CLOUDINARY_URL`
- ✅ Image optimization enabled (uniform sizing: 1200x800 for full, 400x300 for thumbnails)
- ✅ Placeholder images for missing/broken images
- ⚠️ **Action Required:** Re-upload images for existing properties with broken local paths

## Troubleshooting

### Images Still Not Showing
1. Check Render logs for Cloudinary configuration messages
2. Verify `CLOUDINARY_URL` is set in Render environment variables
3. Ensure new uploads are going to Cloudinary (check the image URL)

### "Not Found: /media/property_images/..." Error
This means you have old images with local file paths. Follow Step 3 above to fix them.

### Cloudinary Not Configured
If logs show "Using local media storage":
1. Check that `CLOUDINARY_URL` environment variable is set in Render
2. Verify the format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
3. Redeploy the service after setting the variable

## Environment Variable Format

Your `CLOUDINARY_URL` should look like:
```
cloudinary://286212259653134:YourSecretHere@YourCloudName
```

The app will automatically extract:
- API Key: `286212259653134`
- API Secret: `YourSecretHere`
- Cloud Name: `YourCloudName`
