# Craftwork Grotesk Font Setup Guide

## Option 1: Download from Official Sources (Recommended)

### Step 1: Download the Font Files

**Craftwork Grotesk** is available from:

1. **Adobe Fonts** (Requires Adobe Creative Cloud subscription):
   - Visit: https://fonts.adobe.com/fonts/craftwork-grotesk
   - Activate the font in your Adobe account
   - Can use for web projects

2. **MyFonts** (Purchase):
   - Visit: https://www.myfonts.com/fonts/atipo/craftwork-grotesk/
   - Purchase the webfont license
   - Download the font files

3. **Free Alternative - Download Similar Fonts**:
   - **Satoshi** (Very similar): https://www.fontshare.com/fonts/satoshi
   - **General Sans** (Similar): https://www.fontshare.com/fonts/general-sans
   - **Cabinet Grotesk**: https://www.fontshare.com/fonts/cabinet-grotesk

---

## Option 2: Use Craftwork Grotesk from CDN (Quick Setup)

If you have access to the font files, you can host them locally. Otherwise, use these steps:

### Step 1: Download Font Files

1. Go to https://www.fontshare.com/fonts/satoshi (Free alternative)
2. Click "Download Family"
3. Extract the ZIP file
4. Copy the `.woff` and `.woff2` files to: `frontend/public/fonts/craftwork-grotesk/`

### Step 2: Place Font Files

Place these files in `frontend/public/fonts/craftwork-grotesk/`:
```
CraftworkGrotesk-Regular.woff2
CraftworkGrotesk-Regular.woff
CraftworkGrotesk-Medium.woff2
CraftworkGrotesk-Medium.woff
CraftworkGrotesk-SemiBold.woff2
CraftworkGrotesk-SemiBold.woff
CraftworkGrotesk-Bold.woff2
CraftworkGrotesk-Bold.woff
```

---

## Option 3: Use Local Font Files (After Download)

### Step 1: Update `frontend/src/app/layout.tsx`

Replace the current font import with local font:

```tsx
import localFont from 'next/font/local'
import { ClientThemeProvider } from "../design-system/ClientThemeProvider"
import "./globals.css"

// Load Craftwork Grotesk from local files
const craftworkGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/craftwork-grotesk/CraftworkGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/craftwork-grotesk/CraftworkGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/craftwork-grotesk/CraftworkGrotesk-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/craftwork-grotesk/CraftworkGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-craftwork-grotesk',
  display: 'swap',
})

export const metadata = {
  title: "Property237",
  description: "Your trusted property management platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={craftworkGrotesk.variable}>
      <body className={craftworkGrotesk.className}>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
}
```

### Step 2: Update `frontend/tailwind.config.js`

```js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-craftwork-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ff291b', // Red from design
          dark: '#171717',    // Black from design
        },
      },
    },
  },
  plugins: [],
}
```

---

## Option 4: Use CSS @font-face (Alternative)

### Step 1: Create `frontend/src/app/fonts.css`

```css
@font-face {
  font-family: 'Craftwork Grotesk';
  src: url('/fonts/craftwork-grotesk/CraftworkGrotesk-Regular.woff2') format('woff2'),
       url('/fonts/craftwork-grotesk/CraftworkGrotesk-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Craftwork Grotesk';
  src: url('/fonts/craftwork-grotesk/CraftworkGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/craftwork-grotesk/CraftworkGrotesk-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Craftwork Grotesk';
  src: url('/fonts/craftwork-grotesk/CraftworkGrotesk-SemiBold.woff2') format('woff2'),
       url('/fonts/craftwork-grotesk/CraftworkGrotesk-SemiBold.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Craftwork Grotesk';
  src: url('/fonts/craftwork-grotesk/CraftworkGrotesk-Bold.woff2') format('woff2'),
       url('/fonts/craftwork-grotesk/CraftworkGrotesk-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Step 2: Import in `frontend/src/app/layout.tsx`

```tsx
import "./fonts.css"
import "./globals.css"
```

### Step 3: Update Tailwind Config

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Craftwork Grotesk', 'system-ui', 'sans-serif'],
    },
  },
}
```

---

## Quick Start (Using Free Alternative - Satoshi)

**Best Free Alternative:** Use **Satoshi** font which is very similar and 100% free!

### Step 1: Download Satoshi
```bash
# Download from: https://www.fontshare.com/fonts/satoshi
# Or use this direct link:
curl -o satoshi.zip https://api.fontshare.com/v2/fonts/download/satoshi
unzip satoshi.zip -d frontend/public/fonts/satoshi
```

### Step 2: Update `layout.tsx`
```tsx
import localFont from 'next/font/local'

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/satoshi/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/satoshi/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/satoshi/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className={satoshi.className}>
        {children}
      </body>
    </html>
  )
}
```

---

## Final Steps

After setting up the font:

1. **Restart the development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

3. **Verify font is loaded** in DevTools → Network → Filter by "font"

---

## Recommended: Use Satoshi (Free, Almost Identical)

**Why Satoshi?**
- ✅ Free for commercial use
- ✅ Very similar to Craftwork Grotesk
- ✅ Modern geometric sans-serif
- ✅ Great for real estate websites
- ✅ No licensing issues

**Download:** https://www.fontshare.com/fonts/satoshi

---

## Need Help?

If you have Craftwork Grotesk font files:
1. Place them in `frontend/public/fonts/craftwork-grotesk/`
2. Follow **Option 3** above
3. Restart dev server

If you don't have the font files:
1. Download **Satoshi** from FontShare (free)
2. Follow **Quick Start** section
3. Enjoy the same modern look! 🎉
