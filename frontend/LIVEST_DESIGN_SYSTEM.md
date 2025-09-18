# Livest Design System

**Enterprise Modular Design System — Version 1.0.0**

A comprehensive, token-driven design system built for Property237's real estate platform, emphasizing accessibility, theming capabilities, and developer experience.

## 🎯 Overview

The Livest Design System provides a cohesive set of design principles, components, and tools to ensure consistency across the Property237 platform while enabling rapid development and seamless user experiences.

### Key Features

- **Token-First Architecture**: All design decisions driven by structured design tokens
- **Runtime Theming**: Support for light, dark, and high-contrast themes
- **Accessibility-First**: WCAG 2.1 AA compliance built-in
- **TypeScript Ready**: Full type safety and excellent developer experience
- **Atomic Components**: Modular, composable component architecture
- **Storybook Documentation**: Comprehensive component documentation and examples

## 🚀 Quick Start

### Installation

```tsx
// Import the design system
import { Button, Input, Avatar } from '@/design-system';

// Use components with full TypeScript support
<Button variant="primary" size="lg" leftIcon={Search}>
  Find Properties
</Button>
```

### Theme Setup

```tsx
import { theme } from '@/design-system';

// Initialize theming system
theme.initTheme();

// Switch themes programmatically
theme.setTheme('dark');
theme.setTheme('light');
theme.setTheme('high-contrast');
```

## 🎨 Design Tokens

Our design system is built on a comprehensive token system that ensures consistency and enables runtime theming.

### Color System

```tsx
import { getColor, cssVar } from '@/design-system';

// Access token values directly
const brandColor = getColor.brand('500'); // #3B82F6

// Use CSS custom properties for runtime theming
const dynamicColor = cssVar.color.brand('500'); // var(--color-brand-500)
```

#### Brand Colors
- **Brand**: Primary blue scale (50-900)
- **Accent**: Complementary purple scale (50-900)
- **Neutral**: Grayscale system (50-900)

#### Semantic Colors
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Danger**: #EF4444 (Red 500)
- **Info**: #3B82F6 (Blue 500)

### Typography Scale

```tsx
import { getFontSize, fontFamily } from '@/design-system';

const headingSize = getFontSize('2xl'); // 1.5rem
const bodyFont = fontFamily.base; // 'Inter', sans-serif
```

### Spacing System

Based on 0.25rem (4px) increments for consistent spacing relationships.

```tsx
import { getSpacing } from '@/design-system';

const spacing = getSpacing('4'); // 1rem (16px)
```

## 🧱 Components

### Primitive Components

Foundation components that serve as building blocks:

#### Button
```tsx
import { Button } from '@/design-system';

// Variants: primary, secondary, tertiary, ghost, danger
<Button variant="primary" size="lg" leftIcon={Search}>
  Search Properties
</Button>

// Loading and disabled states
<Button loading disabled>Processing...</Button>

// Icon-only buttons
<IconButton icon={Search} aria-label="Search" />
```

#### Input
```tsx
import { Input, Textarea, Select } from '@/design-system';

// Text inputs with validation states
<Input
  label="Email Address"
  type="email"
  state="error"
  error="Please enter a valid email"
  leftIcon={Mail}
/>

// Textarea for longer content
<Textarea
  label="Property Description"
  rows={4}
  optional
/>

// Select dropdowns
<Select
  label="Property Type"
  options={propertyTypes}
  placeholder="Select type..."
/>
```

#### Avatar
```tsx
import { Avatar, AvatarGroup } from '@/design-system';

// User avatars with fallbacks
<Avatar
  src="/user.jpg"
  alt="John Doe"
  size="lg"
  status="online"
/>

// Avatar groups with overflow
<AvatarGroup
  avatars={teamMembers}
  max={3}
  size="md"
/>
```

#### Icon
```tsx
import { Icon } from '@/design-system';
import { Search, Heart } from 'lucide-react';

// Standardized icon wrapper
<Icon
  icon={Search}
  size="md"
  variant="brand"
  aria-label="Search properties"
/>
```

### Composite Components (Coming Soon)

Higher-level components built from primitives:

- **PropertyCard**: Property listing display
- **Modal**: Accessible dialog overlays
- **NavigationBar**: Main site navigation
- **StatsWidget**: Metric display cards
- **HeroSection**: Landing page headers

## 🌙 Theming

The design system supports comprehensive theming through CSS custom properties:

### Available Themes

1. **Light Theme** (Default)
2. **Dark Theme**
3. **High Contrast Theme** (Accessibility)

### Theme Implementation

```tsx
import { theme, cssVar } from '@/design-system';

// Automatic system preference detection
theme.initTheme();

// Manual theme switching
const switchTheme = () => {
  const current = theme.getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  theme.setTheme(next);
};

// Use theme-aware CSS variables
const styles = {
  backgroundColor: cssVar.color.surface.primary,
  color: cssVar.color.text.primary,
};
```

## ♿ Accessibility

Accessibility is built into every component:

- **ARIA Support**: Proper roles, labels, and descriptions
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Reader Compatibility**: Semantic markup
- **High Contrast Theme**: Enhanced visibility option
- **Reduced Motion Support**: Respects user preferences

### Accessibility Utilities

```tsx
import { a11y } from '@/design-system';

// Focus ring utility
<button className={a11y.focusRing}>
  Accessible Button
</button>

// Screen reader only content
<span className={a11y.visuallyHidden}>
  Additional context for screen readers
</span>
```

## 📱 Responsive Design

Built-in responsive patterns using our breakpoint system:

```tsx
import { mediaQuery } from '@/design-system';

// Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
const isLargeScreen = window.matchMedia(mediaQuery.lg).matches;
```

## 🛠 Development

### Storybook Documentation

Run Storybook to explore all components:

```bash
npm run storybook
```

### Development Workflow

1. **Design Tokens**: All visual properties start as tokens
2. **Primitive Components**: Build atomic components using tokens
3. **Composite Components**: Combine primitives for complex patterns
4. **Documentation**: Document in Storybook with examples
5. **Testing**: Accessibility and visual regression tests

### File Structure

```
src/
├── design/
│   ├── tokens.json          # Design token definitions
│   ├── tokens.ts            # TypeScript token utilities
│   └── themes/
│       └── variables.css    # CSS custom properties
├── components/
│   ├── primitives/          # Atomic components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   └── Icon.tsx
│   └── composite/           # Complex components
└── design-system/
    └── index.ts             # Main export file
```

## 🎯 Best Practices

### Component Usage

```tsx
// ✅ Good: Use semantic variants
<Button variant="primary">Save Changes</Button>
<Button variant="danger">Delete Account</Button>

// ❌ Avoid: Custom styling that breaks consistency
<Button className="bg-red-500 text-white">Delete</Button>

// ✅ Good: Use design system spacing
<div className="space-y-4">

// ❌ Avoid: Arbitrary spacing values
<div className="mt-[23px]">
```

### Theming

```tsx
// ✅ Good: Use CSS custom properties for theme-aware styles
const styles = {
  color: cssVar.color.text.primary,
  backgroundColor: cssVar.color.surface.elevated,
};

// ❌ Avoid: Hard-coded colors
const styles = {
  color: '#000000',
  backgroundColor: '#ffffff',
};
```

### Accessibility

```tsx
// ✅ Good: Proper ARIA labels
<Button leftIcon={Search} aria-label="Search properties">
  Search
</Button>

// ✅ Good: Semantic color variants
<Button variant="danger">Delete</Button>

// ❌ Avoid: Color-only information
<Button className="bg-red-500">Important Action</Button>
```

## 📈 Roadmap

### Phase 1: Foundation (Completed)
- [x] Design token system
- [x] CSS custom properties
- [x] Primitive components
- [x] TypeScript utilities

### Phase 2: Composition (In Progress)
- [ ] PropertyCard component
- [ ] Modal/Dialog system
- [ ] Navigation components
- [ ] Form compositions

### Phase 3: Advanced Features
- [ ] Animation system
- [ ] Advanced theming
- [ ] Component variants
- [ ] Performance optimizations

### Phase 4: Ecosystem
- [ ] Figma design kit
- [ ] CLI tools
- [ ] VS Code extensions
- [ ] Advanced documentation

## 🤝 Contributing

Please follow our component development guidelines:

1. **Token-First**: Use design tokens for all visual properties
2. **Accessibility**: Include ARIA attributes and keyboard support
3. **Documentation**: Add Storybook stories with examples
4. **TypeScript**: Provide full type definitions
5. **Testing**: Include accessibility and visual tests

## 📄 License

Property237 Internal Design System - All rights reserved.

---

*Built with ❤️ by the Property237 Design Team*