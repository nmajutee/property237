# 🎨 Property237 Typography System

## Fonts from Design Reference

Based on the Estately design, we're using a **dual-font system**:

### 1. **Craftwork Grotesk** (Headings & UI)
- **Use for:** Headings, titles, navigation, buttons, labels
- **Style:** Geometric, modern, bold
- **Tailwind classes:** `font-display`, `font-heading`

### 2. **DM Sans** (Body Text)
- **Use for:** Body text, descriptions, paragraphs, small text
- **Style:** Humanist, readable, friendly
- **Tailwind classes:** `font-sans`, `font-body`

---

## ✅ Font Setup Complete

### What's Configured:

**`frontend/src/app/layout.tsx`:**
- ✅ Craftwork Grotesk loaded from local `.ttf` files
- ✅ DM Sans loaded from Google Fonts
- ✅ Both fonts available as CSS variables

**`frontend/tailwind.config.js`:**
- ✅ `font-display` → Craftwork Grotesk
- ✅ `font-heading` → Craftwork Grotesk
- ✅ `font-sans` → DM Sans (body default)
- ✅ `font-body` → DM Sans

---

## Usage Examples

### Headings (Use Craftwork Grotesk)

```tsx
// Main title
<h1 className="font-display text-5xl font-bold">
  Real estate for living and investments
</h1>

// Section heading
<h2 className="font-heading text-3xl font-semibold">
  Featured Properties
</h2>

// Card title
<h3 className="font-display text-xl font-bold">
  201 Prague Dr, San Jose
</h3>
```

### Body Text (Use DM Sans)

```tsx
// Paragraph text
<p className="font-body text-base">
  This beautiful property features modern amenities and stunning views...
</p>

// Description
<div className="font-sans text-sm text-gray-600">
  4 beds • 3 baths • 1,868 sqft
</div>
```

### Buttons (Use Craftwork Grotesk)

```tsx
// Primary button
<button className="font-display font-semibold text-sm">
  Request a tour
</button>

// Secondary button
<button className="font-heading font-medium text-base">
  Split options →
</button>
```

### Navigation (Use Craftwork Grotesk)

```tsx
// Nav links
<nav className="font-display font-medium text-sm">
  <a href="/condos">Condos</a>
  <a href="/houses">Houses</a>
  <a href="/commercial">Commercial</a>
</nav>
```

### Property Cards

```tsx
<div className="property-card">
  {/* Title - Craftwork Grotesk */}
  <h3 className="font-display text-xl font-bold mb-2">
    Luxury 3-Bedroom Penthouse
  </h3>
  
  {/* Stats - Craftwork Grotesk */}
  <div className="font-heading text-sm font-medium mb-3">
    3 beds • 3 baths • 180 m²
  </div>
  
  {/* Description - DM Sans */}
  <p className="font-body text-sm text-gray-700 leading-relaxed">
    Stunning penthouse apartment with panoramic city views. 
    Features include marble flooring throughout, Italian designer kitchen...
  </p>
  
  {/* Price - Craftwork Grotesk */}
  <div className="font-display text-2xl font-bold mt-4">
    450,000 XAF/month
  </div>
  
  {/* Button - Craftwork Grotesk */}
  <button className="font-display font-semibold text-sm bg-property237-primary text-white">
    View Details
  </button>
</div>
```

---

## Font Weights Available

### Craftwork Grotesk:
- `font-normal` (400) - Regular
- `font-medium` (500) - Medium
- `font-semibold` (600) - SemiBold
- `font-bold` (700) - Bold
- `font-extrabold` (800) - Heavy

### DM Sans:
- `font-normal` (400) - Regular
- `font-medium` (500) - Medium
- `font-semibold` (600) - SemiBold
- `font-bold` (700) - Bold

---

## Typography Scale (Matching Design)

```tsx
// Display (Hero titles)
text-6xl → 3.75rem (60px)
text-5xl → 3rem (48px)

// Headings
text-4xl → 2.25rem (36px)
text-3xl → 1.875rem (30px)
text-2xl → 1.5rem (24px)
text-xl → 1.25rem (20px)

// Body
text-lg → 1.125rem (18px)
text-base → 1rem (16px)
text-sm → 0.875rem (14px)
text-xs → 0.75rem (12px)
```

---

## Color Scheme (from Design)

```tsx
// Primary colors
bg-property237-primary → #ff291b (Red accent)
bg-property237-dark → #171717 (Black)
bg-property237-light → #f9f9fa (Light background)

// Text colors
text-gray-900 → Dark text (on light bg)
text-white → Light text (on dark bg)
text-gray-600 → Secondary text
```

---

## Complete Component Example

```tsx
export default function HeroSection() {
  return (
    <section className="bg-property237-light py-20">
      <div className="container mx-auto px-6">
        {/* Title - Craftwork Grotesk */}
        <h1 className="font-display text-5xl font-bold text-property237-dark mb-4">
          Real estate for living and investments
        </h1>
        
        {/* Description - DM Sans */}
        <p className="font-body text-lg text-gray-700 max-w-2xl mb-8">
          Discover your dream property in Cameroon. From luxury apartments 
          to commercial spaces, find the perfect space that fits your lifestyle.
        </p>
        
        {/* CTA Button - Craftwork Grotesk */}
        <button className="font-display font-semibold text-sm px-8 py-4 bg-property237-primary text-white rounded-full hover:bg-red-700 transition">
          Browse Properties
        </button>
      </div>
    </section>
  )
}
```

---

## Testing Fonts

### 1. Start dev server:
```bash
cd frontend
npm run dev
```

### 2. Open browser DevTools:
- Right-click any text → Inspect
- Check Computed → font-family
- Should see:
  - Headings: "Craftwork Grotesk"
  - Body: "DM Sans"

### 3. Font loading verification:
- DevTools → Network → Filter by "font"
- Should see Craftwork Grotesk .ttf files loading
- Should see DM Sans from Google Fonts

---

## Quick Reference

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Hero title | Craftwork Grotesk | Bold (700) | 48-60px |
| Section heading | Craftwork Grotesk | SemiBold (600) | 30-36px |
| Card title | Craftwork Grotesk | Bold (700) | 20-24px |
| Body text | DM Sans | Regular (400) | 16px |
| Description | DM Sans | Regular (400) | 14px |
| Button | Craftwork Grotesk | SemiBold (600) | 14px |
| Nav link | Craftwork Grotesk | Medium (500) | 14px |
| Stats/Labels | Craftwork Grotesk | Medium (500) | 14px |

---

## Commit & Deploy

```bash
# Add font changes
git add frontend/src/app/layout.tsx frontend/tailwind.config.js

# Commit
git commit -m "feat: Add Craftwork Grotesk + DM Sans typography system"

# Push to deploy
git push origin main
```

Vercel will automatically rebuild with the new fonts! 🚀

---

## Pro Tips

1. **Use Craftwork Grotesk for:**
   - Anything that needs to stand out
   - Numbers, prices, stats
   - Buttons and CTAs
   - Navigation and labels

2. **Use DM Sans for:**
   - Long-form content
   - Descriptions and details
   - Anything that needs to be read easily

3. **Font pairing:**
   - The geometric Craftwork Grotesk + humanist DM Sans creates perfect contrast
   - Matches the design reference exactly
   - Professional, modern, and readable

**Your Property237 frontend now matches that premium real estate aesthetic!** ✨
