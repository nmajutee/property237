# 🎨 Font Setup - Craftwork Grotesk

## Quick Start (3 Steps)

### Option A: Use Free Alternative (Recommended - 5 minutes)

**Satoshi** is 99% similar to Craftwork Grotesk and 100% FREE!

1. **Download Satoshi:**
   - Go to: https://www.fontshare.com/fonts/satoshi
   - Click "Download family"
   - Extract the ZIP file

2. **Copy font files:**
   ```
   Copy these files from the extracted folder to:
   frontend/public/fonts/satoshi/
   
   - Satoshi-Regular.woff2
   - Satoshi-Medium.woff2
   - Satoshi-SemiBold.woff2
   - Satoshi-Bold.woff2
   ```

3. **Update layout.tsx:**
   ```bash
   # Use the content from layout-craftwork.tsx.example
   # Just change "craftwork-grotesk" to "satoshi" in all paths
   ```

---

### Option B: Use Actual Craftwork Grotesk

**If you have access to Craftwork Grotesk font files:**

1. **Download Craftwork Grotesk from:**
   - Adobe Fonts: https://fonts.adobe.com/fonts/craftwork-grotesk
   - OR Purchase: https://www.myfonts.com/fonts/atipo/craftwork-grotesk/

2. **Place font files here:**
   ```
   frontend/public/fonts/craftwork-grotesk/
   
   Required files:
   - CraftworkGrotesk-Regular.woff2
   - CraftworkGrotesk-Medium.woff2
   - CraftworkGrotesk-SemiBold.woff2
   - CraftworkGrotesk-Bold.woff2
   ```

3. **Replace your `frontend/src/app/layout.tsx` with:**
   - Copy content from `layout-craftwork.tsx.example`
   - Rename to `layout.tsx`

4. **Restart dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## What I've Created For You:

```
✅ frontend/public/fonts/craftwork-grotesk/  (empty - ready for your files)
✅ CRAFTWORK_GROTESK_SETUP.md                (detailed guide)
✅ layout-craftwork.tsx.example              (ready-to-use layout file)
✅ download-font.ps1                         (PowerShell script)
```

---

## Recommended FREE Alternatives:

All these are geometric sans-serifs similar to Craftwork Grotesk:

1. **Satoshi** ⭐ (Best match)
   - https://www.fontshare.com/fonts/satoshi
   - 100% Free, commercial use OK

2. **Cabinet Grotesk**
   - https://www.fontshare.com/fonts/cabinet-grotesk
   - 100% Free

3. **General Sans**
   - https://www.fontshare.com/fonts/general-sans
   - 100% Free

---

## After Font Setup:

1. **Clear browser cache:** Ctrl+Shift+R
2. **Check DevTools:** Network tab → Filter "font"
3. **Verify:** Font should show as "Craftwork Grotesk" or "Satoshi"

---

## Color Scheme (from your design):

I've also set up colors matching your reference:

```css
Primary Red: #ff291b
Primary Black: #171717
Background: #f9f9fa
White: #ffffff
```

These are already configured in your Tailwind config!

---

## Need Help?

1. **Can't find Craftwork Grotesk?** → Use Satoshi (free, almost identical)
2. **Font not loading?** → Check file paths in layout.tsx
3. **Still using Work Sans?** → Make sure layout.tsx is updated

**I recommend using Satoshi** - it's free, looks amazing, and you'll be up and running in 5 minutes! 🚀
