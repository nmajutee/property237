# 📀 Creating a Persistent Disk on Render - Step-by-Step Guide

## ⚠️ WHY THIS IS CRITICAL

Without a persistent disk:
- ❌ All uploaded images will be **DELETED** on every deployment
- ❌ Users will lose their property photos
- ❌ Profile pictures will disappear
- ❌ Your app will appear broken

With a persistent disk:
- ✅ Images persist across deployments
- ✅ Data is backed up automatically
- ✅ Can scale up storage as needed
- ✅ Professional, production-ready setup

---

## 🎯 Prerequisites

- Render account (sign up at https://render.com)
- Your backend web service already created
- GitHub repository connected

---

## 📋 Step-by-Step Instructions

### Step 1: Access Your Web Service

1. Go to https://dashboard.render.com/
2. Click on your **backend web service** (e.g., `property237-backend`)
3. You should see your service dashboard

![Render Dashboard](https://docs.render.com/images/dashboard.png)

### Step 2: Navigate to Disks Tab

1. In your web service page, look at the **left sidebar**
2. Click on **"Disks"** (or **"Storage"** in some versions)
3. You'll see a page that says "No disks" if you haven't added one yet

```
┌─────────────────────────────────────────┐
│ Your Web Service                         │
├─────────────────────────────────────────┤
│ > Events                                 │
│ > Logs                                   │
│ > Shell                                  │
│ > Environment                            │
│ > Settings                               │
│ ▶ Disks  ← CLICK HERE                   │
│ > Metrics                                │
└─────────────────────────────────────────┘
```

### Step 3: Create New Disk

1. Click the **"Add Disk"** or **"New Disk"** button
2. You'll see a form with several fields

### Step 4: Configure Disk Settings

Fill in the form with these **exact values**:

```
┌─────────────────────────────────────────────────┐
│ Add Persistent Disk                             │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name: *                                         │
│ ┌─────────────────────────────────────┐        │
│ │ media-storage                        │        │
│ └─────────────────────────────────────┘        │
│                                                  │
│ Mount Path: *                                   │
│ ┌─────────────────────────────────────┐        │
│ │ /data                                │        │
│ └─────────────────────────────────────┘        │
│                                                  │
│ Size (GB): *                                    │
│ ┌─────────────────────────────────────┐        │
│ │ 10                                   │  [+]   │
│ └─────────────────────────────────────┘  [-]   │
│                                                  │
│ ℹ️ First 1 GB is free                          │
│ Additional storage: $0.25/GB per month         │
│                                                  │
│ [Cancel]  [Create Disk]                        │
└─────────────────────────────────────────────────┘
```

**Field Details:**

1. **Name**: `media-storage`
   - This is just a label for your disk
   - Can be anything, but `media-storage` is descriptive

2. **Mount Path**: `/data` ⚠️ **CRITICAL - MUST BE EXACTLY THIS**
   - This is where the disk will be accessible in your app
   - Your Django settings.py is configured to look for `/data`
   - **DO NOT change this** unless you also update settings.py

3. **Size**: Start with `10` GB
   - First 1GB is free
   - Additional 9GB = $2.25/month
   - Can store approximately 5,000-10,000 images
   - Can be expanded later without data loss

### Step 5: Create the Disk

1. Double-check all fields are correct
2. Click **"Create Disk"** button
3. Wait for disk creation (usually 10-30 seconds)

### Step 6: Verify Disk is Attached

You should see your disk listed:

```
┌─────────────────────────────────────────────────┐
│ Disks                                            │
├─────────────────────────────────────────────────┤
│                                                  │
│ ✅ media-storage                                │
│    Mount Path: /data                            │
│    Size: 10 GB                                  │
│    Status: Active                               │
│    Created: Just now                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Step 7: Redeploy Your Service

**Important**: The disk won't be available until you redeploy!

1. Go back to your service overview
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Or push a new commit to trigger auto-deploy
4. Wait for deployment to complete (3-5 minutes)

### Step 8: Verify Disk is Mounted

1. In your web service, go to **"Shell"** tab
2. Run this command:

```bash
df -h /data
```

Expected output:
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/disk       10G   64K  10G   1%   /data
```

3. Test creating a directory:
```bash
ls -la /data
```

You should see:
```
total 8
drwxr-xr-x  2 root root 4096 Oct 10 00:00 .
drwxr-xr-x 21 root root 4096 Oct 10 00:00 ..
```

---

## 💰 Cost Breakdown

| Storage Size | Monthly Cost | Approx. Images |
|--------------|--------------|----------------|
| 1 GB (free) | $0 | 500-1,000 |
| 10 GB | $2.25 | 5,000-10,000 |
| 20 GB | $4.75 | 10,000-20,000 |
| 50 GB | $12.25 | 25,000-50,000 |
| 100 GB | $24.75 | 50,000-100,000 |

**Calculation**: $0.25 per GB per month (first 1GB free)

---

## 🧪 Testing Your Persistent Disk

### Test 1: Create a Test File

In the Render Shell:

```bash
# Create a test file
echo "Hello from persistent disk!" > /data/test.txt

# Verify it exists
cat /data/test.txt
```

### Test 2: Trigger a Redeployment

1. Make a small change to your code (add a comment)
2. Push to GitHub
3. Wait for redeployment
4. Go back to Shell and run:

```bash
cat /data/test.txt
```

✅ If you see "Hello from persistent disk!" - **IT WORKS!**
❌ If you get "No such file" - disk not properly mounted

### Test 3: Upload an Image via Your App

1. Go to your deployed app
2. Login and create a property
3. Upload an image
4. Note the image URL
5. Redeploy your backend
6. Check if the image still loads

---

## 🔧 Common Issues & Solutions

### Issue 1: "Disk not found" error

**Cause**: Disk not created or not attached
**Solution**:
- Go back to Disks tab
- Verify disk exists and status is "Active"
- Redeploy service

### Issue 2: "Permission denied" when writing to /data

**Cause**: Mount path incorrect or permissions issue
**Solution**:
```bash
# In Render Shell
sudo chown -R render:render /data
sudo chmod -R 755 /data
```

### Issue 3: Images still disappearing after deployment

**Cause**: Django not configured to use /data
**Solution**: Check `backend/config/settings.py`:

```python
# Should have this:
if os.path.exists('/data'):
    MEDIA_ROOT = '/data/media'
else:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Issue 4: Disk full

**Cause**: Too many images uploaded
**Solution**:
1. Go to Disks tab in Render
2. Click on your disk
3. Click "Resize"
4. Increase size (e.g., from 10GB to 20GB)
5. No downtime needed!

---

## 📈 Scaling Your Disk

### When to Upgrade

Monitor disk usage in Render Shell:

```bash
# Check disk usage
df -h /data

# If "Use%" is above 80%, time to expand
```

### How to Resize (No Downtime!)

1. Go to Disks tab
2. Click on your `media-storage` disk
3. Click **"Resize"** button
4. Enter new size (must be larger than current)
5. Click "Resize Disk"
6. **No redeployment needed** - happens live!

---

## 🔄 Alternative: Using Render's UI (Newer Version)

If you don't see "Disks" tab, Render may have updated their UI:

1. Go to your web service
2. Scroll down to **"Persistent Disks"** section
3. Click **"Add Persistent Disk"**
4. Follow same configuration as above

---

## 📊 Monitoring Disk Usage

### Option 1: Render Dashboard

- Go to your disk in Render dashboard
- View usage metrics and graphs

### Option 2: Shell Commands

```bash
# Total usage
du -sh /data

# Breakdown by folder
du -sh /data/media/*

# Number of files
find /data/media -type f | wc -l

# Largest files
find /data/media -type f -exec ls -lh {} \; | sort -k5 -hr | head -10
```

### Option 3: Django Management Command

Create a management command:

```python
# backend/properties/management/commands/check_media_usage.py
from django.core.management.base import BaseCommand
import os

class Command(BaseCommand):
    def handle(self, *args, **options):
        media_root = '/data/media'
        total_size = 0
        file_count = 0

        for dirpath, dirnames, filenames in os.walk(media_root):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                total_size += os.path.getsize(fp)
                file_count += 1

        size_mb = total_size / (1024 * 1024)
        self.stdout.write(f"Total files: {file_count}")
        self.stdout.write(f"Total size: {size_mb:.2f} MB")
```

Run it:
```bash
python manage.py check_media_usage
```

---

## 🎓 Best Practices

1. **Start small, scale up**: Begin with 10GB, expand as needed
2. **Monitor usage**: Check disk usage monthly
3. **Set up alerts**: Use Render's monitoring or create custom alerts
4. **Backup important data**: Even though Render has snapshots, consider additional backups
5. **Clean up old files**: Implement a cleanup strategy for unused images

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs/disks
- **Render Community**: https://community.render.com/
- **Support**: https://render.com/support

---

## ✅ Checklist

Before moving forward, make sure:

- [ ] Persistent disk created with name `media-storage`
- [ ] Mount path is **exactly** `/data`
- [ ] Size is at least 10 GB (or 1 GB for testing)
- [ ] Service redeployed after adding disk
- [ ] Disk status shows "Active"
- [ ] Test file persists after redeployment
- [ ] Django can write to `/data/media`
- [ ] Images upload successfully
- [ ] Images persist after redeployment

---

**Once you've completed this, your app will have reliable, persistent image storage! 🎉**
