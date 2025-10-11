# Property237 Font Integration Guide

## Current Setup: Work Sans (FREE Alternative to Craftwork Grotesk)

We've integrated **Work Sans** - a modern geometric sans-serif font that closely matches the Craftwork Grotesk style from your design reference.

### ✅ What's Been Updated:

1. **`frontend/src/app/layout.tsx`**
   - Added Work Sans font from Google Fonts
   - Configured with weights: 300, 400, 500, 600, 700, 800
   - Applied to the entire app

2. **`frontend/tailwind.config.js`**
   - Updated all font families to use Work Sans
   - Updated brand colors to match your design:
     - Primary: `#ff291b` (red accent)
     - Dark: `#171717` (black)
     - Light: `#f9f9fa` (off-white)

---

## Option 1: Work Sans (Current - FREE) ✅

**Pros:**
- ✅ FREE - No licensing costs
- ✅ Google Fonts - Fast CDN delivery
- ✅ Next.js optimized with `next/font`
- ✅ Similar geometric style to Craftwork Grotesk
- ✅ Excellent readability
- ✅ Full weight range (300-800)

**Already Installed!** Ready to use.

---

## Option 2: Craftwork Grotesk (Premium - PAID)

If you have a Craftwork Grotesk license, here's how to integrate it:

### Step 1: Add Font Files

1. Get your Craftwork Grotesk font files (.woff2, .woff)
2. Create folder: `frontend/public/fonts/craftwork-grotesk/`
3. Add your font files:
   ```
   frontend/public/fonts/craftwork-grotesk/
   ├── CraftworkGrotesk-Light.woff2
   ├── CraftworkGrotesk-Regular.woff2
   ├── CraftworkGrotesk-Medium.woff2
   ├── CraftworkGrotesk-SemiBold.woff2
   ├── CraftworkGrotesk-Bold.woff2
   └── CraftworkGrotesk-ExtraBold.woff2
   ```

### Step 2: Update `layout.tsx`

```tsx
import { ClientThemeProvider } from "../design-system/ClientThemeProvider"
import localFont from 'next/font/local'
import "./globals.css"

// Load Craftwork Grotesk (local files)
const craftworkGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/craftwork-grotesk/CraftworkGrotesk-Light.woff2',
      weight: '300',
      style: 'normal',
    },
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
    {
      path: '../../public/fonts/craftwork-grotesk/CraftworkGrotesk-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-craftwork',
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

### Step 3: Update `tailwind.config.js`

```javascript
fontFamily: {
  'display': ['var(--font-craftwork)', 'Craftwork Grotesk', 'system-ui', 'sans-serif'],
  'sans': ['var(--font-craftwork)', 'Craftwork Grotesk', 'system-ui', 'sans-serif'],
  'heading': ['var(--font-craftwork)', 'Craftwork Grotesk', 'system-ui', 'sans-serif'],
  'body': ['var(--font-craftwork)', 'Craftwork Grotesk', 'system-ui', 'sans-serif'],
},
```

---

## Option 3: Inter (Google Fonts Alternative)

Another excellent FREE alternative with similar modern aesthetic:

### Update `layout.tsx`:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})
```

### Update `tailwind.config.js`:

```javascript
fontFamily: {
  'display': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  'sans': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  // ...
},
```

---

## Option 4: DM Sans (Google Fonts Alternative)

Geometric sans-serif with excellent readability:

### Update `layout.tsx`:

```tsx
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})
```

---

## Color Scheme (From Your Design)

Already applied to `tailwind.config.js`:

```javascript
colors: {
  'property237-primary': '#ff291b',    // Red accent
  'property237-dark': '#171717',       // Black background
  'property237-light': '#f9f9fa',      // Light background
}
```

### Usage in components:

```tsx
<div className="bg-property237-light text-property237-dark">
  <h1 className="font-display font-bold text-4xl">
    Real estate for living and investments
  </h1>
  <button className="bg-property237-primary text-white">
    Request a tour
  </button>
</div>
```

---

## Testing Your New Font

### 1. Start development server:
```bash
cd frontend
npm run dev
```

### 2. Check the browser:
- Open http://localhost:3000
- Inspect any text element
- Font family should show "Work Sans" (or your chosen font)

### 3. Font weights available:
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)

---

## Recommendation

**For now: Stick with Work Sans (Option 1)** ✅

It's:
- Already integrated
- FREE to use
- Performs excellently
- Very similar to Craftwork Grotesk
- No licensing concerns

If you later acquire Craftwork Grotesk license, switching is easy with Option 2!

---

## Need to Deploy?

After you're happy with the font, commit and push:

```bash
git add frontend/src/app/layout.tsx frontend/tailwind.config.js
git commit -m "feat: Update font to Work Sans with modern color scheme"
git push origin main
```

Vercel will automatically rebuild the frontend with the new font!

---

## Questions?

- **Q: Can I use multiple fonts?**
  A: Yes! You can have different fonts for headings vs body text.

- **Q: Does this affect performance?**
  A: Next.js optimizes Google Fonts automatically. Work Sans loads fast!

- **Q: Can I customize font weights?**
  A: Yes! Edit the `weight` array in `layout.tsx`.

**Your Property237 frontend now has that premium, modern look!** 🎨✨
