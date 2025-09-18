import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavigationBar } from './NavigationBar'
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline'

const meta: Meta<typeof NavigationBar> = {
  title: 'Composite/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The NavigationBar component provides a comprehensive navigation solution with:

- **Responsive Design**: Adapts to mobile, tablet, and desktop viewports
- **Brand/Logo Area**: Customizable branding section with logo support
- **Navigation Links**: Primary navigation with icons and badge support
- **Search Integration**: Built-in search functionality (desktop and mobile)
- **User Management**: User dropdown with avatar and menu items
- **Notifications**: Notification bell with count badge
- **Theme Toggle**: Optional dark/light mode switching with sun/moon icons
- **Mobile Menu**: Collapsible hamburger menu for mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

## Features

### Navigation Items
- Icon support with Heroicons
- Active state indicators
- Badge/notification counts
- Responsive behavior

### Theme Management
- Optional theme toggle button
- Desktop: Icon-only button in toolbar
- Mobile: Full-width button with text in menu
- Customizable theme state and handler

### User Experience
- Click outside to close dropdowns
- Keyboard navigation support
- Smooth animations and transitions
- Dark mode compatibility

### Customization
- Configurable brand/logo
- Custom navigation items
- User menu customization
- Search placeholder and handler
        `
      }
    }
  },
  argTypes: {
    brand: {
      control: 'object',
      description: 'Brand/logo configuration'
    },
    navItems: {
      control: 'object',
      description: 'Primary navigation items'
    },
    user: {
      control: 'object',
      description: 'User information for avatar and dropdown'
    },
    userMenuItems: {
      control: 'object',
      description: 'User dropdown menu items'
    },
    search: {
      control: 'object',
      description: 'Search configuration'
    },
    notificationCount: {
      control: { type: 'number', min: 0, max: 999 },
      description: 'Number of unread notifications'
    },
    onNotificationClick: {
      action: 'notification-clicked',
      description: 'Notification bell click handler'
    },
    showThemeToggle: {
      control: 'boolean',
      description: 'Show/hide theme toggle button'
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Current theme state (affects icon shown)'
    },
    onThemeToggle: {
      action: 'theme-toggled',
      description: 'Theme toggle click handler'
    },
    isMobileMenuOpen: {
      control: 'boolean',
      description: 'External mobile menu state control'
    },
    onMobileMenuToggle: {
      action: 'mobile-menu-toggled',
      description: 'Mobile menu toggle handler'
    }
  }
}

export default meta
type Story = StoryObj<typeof NavigationBar>

// Default navigation items for stories
const defaultNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: HomeIcon, active: true },
  { label: 'Properties', href: '/properties', icon: BuildingOfficeIcon, badge: 3 },
  { label: 'Tenants', href: '/tenants', icon: UsersIcon },
  { label: 'Reports', href: '/reports', icon: ChartBarIcon },
  { label: 'Settings', href: '/settings', icon: CogIcon }
]

// Default user menu items
const defaultUserMenuItems = [
  { label: 'Profile Settings', href: '/profile', icon: UserCircleIcon },
  { label: 'Account Settings', href: '/settings', icon: Cog6ToothIcon },
  { label: 'Documentation', href: '/docs', icon: DocumentTextIcon },
  { label: 'Sign Out', onClick: () => alert('Signing out...'), icon: ArrowRightOnRectangleIcon, variant: 'danger' as const }
]

// Default user information
const defaultUser = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@property237.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7f3?w=150&h=150&fit=crop&crop=face'
}

// Basic NavigationBar Story
export const Default: Story = {
  args: {
    brand: { name: 'Property237', href: '/' },
    navItems: defaultNavItems,
    user: defaultUser,
    userMenuItems: defaultUserMenuItems,
    search: {
      placeholder: 'Search properties, tenants...',
      onSearch: (query: string) => console.log('Searching for:', query)
    },
    notificationCount: 5,
    onNotificationClick: () => console.log('Notifications clicked')
  }
}

// With Custom Brand Logo
export const WithLogo: Story = {
  args: {
    ...Default.args,
    brand: {
      name: 'Property237',
      href: '/',
      logo: 'https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=P237'
    }
  }
}

// Minimal Navigation
export const Minimal: Story = {
  args: {
    brand: { name: 'Property Portal', href: '/' },
    navItems: [
      { label: 'Home', href: '/', icon: HomeIcon, active: true },
      { label: 'Properties', href: '/properties', icon: BuildingOfficeIcon }
    ],
    user: { name: 'John Doe', email: 'john@example.com' },
    userMenuItems: [
      { label: 'Profile', href: '/profile', icon: UserCircleIcon },
      { label: 'Sign Out', onClick: () => {}, icon: ArrowRightOnRectangleIcon, variant: 'danger' }
    ]
  }
}

// With Many Notifications
export const HighNotificationCount: Story = {
  args: {
    ...Default.args,
    notificationCount: 99
  }
}

// Extreme Notification Count
export const ExtremeNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 1234
  }
}

// No Search Bar
export const WithoutSearch: Story = {
  args: {
    ...Default.args,
    search: undefined
  }
}

// Disabled Search
export const DisabledSearch: Story = {
  args: {
    ...Default.args,
    search: {
      placeholder: 'Search is currently disabled',
      disabled: true
    }
  }
}

// No Notifications
export const NoNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 0
  }
}

// Long Brand Name
export const LongBrandName: Story = {
  args: {
    ...Default.args,
    brand: {
      name: 'Property Management Solutions Enterprise',
      href: '/'
    }
  }
}

// Many Navigation Items
export const ManyNavItems: Story = {
  args: {
    ...Default.args,
    navItems: [
      { label: 'Dashboard', href: '/dashboard', icon: HomeIcon, active: true },
      { label: 'Properties', href: '/properties', icon: BuildingOfficeIcon, badge: 3 },
      { label: 'Tenants', href: '/tenants', icon: UsersIcon, badge: 1 },
      { label: 'Maintenance', href: '/maintenance', icon: CogIcon, badge: 7 },
      { label: 'Reports', href: '/reports', icon: ChartBarIcon },
      { label: 'Documents', href: '/documents', icon: DocumentTextIcon },
      { label: 'Settings', href: '/settings', icon: Cog6ToothIcon }
    ]
  }
}

// User Without Avatar
export const UserWithoutAvatar: Story = {
  args: {
    ...Default.args,
    user: {
      name: 'Alex Smith',
      email: 'alex.smith@company.com'
      // No avatar provided - will show initials
    }
  }
}

// Mobile Menu Controlled Externally
export const ExternallyControlledMobileMenu: Story = {
  args: {
    ...Default.args,
    isMobileMenuOpen: true,
    onMobileMenuToggle: (isOpen: boolean) => console.log('Mobile menu toggled:', isOpen)
  }
}

// Dark Mode Preview (requires manual theme toggle in Storybook)
export const DarkModeExample: Story = {
  args: Default.args,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'The NavigationBar automatically adapts to dark mode when the dark theme is applied to the document root.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <div className="bg-gray-900 min-h-screen">
          <Story />
        </div>
      </div>
    )
  ]
}

// Accessibility Demo
export const AccessibilityDemo: Story = {
  args: Default.args,
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features Demonstrated:

1. **Keyboard Navigation**: All interactive elements are focusable and keyboard accessible
2. **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
3. **Focus Management**: Visible focus indicators and logical tab order
4. **High Contrast**: Compatible with high contrast mode and color accessibility
5. **Mobile Touch Targets**: All buttons meet minimum touch target size requirements

Try navigating this example using only the keyboard (Tab, Enter, Escape keys).
        `
      }
    }
  }
}

// Interactive Playground
export const Playground: Story = {
  args: {
    brand: { name: 'Property237', href: '/' },
    navItems: defaultNavItems,
    user: defaultUser,
    userMenuItems: defaultUserMenuItems,
    search: {
      placeholder: 'Search anything...',
      onSearch: (query: string) => alert(`Searching for: ${query}`)
    },
    notificationCount: 3,
    onNotificationClick: () => alert('Opening notifications panel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls panel to experiment with different NavigationBar configurations and see how they affect the component behavior.'
      }
    }
  }
}

// Theme Toggle Story
export const WithThemeToggle: Story = {
  args: {
    brand: { name: 'Property237', href: '/' },
    navItems: defaultNavItems,
    user: defaultUser,
    userMenuItems: defaultUserMenuItems,
    search: {
      placeholder: 'Search properties...',
      onSearch: (query: string) => alert(`Searching for: ${query}`)
    },
    notificationCount: 5,
    onNotificationClick: () => alert('Opening notifications panel'),
    showThemeToggle: true,
    isDarkMode: false,
    onThemeToggle: () => alert('Theme toggle clicked! In a real app, this would switch themes.')
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationBar with theme toggle functionality enabled. The toggle appears in both desktop (icon only) and mobile (with text) versions. Click the sun/moon icon to switch themes.'
      }
    }
  }
}

// Dark Mode with Theme Toggle
export const DarkModeWithThemeToggle: Story = {
  args: {
    brand: { name: 'Property237', href: '/' },
    navItems: defaultNavItems,
    user: defaultUser,
    userMenuItems: defaultUserMenuItems,
    search: {
      placeholder: 'Search properties...',
      onSearch: (query: string) => alert(`Searching for: ${query}`)
    },
    notificationCount: 2,
    onNotificationClick: () => alert('Opening notifications panel'),
    showThemeToggle: true,
    isDarkMode: true,
    onThemeToggle: () => alert('Switching to light mode!')
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationBar in dark mode with theme toggle showing the sun icon (for switching to light mode). This demonstrates how the toggle adapts based on the current theme state.'
      }
    }
  }
}