# Property237 Design System

## Overview
A comprehensive, mobile-first design system for the Property237 real estate platform. This system provides reusable, modular, and responsive components optimized for the 80% of users accessing the platform via mobile devices.

## Architecture

### Component Library Structure
```
frontend/src/components/properties/
├── FilterSidebar.tsx          # Mobile overlay filter panel
├── PropertyCard.tsx            # Dual-mode property cards (grid/list)
├── PropertyGrid.tsx            # Container with loading/empty states
├── PropertyHeader.tsx          # Page header with controls
├── PriceFilterBar.tsx          # Price range filter
├── MapView.tsx                 # Map component placeholder
└── index.ts                    # Barrel exports
```

### Key Features
- **Mobile-First Design**: All components prioritize mobile experience
- **Responsive**: Adapts seamlessly across breakpoints (mobile, tablet, desktop)
- **Modular**: Each component has a single responsibility
- **Type-Safe**: Full TypeScript interfaces for all props
- **Reusable**: Components accept props for different contexts
- **Accessible**: Proper ARIA labels and keyboard navigation

## Components

### 1. FilterSidebar
**Purpose**: Comprehensive filter panel with mobile overlay support

**Props**:
- `rentalPeriod`: 'long-term' | 'short-term'
- `setRentalPeriod`: (period) => void
- `propertyTypes`: PropertyType[]
- `selectedType`: string
- `setSelectedType`: (type) => void
- `selectedBedrooms`: string[]
- `toggleBedroom`: (value) => void
- `selectedBathrooms`: string
- `setSelectedBathrooms`: (value) => void
- `searchTerm`: string
- `setSearchTerm`: (term) => void
- `onSearch`: () => void
- `onClearFilters`: () => void
- `isOpen`: boolean (mobile state)
- `onClose`: () => void

**Responsive Behavior**:
- **Mobile**: Fixed overlay (`fixed inset-0`), close button, backdrop
- **Desktop**: Static sidebar (`w-72`), always visible

**Features**:
- Rental period selection (radio buttons)
- Property type checkboxes (scrollable)
- Bedroom selection (4-button grid)
- Bathroom dropdown (select)
- View type (radio buttons)
- Location search (text input with icon)
- Search button
- Clear filters button

### 2. PropertyCard
**Purpose**: Display individual property with grid/list view modes

**Props**:
- `property`: Property object
- `viewMode`: 'grid' | 'list'

**Responsive Behavior**:
- **Grid Mode**: Vertical card, h-56 image, hover scale
- **List Mode**:
  - Mobile: Vertical layout (`flex-col`)
  - Desktop: Horizontal layout (`sm:flex-row`), w-72 image

**Features**:
- Primary image or fallback icon
- Favorite heart button (top-right)
- Property type badge (bottom-left on image)
- Title, location, beds/baths, price
- Status badge
- Link to property detail page
- Hover effects (scale, color transitions)

### 3. PropertyGrid
**Purpose**: Container for property cards with loading/empty states

**Props**:
- `properties`: Property[]
- `loading`: boolean
- `viewMode`: 'grid' | 'list'
- `onClearFilters`: () => void

**Responsive Grid**:
- Mobile: 1 column (`grid-cols-1`)
- Tablet: 2 columns (`md:grid-cols-2`)
- Desktop: 3 columns (`xl:grid-cols-3`)

**States**:
- **Loading**: 6 skeleton cards with pulse animation
- **Empty**: Icon, message, "Clear Filters" button
- **Data**: Maps PropertyCard components

### 4. PropertyHeader
**Purpose**: Sticky header with title, controls, and mobile filter toggle

**Props**:
- `title`: string
- `resultsCount`: number
- `showMap`: boolean
- `setShowMap`: (show) => void
- `viewMode`: 'grid' | 'list'
- `setViewMode`: (mode) => void
- `onOpenFilters`: () => void (mobile only)

**Responsive Behavior**:
- **Mobile**:
  - Hamburger icon for filters (`md:hidden`)
  - Vertical layout (`flex-col`)
  - Smaller text (`text-lg`)
- **Desktop**:
  - Horizontal layout (`sm:flex-row`)
  - Larger text (`sm:text-xl`)
  - No filter button

**Features**:
- Title and results count
- Map toggle button
- Grid/List view toggle
- Sort dropdown
- Sticky positioning (`sticky top-0 z-10`)

### 5. PriceFilterBar
**Purpose**: Horizontal price range filter

**Props**:
- `priceRange`: { min: string, max: string }
- `setPriceRange`: (range) => void

**Responsive Behavior**:
- **Mobile**: Full-width inputs, `flex-wrap`
- **Desktop**: `max-w-md`, side-by-side inputs

**Features**:
- Min/Max number inputs
- Responsive sizing (`w-full sm:w-28`)
- Proper spacing (`gap-2 sm:gap-4`)

### 6. MapView
**Purpose**: Map placeholder with responsive height

**Props**:
- `show`: boolean
- `height`?: string (default: 'h-64 sm:h-80 md:h-96')

**Responsive Behavior**:
- Mobile: `h-64`
- Tablet: `h-80`
- Desktop: `h-96`

**Features**:
- Conditional rendering
- Placeholder with icon and message
- `flex-shrink-0` for scroll context

## Usage Example

```typescript
import {
  FilterSidebar,
  PropertyGrid,
  PropertyHeader,
  PriceFilterBar,
  MapView
} from '@/components/properties'

export default function PropertiesPage() {
  // State management
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  // ... other states

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <FilterSidebar
        {...filterProps}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <MapView show={showMap} />

        <PropertyHeader
          {...headerProps}
          onOpenFilters={() => setIsMobileFilterOpen(true)}
        />

        <PriceFilterBar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <div className="p-4 sm:p-6">
          <PropertyGrid
            properties={properties}
            loading={loading}
            viewMode={viewMode}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
    </div>
  )
}
```

## Responsive Breakpoints

### Tailwind Breakpoints Used
- `sm:` - 640px (tablets)
- `md:` - 768px (small laptops)
- `lg:` - 1024px (desktops)
- `xl:` - 1280px (large desktops)

### Mobile-First Approach
All components start with mobile styles and progressively enhance for larger screens:

```css
/* Mobile first (default) */
.component { padding: 1rem; }

/* Tablet */
@media (min-width: 640px) {
  .component { padding: 1.5rem; }
}

/* Desktop */
@media (min-width: 768px) {
  .component { padding: 2rem; }
}
```

## Typography System

### Font Families
- **Headings**: Craftwork Grotesk (`.font-heading`)
- **Body**: DM Sans (`.font-body`)

### Font Sizes
- Mobile: Smaller sizes (`text-sm`, `text-base`)
- Desktop: Larger sizes (`sm:text-lg`, `sm:text-xl`)

### Font Weights
- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)

## Color System

### Primary Colors
- `property237-primary`: Brand primary color
- Applied to: Buttons, badges, active states, hover effects

### Dark Mode Support
All components support dark mode with proper color variants:
- `dark:bg-gray-800` - Dark backgrounds
- `dark:text-white` - Dark mode text
- `dark:border-gray-700` - Dark borders

## Spacing System

### Padding
- Mobile: `p-4` (1rem)
- Desktop: `sm:p-6` (1.5rem)

### Gaps
- Mobile: `gap-2` (0.5rem)
- Desktop: `sm:gap-4` (1rem)

### Margins
- Consistent use of Tailwind's spacing scale (4px increments)

## Performance Optimizations

### Code Splitting
- Barrel exports enable tree-shaking
- Each component can be imported independently

### Image Optimization
- Next.js Image component for automatic optimization
- Lazy loading with fallback icons

### Animation Performance
- GPU-accelerated transforms (`scale`, `translate`)
- `transition-transform` for smooth effects

## Benefits

### Before (Monolithic)
- ❌ 516 lines in single file
- ❌ Hard to maintain
- ❌ No reusability
- ❌ Difficult to test
- ❌ Props drilling
- ❌ Not optimized for mobile

### After (Design System)
- ✅ 251 lines in main page
- ✅ 6 reusable components
- ✅ ~40% code reduction
- ✅ Mobile-first responsive
- ✅ Easy to test individually
- ✅ Scalable architecture
- ✅ Clean barrel exports
- ✅ Full TypeScript support

## Next Steps

### Expansion
1. Create similar component libraries for:
   - Dashboard components
   - Profile components
   - Favorites components
   - Admin components

2. Add more features:
   - PropertyCard favorite persistence
   - MapView integration (Google Maps/Mapbox)
   - PropertyGrid pagination
   - FilterSidebar saved filters

3. Testing:
   - Unit tests for each component
   - Integration tests for page composition
   - E2E tests for user flows

### Documentation
- Storybook integration for component documentation
- Visual regression testing
- Accessibility audits

## Maintenance

### Adding New Components
1. Create component file in `components/properties/`
2. Add TypeScript interfaces for props
3. Implement mobile-first responsive design
4. Add to `index.ts` barrel export
5. Update this documentation

### Updating Existing Components
1. Update component file
2. Check TypeScript compilation
3. Test responsive behavior
4. Update documentation if props changed
5. Test on mobile devices

## Support

For questions or issues related to the design system:
1. Check this documentation
2. Review component source code
3. Test in browser DevTools (mobile viewport)
4. Verify TypeScript interfaces

---

**Version**: 1.0.0
**Last Updated**: 2024
**Maintainer**: Property237 Development Team
