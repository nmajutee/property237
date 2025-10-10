# ✅ How to Verify Your Persistent Disk is Working

## Quick Verification Checklist

After redeploying your backend, follow these tests in order:

---

## Test 1: Check Disk is Mounted (30 seconds)

### Via Render Shell

1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your backend web service
3. Click **"Shell"** tab in the left sidebar
4. Run this command:

```bash
df -h /data
```

### ✅ Success Output:
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/disk       10G   64K  9.9G  1%   /data
```

### ❌ Failure Output:
```
df: /data: No such file or directory
```

**If it fails:** The disk is not mounted. Go back to "Disks" tab and verify the disk exists and mount path is `/data`.

---

## Test 2: Check Directory Permissions (30 seconds)

Still in the Render Shell, run:

```bash
ls -la /data
```

### ✅ Success Output:
```
total 8
drwxr-xr-x  3 root root 4096 Oct 10 12:00 .
drwxr-xr-x 21 root root 4096 Oct 10 12:00 ..
drwxr-xr-x  2 root root 4096 Oct 10 12:00 media
```

### Create media directory if it doesn't exist:
```bash
mkdir -p /data/media
chmod 755 /data/media
```

---

## Test 3: Test Write Permissions (1 minute)

Create a test file to verify you can write to the disk:

```bash
echo "Persistent disk test - $(date)" > /data/test.txt
cat /data/test.txt
```

### ✅ Success Output:
```
Persistent disk test - Thu Oct 10 12:34:56 UTC 2025
```

### Test if it persists (Important!)

1. Note the timestamp in the file
2. Go to your Render service overview
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for redeployment to complete
5. Go back to Shell and run:

```bash
cat /data/test.txt
```

### ✅ Success: You see the SAME timestamp as before
### ❌ Failure: File doesn't exist or timestamp changed

---

## Test 4: Check Django Configuration (1 minute)

Verify Django is using the correct media root:

```bash
python manage.py shell
```

Then in the Python shell:

```python
from django.conf import settings
print("MEDIA_ROOT:", settings.MEDIA_ROOT)
print("MEDIA_URL:", settings.MEDIA_URL)
print("Disk exists:", __import__('os').path.exists('/data'))
```

### ✅ Success Output:
```
MEDIA_ROOT: /data/media
MEDIA_URL: /media/
Disk exists: True
```

### ❌ Failure Output:
```
MEDIA_ROOT: /app/media
MEDIA_URL: /media/
Disk exists: False
```

Type `exit()` to leave the Python shell.

---

## Test 5: Test Image Upload via Django Admin (3 minutes)

This is the REAL test!

### Step 1: Access Django Admin

1. Go to: `https://your-backend.onrender.com/admin/`
2. Login with your superuser credentials

### Step 2: Upload a Test Image

1. Navigate to **Properties** → **Add Property**
2. Fill in required fields (title, price, etc.)
3. Upload an image in the image field
4. Click **Save**

### Step 3: Verify Image URL

1. Click on the property you just created
2. Look at the image field
3. Click the image link

### ✅ Success: 
- Image URL looks like: `https://your-backend.onrender.com/media/property_images/image_xyz.jpg`
- Image displays correctly in your browser

### ❌ Failure:
- 404 error
- Image not found
- URL is broken

---

## Test 6: Persistence Test - The Critical One! (5 minutes)

This tests if images survive redeployment:

### Step 1: Note the Image URL

After uploading in Test 5, copy the full image URL, e.g.:
```
https://property237-backend.onrender.com/media/property_images/test_house_abc123.jpg
```

### Step 2: Trigger a Redeployment

Option A: Manual Deploy
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

Option B: Git Push
1. Make a small change (add a comment to any file)
2. Commit and push to GitHub
3. Wait for auto-deploy

### Step 3: Wait for Deployment

Wait 3-5 minutes for deployment to complete.

### Step 4: Check if Image Still Exists

1. Paste the image URL in your browser
2. Press Enter

### ✅ SUCCESS: Image loads correctly! 🎉
Your persistent disk is working perfectly!

### ❌ FAILURE: 404 or image not found
Your disk is not persistent. See troubleshooting below.

---

## Test 7: Check Disk Usage and Files (1 minute)

Verify files are actually stored on the disk:

```bash
# Check total disk usage
du -sh /data

# List all files in media directory
ls -lh /data/media/

# Count number of files
find /data/media -type f | wc -l

# Show recent files
find /data/media -type f -printf '%T+ %p\n' | sort -r | head -10
```

### ✅ Success Output Example:
```
64M    /data
total 60M
drwxr-xr-x 2 root root 4.0K Oct 10 12:00 property_images
-rw-r--r-- 1 root root  1.2M Oct 10 12:00 test_house_abc123.jpg
3 files
```

---

## Test 8: Frontend Integration Test (5 minutes)

Test the complete flow from your frontend:

### Step 1: Access Your Frontend

Go to: `https://your-app.vercel.app`

### Step 2: Create a Property with Image

1. Login to your account
2. Go to "Create Property" or "Add Listing"
3. Fill in property details
4. Upload a property image
5. Submit the form

### Step 3: Verify Image Display

1. Go to the property detail page
2. Check if the image displays correctly
3. Right-click the image → "Open image in new tab"
4. URL should be: `https://your-backend.onrender.com/media/...`

### Step 4: Test Persistence

1. Note the property ID or URL
2. Redeploy your backend (as in Test 6)
3. Go back to the property page
4. Refresh the page

### ✅ SUCCESS: Image still displays! 🎉
### ❌ FAILURE: Broken image icon

---

## 🔍 Quick Visual Checks

### Check 1: Render Dashboard - Disk Status

Go to your web service → Disks tab:

```
✅ media-storage
   Status: Active (green dot)
   Mount Path: /data
   Size: 10 GB
   Used: 64 MB
```

### Check 2: Render Logs

Go to Logs tab and look for:

```
✅ Good signs:
- No "Permission denied" errors
- No "Read-only file system" errors
- No "No such file or directory: /data" errors

❌ Bad signs:
- OSError: [Errno 30] Read-only file system
- FileNotFoundError: [Errno 2] No such file or directory: '/data/media'
```

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Disk Not Mounted After Redeployment

**Symptoms:**
```bash
df -h /data
# df: /data: No such file or directory
```

**Solution:**
1. Go to Disks tab in Render
2. Verify disk status is "Active"
3. Check mount path is exactly `/data` (not `/data/` or `data`)
4. Delete and recreate the disk
5. Redeploy again

### Issue 2: Permission Denied Errors

**Symptoms:**
```
PermissionError: [Errno 13] Permission denied: '/data/media/property_images/...'
```

**Solution:**
```bash
# In Render Shell
sudo chown -R $(whoami):$(whoami) /data
sudo chmod -R 755 /data
mkdir -p /data/media
chmod -R 755 /data/media
```

### Issue 3: Images Disappear After Deployment

**Symptoms:**
- Images work initially
- After redeployment, all images return 404

**Solution:**
Your Django settings might not be using `/data`. Check:

```python
# In backend/config/settings.py
print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
# Should print: /data/media (not /app/media)
```

If it's wrong, verify the code in settings.py:
```python
if os.path.exists('/data'):
    MEDIA_ROOT = '/data/media'
else:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Issue 4: 404 Errors When Accessing Images

**Symptoms:**
- Images upload successfully
- But URL returns 404: `https://your-backend.onrender.com/media/image.jpg`

**Solution:**

Check your `urls.py` includes:
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

Also verify MEDIA_URL in settings.py:
```python
MEDIA_URL = '/media/'  # Must start and end with /
```

---

## 📊 Monitoring Commands

Run these periodically to monitor your disk:

```bash
# Disk space summary
df -h /data

# Detailed usage by directory
du -h /data/media/* | sort -hr

# Number of images
find /data/media -name "*.jpg" -o -name "*.png" | wc -l

# Total size of images
du -sh /data/media

# Largest files
find /data/media -type f -exec ls -lh {} \; | sort -k5 -hr | head -20

# Files added in last 24 hours
find /data/media -type f -mtime -1 -ls
```

---

## ✅ All Tests Passed Checklist

- [ ] `df -h /data` shows mounted disk
- [ ] Can create and read files in `/data`
- [ ] Test file persists after redeployment
- [ ] Django MEDIA_ROOT points to `/data/media`
- [ ] Can upload image via Django admin
- [ ] Image URL is accessible
- [ ] Image persists after backend redeployment
- [ ] Frontend can upload and display images
- [ ] Disk usage commands work
- [ ] No permission errors in logs

---

## 🎉 Success Indicators

If you can see all of these, you're good to go:

1. ✅ `df -h /data` shows your disk
2. ✅ Test file survives redeployment
3. ✅ Django uses `/data/media` for MEDIA_ROOT
4. ✅ Images upload successfully
5. ✅ Images are accessible via URL
6. ✅ Images persist after redeployment
7. ✅ No errors in Render logs

**Congratulations! Your persistent disk is working correctly! 🚀**

---

## 🆘 Still Having Issues?

If you've tried all the tests and something's not working:

1. **Check Render Status**: https://status.render.com/
2. **Review Render Docs**: https://render.com/docs/disks
3. **Render Community**: https://community.render.com/
4. **Check your code**: Compare with the cleanup summary
5. **Contact Support**: Include your service name and test results

---

## 📝 Quick Test Script

Save this as `test_disk.sh` and run it in Render Shell:

```bash
#!/bin/bash

echo "=== Persistent Disk Test ==="
echo ""

echo "1. Checking if /data exists..."
if [ -d "/data" ]; then
    echo "✅ /data directory exists"
else
    echo "❌ /data directory not found"
    exit 1
fi

echo ""
echo "2. Checking disk mount..."
df -h /data

echo ""
echo "3. Checking write permissions..."
echo "Test $(date)" > /data/test_write.txt
if [ -f "/data/test_write.txt" ]; then
    echo "✅ Can write to /data"
    cat /data/test_write.txt
else
    echo "❌ Cannot write to /data"
    exit 1
fi

echo ""
echo "4. Checking /data/media directory..."
if [ -d "/data/media" ]; then
    echo "✅ /data/media exists"
    ls -lh /data/media/
else
    echo "⚠️  /data/media doesn't exist, creating..."
    mkdir -p /data/media
    chmod 755 /data/media
fi

echo ""
echo "5. Disk usage:"
du -sh /data

echo ""
echo "=== All tests passed! ✅ ==="
```

Run it:
```bash
bash test_disk.sh
```

---

**Next Steps:** If all tests pass, you're ready to deploy your frontend and start using the app! 🎊
