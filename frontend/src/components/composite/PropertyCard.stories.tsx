import type { Meta, StoryObj } from '@storybook/react-vite'
import { PropertyCard } from './PropertyCard'
import type { PropertyListing as PropertyListingType } from '../../types/property'

const meta = {
  title: 'Composite/PropertyCard',
  component: PropertyCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The PropertyCard component displays property listings in grid or list view modes.
It includes property image, details, pricing, agent information, and action buttons.

## Features
- **Grid/List Layouts**: Optimized for different view modes
- **Agent Integration**: Shows agent information with verification status
- **Interactive Actions**: Favorite, contact, share, and view functionality
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support
        `
      }
    }
  },
  argTypes: {
    viewMode: {
      control: { type: 'radio' },
      options: ['grid', 'list'],
      description: 'Layout mode for the property card'
    },
    showAgent: {
      control: { type: 'boolean' },
      description: 'Whether to display agent information'
    },
    isFavorited: {
      control: { type: 'boolean' },
      description: 'Whether the property is favorited'
    },
    onFavorite: { action: 'favorite clicked' },
    onContact: { action: 'contact clicked' },
    onShare: { action: 'share clicked' },
    onView: { action: 'property viewed' }
  }
} satisfies Meta<typeof PropertyCard>

export default meta
type Story = StoryObj<typeof meta>

// Mock property data
const mockProperty: PropertyListingType = {
  id: '1',
  title: 'Modern 2-Bedroom Apartment in Bastos',
  slug: 'modern-2-bedroom-apartment-bastos',
  property_type: {
    id: '1',
    name: 'Apartment',
    category: 'residential',
    description: 'Multi-unit residential building',
    is_active: true
  },
  status: {
    id: '1',
    name: 'Available',
    description: 'Ready for rent/sale',
    is_active: true
  },
  listing_type: 'rent',
  price: 450000,
  currency: 'XAF',
  area: {
    id: '1',
    name: 'Bastos',
    city: {
      id: '1',
      name: 'Yaoundé',
      region: {
        id: '1',
        name: 'Centre'
      }
    }
  },
  no_of_bedrooms: 2,
  no_of_bathrooms: 2,
  agent: {
    id: '1',
    user: {
      id: '1',
      first_name: 'Marie',
      last_name: 'Dubois',
      email: 'marie.dubois@property237.com'
    },
    phone_number: '+237690123456',
    profile_picture: 'https://images.unsplash.com/photo-1494790108755-2616b2e1c09d?w=150&h=150&fit=crop&crop=face',
    company_name: 'Dubois Properties',
    is_verified: true
  },
  created_at: '2024-01-15T10:00:00Z',
  featured: false
}

const mockFeaturedProperty: PropertyListingType = {
  ...mockProperty,
  id: '2',
  title: 'Luxury Villa with Pool in Bonanjo',
  slug: 'luxury-villa-pool-bonanjo',
  listing_type: 'sale',
  price: 125000000,
  no_of_bedrooms: 4,
  no_of_bathrooms: 3,
  area: {
    id: '2',
    name: 'Bonanjo',
    city: {
      id: '2',
      name: 'Douala',
      region: {
        id: '2',
        name: 'Littoral'
      }
    }
  },
  property_type: {
    id: '2',
    name: 'Villa',
    category: 'residential',
    description: 'Standalone luxury house',
    is_active: true
  },
  featured: true
}

const mockGuestHouseProperty: PropertyListingType = {
  ...mockProperty,
  id: '3',
  title: 'Cozy Guest House Near Airport',
  slug: 'cozy-guest-house-airport',
  listing_type: 'guest_house',
  price: 25000,
  no_of_bedrooms: 1,
  no_of_bathrooms: 1,
  property_type: {
    id: '3',
    name: 'Guest House',
    category: 'residential',
    description: 'Short-term accommodation',
    is_active: true
  },
  agent: {
    ...mockProperty.agent,
    user: {
      id: '2',
      first_name: 'Jean',
      last_name: 'Mballa',
      email: 'jean.mballa@property237.com'
    },
    is_verified: false,
    profile_picture: undefined
  },
  featured: false
}

export const GridView: Story = {
  args: {
    property: mockProperty,
    viewMode: 'grid',
    showAgent: true,
    isFavorited: false
  }
}

export const ListView: Story = {
  args: {
    property: mockProperty,
    viewMode: 'list',
    showAgent: true,
    isFavorited: false
  }
}

export const FeaturedProperty: Story = {
  args: {
    property: mockFeaturedProperty,
    viewMode: 'grid',
    showAgent: true,
    isFavorited: true
  }
}

export const WithoutAgent: Story = {
  args: {
    property: mockProperty,
    viewMode: 'grid',
    showAgent: false,
    isFavorited: false
  }
}

export const GuestHouse: Story = {
  args: {
    property: mockGuestHouseProperty,
    viewMode: 'grid',
    showAgent: true,
    isFavorited: false
  }
}

export const PropertyShowcase: Story = {
  args: {
    property: mockProperty,
    viewMode: 'grid'
  },
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Property Grid View</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyCard property={mockProperty} viewMode="grid" />
        <PropertyCard property={mockFeaturedProperty} viewMode="grid" isFavorited />
        <PropertyCard property={mockGuestHouseProperty} viewMode="grid" />
      </div>

      <h3 className="text-lg font-semibold mb-4 mt-8">Property List View</h3>
      <div className="space-y-4">
        <PropertyCard property={mockProperty} viewMode="list" />
        <PropertyCard property={mockFeaturedProperty} viewMode="list" isFavorited />
        <PropertyCard property={mockGuestHouseProperty} viewMode="list" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of PropertyCard component in both grid and list layouts with different property types.'
      }
    }
  }
}

// Interactive example with state management
export const Interactive: Story = {
  args: {
    property: mockProperty,
    viewMode: 'grid',
    showAgent: true,
    isFavorited: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive PropertyCard with working favorite, contact, share, and view actions.'
      }
    }
  }
}