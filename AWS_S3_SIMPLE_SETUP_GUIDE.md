# Simple AWS S3 Setup Guide for Beginners

## You Need to Do 3 Things in AWS Console

### Step 1: Log into AWS and Find Your Bucket

1. **Open your web browser** and go to: https://console.aws.amazon.com/
2. **Log in** with your AWS account email and password
3. **Search for "S3"** in the top search bar
4. **Click on "S3"** (it will say "Scalable Storage in the Cloud")
5. You'll see a list of buckets. **Click on your bucket** named: `property237-media`

---

### Step 2: Allow Public Access (3 Minutes)

#### Part A: Unblock Public Access

1. You're now inside your bucket. Look for tabs at the top.
2. **Click the "Permissions" tab**
3. Look for a section called **"Block public access (bucket settings)"**
4. **Click the "Edit" button** on the right side
5. You'll see a checkbox that says **"Block all public access"**
6. **UNCHECK this box** (remove the checkmark)
7. **Click "Save changes"** (orange button at bottom)
8. A popup will ask you to confirm. **Type the word: `confirm`**
9. **Click "Confirm"** button

✅ **Done!** Public access is now allowed.

#### Part B: Add Bucket Policy

1. **Stay on the "Permissions" tab**
2. **Scroll down** until you see **"Bucket policy"**
3. **Click "Edit"** button
4. You'll see a big empty text box
5. **Copy and paste this entire text** into the box:

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

6. **Click "Save changes"** (orange button)

✅ **Done!** Your images can now be viewed publicly.

---

### Step 3: Setup CORS (1 Minute)

1. **Still on the "Permissions" tab**
2. **Scroll down** until you see **"Cross-origin resource sharing (CORS)"**
3. **Click "Edit"** button
4. You'll see another text box
5. **Copy and paste this entire text** into the box:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

6. **Click "Save changes"**

✅ **Done!** Your website can now access the images.

---

## Test That It Works

### Option 1: Test in Browser
1. Open a new browser tab
2. Copy and paste this URL:
```
https://property237-media.s3.amazonaws.com/property_images/appartment_at_st_luke_street_buea.jpg
```
3. Press Enter
4. **You should see the image!** (Not an error page)

### Option 2: Check Your Website
1. Go to your Property237 website
2. Refresh the page (press F5)
3. **Images should now appear!**

---

## Troubleshooting

### "I can't find the Permissions tab"
- Make sure you clicked on your bucket name: `property237-media`
- You should see tabs: Objects, Properties, **Permissions**, Metrics, etc.

### "I get an error when saving"
- Make sure you copied the **entire** JSON text (including the curly braces `{}`)
- Check there are no extra spaces or characters

### "Images still don't show"
1. Wait 1-2 minutes (AWS needs time to apply changes)
2. Clear your browser cache: Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Try the direct image URL test above

### "I don't have AWS account access"
- You need the AWS account credentials that were used to create the `property237-media` bucket
- Check your email for AWS account setup or ask whoever set up your AWS account

---

## What You Just Did (Explanation)

- ✅ **Unblocked public access**: Told AWS it's OK for people to view files
- ✅ **Added bucket policy**: Created a rule that says "anyone can VIEW files" (but not delete or modify)
- ✅ **Setup CORS**: Told AWS to allow your website to load images from S3

**Security Note**: This setup is safe! Users can only:
- ✅ View/download images via direct URL
- ❌ Cannot upload files
- ❌ Cannot delete files
- ❌ Cannot see list of all files
- ❌ Cannot modify anything

This is the **standard setup** for websites with user-uploaded images (like Airbnb, Instagram, etc.)

---

## Need Help?

If you're stuck at any step:
1. Take a screenshot of what you see
2. Note which step number you're on
3. I can guide you through it

**After you complete these steps, ALL your images will display correctly on your website!** 🎉
