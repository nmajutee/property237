# 🚀 ImageKit Quick Start Checklist

## ⏰ Total Time: ~10 minutes

### ✅ Step 1: Create ImageKit Account (2 min)
1. Go to: https://imagekit.io/registration/
2. Sign up with email
3. Verify email
4. Complete welcome wizard

### ✅ Step 2: Get API Keys (1 min)
1. Go to: https://imagekit.io/dashboard/developer/api-keys
2. Copy these 3 values:
   - `Public Key`: pub_xxxxx...
   - `Private Key`: priv_xxxxx...
   - `URL Endpoint`: https://ik.imagekit.io/your_id

### ✅ Step 3: Add to Render (2 min)
1. Go to: https://dashboard.render.com/
2. Select your backend service
3. Go to "Environment" tab
4. Add these 3 variables:
   ```
   IMAGEKIT_PRIVATE_KEY=priv_xxxxx...
   IMAGEKIT_PUBLIC_KEY=pub_xxxxx...
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```
5. Click "Save Changes"
6. **Render will auto-redeploy** (wait 3-5 min)

### ✅ Step 4: Verify Deployment (2 min)
1. Wait for Render deployment to complete
2. Check Render logs for:
   ```
   ✓ ImageKit configured successfully!
   ```

### ✅ Step 5: Test Upload (3 min)
1. Go to your Property237 website
2. Create or edit a property
3. Upload an image
4. **Image should display immediately!** 🎉

### ✅ Step 6: Verify in ImageKit Dashboard
1. Go to: https://imagekit.io/dashboard/media-library
2. You should see your images in `/property237/property_images/`

---

## 🎯 What's Already Done

✅ Backend code deployed to GitHub  
✅ ImageKit SDK installed  
✅ Upload endpoints created  
✅ Storage backend configured  
✅ Django settings updated  

**You just need to:**
1. Get ImageKit API keys
2. Add to Render environment
3. Test!

---

## 📱 Next Steps for Frontend

Update your Next.js image upload code to use the new endpoint:

```typescript
// Upload property image
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/media/upload-property-media/`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData, // Contains the file
  }
);

const data = await response.json();
console.log('Image URL:', data.url); // ImageKit CDN URL
```

---

## 🐛 Troubleshooting

**If images don't upload:**
1. Check Render logs for errors
2. Verify API keys are correct (no extra spaces)
3. Check browser console for errors

**If images don't display:**
1. Check image URL starts with `https://ik.imagekit.io/`
2. Add `ik.imagekit.io` to Next.js image domains
3. Clear browser cache

---

## 📖 Full Documentation

See `IMAGEKIT_SETUP_GUIDE.md` for:
- Complete API reference
- Image transformation examples
- Client-side upload option
- Migration from AWS S3

---

## ⏰ Time Estimate

- **ImageKit setup**: 5 minutes
- **Testing**: 5 minutes
- **Frontend updates** (if needed): 10 minutes

**Total**: ~20 minutes to be fully operational!

**Good luck with your presentation! 🎤🚀**
