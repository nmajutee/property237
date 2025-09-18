import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchBar, SearchSuggestion, FilterGroup, SearchResult } from './SearchBar'
import { useState } from 'react'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  HomeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const meta: Meta<typeof SearchBar> = {
  title: 'Composite/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The SearchBar component provides advanced search functionality with:

- **Smart Suggestions**: Real-time search suggestions with icons and categories
- **Recent Searches**: History of previous searches with filters
- **Advanced Filters**: Multiple filter types (select, multiselect, range, checkbox)
- **Keyboard Navigation**: Full keyboard support with arrow keys and Enter
- **Debounced Search**: Optimized search performance with configurable delay
- **Responsive Design**: Mobile-friendly with touch support

## Features

### Search Functionality
- Real-time search with debouncing
- Custom search suggestions with icons
- Recent search history with filter restoration
- Form submission handling

### Filter System
- Multiple filter types: select, multiselect, range, checkbox
- Visual filter count badges
- Clear all filters functionality
- Persistent filter state

### User Experience
- Keyboard navigation (arrows, enter, escape)
- Click outside to close dropdowns
- Loading states and disabled support
- Auto-focus option

### Accessibility
- Full keyboard navigation
- Screen reader compatible
- Proper ARIA labels and semantics
- Focus management
        `
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current search query value'
    },
    placeholder: {
      control: 'text',
      description: 'Search input placeholder text'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state in search icon'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the search input'
    },
    showSuggestions: {
      control: 'boolean',
      description: 'Enable search suggestions dropdown'
    },
    showFilters: {
      control: 'boolean',
      description: 'Enable filters dropdown'
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto-focus search input on mount'
    },
    debounceDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Debounce delay for search in milliseconds'
    },
    maxSuggestions: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Maximum number of suggestions to show'
    },
    maxRecentSearches: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Maximum number of recent searches to show'
    }
  }
}

export default meta
type Story = StoryObj<typeof SearchBar>

// Sample search suggestions
const sampleSuggestions: SearchSuggestion[] = [
  {
    id: '1',
    title: 'Sunset Apartments',
    subtitle: '123 Main St, Downtown - 24 units',
    type: 'property',
    icon: BuildingOfficeIcon
  },
  {
    id: '2',
    title: 'Oak Ridge Condos',
    subtitle: '456 Oak Ave, Midtown - 48 units',
    type: 'property',
    icon: BuildingOfficeIcon
  },
  {
    id: '3',
    title: 'Downtown',
    subtitle: 'City district with 156 properties',
    type: 'location',
    icon: MapPinIcon
  },
  {
    id: '4',
    title: 'John Smith',
    subtitle: 'Tenant at Sunset Apartments, Unit A-101',
    type: 'tenant',
    icon: UsersIcon
  },
  {
    id: '5',
    title: 'Alice Johnson',
    subtitle: 'Tenant at Oak Ridge Condos, Unit B-205',
    type: 'tenant',
    icon: UsersIcon
  },
  {
    id: '6',
    title: 'Apartment',
    subtitle: '89 properties available',
    type: 'category',
    icon: HomeIcon
  },
  {
    id: '7',
    title: 'Metro District',
    subtitle: 'Business district with 42 properties',
    type: 'location',
    icon: MapPinIcon
  },
  {
    id: '8',
    title: 'Sarah Wilson',
    subtitle: 'Tenant at Pine Valley Houses, Unit 7',
    type: 'tenant',
    icon: UsersIcon
  }
]

// Sample filter groups
const sampleFilterGroups: FilterGroup[] = [
  {
    id: 'propertyType',
    label: 'Property Type',
    type: 'select',
    options: [
      { id: 'apartment', label: 'Apartment Complex', value: 'apartment', count: 45 },
      { id: 'condo', label: 'Condominium', value: 'condominium', count: 32 },
      { id: 'house', label: 'Single Family', value: 'house', count: 28 },
      { id: 'loft', label: 'Loft', value: 'loft', count: 15 },
      { id: 'townhouse', label: 'Townhouse', value: 'townhouse', count: 12 }
    ]
  },
  {
    id: 'location',
    label: 'Location',
    type: 'multiselect',
    options: [
      { id: 'downtown', label: 'Downtown', value: 'downtown', count: 67 },
      { id: 'midtown', label: 'Midtown', value: 'midtown', count: 43 },
      { id: 'suburb', label: 'Suburban', value: 'suburban', count: 38 },
      { id: 'riverside', label: 'Riverside', value: 'riverside', count: 22 },
      { id: 'metro', label: 'Metro District', value: 'metro', count: 19 }
    ]
  },
  {
    id: 'rentRange',
    label: 'Rent Range',
    type: 'range',
    min: 500,
    max: 5000,
    step: 50
  },
  {
    id: 'amenities',
    label: 'Amenities',
    type: 'multiselect',
    options: [
      { id: 'parking', label: 'Parking', value: 'parking', count: 89 },
      { id: 'pool', label: 'Swimming Pool', value: 'pool', count: 34 },
      { id: 'gym', label: 'Fitness Center', value: 'gym', count: 28 },
      { id: 'laundry', label: 'Laundry Facility', value: 'laundry', count: 67 },
      { id: 'balcony', label: 'Balcony/Patio', value: 'balcony', count: 52 }
    ]
  }
]

// Sample recent searches
const sampleRecentSearches: SearchResult[] = [
  {
    query: 'downtown apartments',
    filters: { propertyType: 'apartment', location: ['downtown'] },
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    query: 'sunset',
    filters: {},
    timestamp: new Date('2024-01-15T09:15:00')
  },
  {
    query: 'luxury condos',
    filters: { propertyType: 'condominium', rentRange: { min: 2000 } },
    timestamp: new Date('2024-01-14T16:45:00')
  },
  {
    query: 'pool amenities',
    filters: { amenities: ['pool', 'gym'] },
    timestamp: new Date('2024-01-14T14:20:00')
  },
  {
    query: 'john smith tenant',
    filters: {},
    timestamp: new Date('2024-01-13T11:30:00')
  }
]

// Basic SearchBar Story
export const Default: Story = {
  args: {
    placeholder: 'Search properties, locations, tenants...',
    suggestions: sampleSuggestions,
    recentSearches: sampleRecentSearches,
    filterGroups: sampleFilterGroups,
    showSuggestions: true,
    showFilters: true,
    debounceDelay: 300,
    maxSuggestions: 6,
    maxRecentSearches: 3
  }
}

// With Loading State
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    value: 'searching...'
  }
}

// Disabled State
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'This search is disabled'
  }
}

// Without Suggestions
export const WithoutSuggestions: Story = {
  args: {
    ...Default.args,
    showSuggestions: false
  }
}

// Without Filters
export const WithoutFilters: Story = {
  args: {
    ...Default.args,
    showFilters: false
  }
}

// Minimal Configuration
export const Minimal: Story = {
  args: {
    placeholder: 'Search...',
    showSuggestions: false,
    showFilters: false
  }
}

// Property Search Focus
export const PropertySearch: Story = {
  args: {
    placeholder: 'Search properties by name, address, or type...',
    suggestions: sampleSuggestions.filter(s => s.type === 'property'),
    filterGroups: sampleFilterGroups.filter(f => ['propertyType', 'rentRange'].includes(f.id)),
    recentSearches: sampleRecentSearches.filter(r => r.query.includes('apartment') || r.query.includes('condo')),
    showSuggestions: true,
    showFilters: true,
    maxSuggestions: 8,
    maxRecentSearches: 5
  }
}

// Location Search Focus
export const LocationSearch: Story = {
  args: {
    placeholder: 'Search by location, district, or neighborhood...',
    suggestions: sampleSuggestions.filter(s => s.type === 'location'),
    filterGroups: sampleFilterGroups.filter(f => f.id === 'location'),
    recentSearches: sampleRecentSearches.filter(r => r.query.includes('downtown')),
    showSuggestions: true,
    showFilters: true
  }
}

// Tenant Search Focus
export const TenantSearch: Story = {
  args: {
    placeholder: 'Search tenants by name or contact information...',
    suggestions: sampleSuggestions.filter(s => s.type === 'tenant'),
    filterGroups: [],
    recentSearches: sampleRecentSearches.filter(r => r.query.includes('tenant')),
    showSuggestions: true,
    showFilters: false
  }
}

// Auto Focus Example
export const AutoFocus: Story = {
  args: {
    ...Default.args,
    autoFocus: true
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchBar automatically focuses when the component mounts, useful for search pages or modal dialogs.'
      }
    }
  }
}

// Fast Debounce
export const FastDebounce: Story = {
  args: {
    ...Default.args,
    debounceDelay: 100
  },
  parameters: {
    docs: {
      description: {
        story: 'Reduced debounce delay for more responsive search, useful for local data searching.'
      }
    }
  }
}

// Slow Debounce
export const SlowDebounce: Story = {
  args: {
    ...Default.args,
    debounceDelay: 1000
  },
  parameters: {
    docs: {
      description: {
        story: 'Increased debounce delay to reduce API calls, useful for expensive search operations.'
      }
    }
  }
}

// Many Suggestions
export const ManySuggestions: Story = {
  args: {
    ...Default.args,
    maxSuggestions: 12,
    suggestions: [
      ...sampleSuggestions,
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `extra-${i}`,
        title: `Property ${i + 9}`,
        subtitle: `Address ${i + 9}, District ${i + 1}`,
        type: 'property' as const,
        icon: BuildingOfficeIcon
      }))
    ]
  }
}

// Interactive Example with State Management
export const InteractiveExample: Story = {
  render: () => {
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState({})
    const [searchHistory, setSearchHistory] = useState<SearchResult[]>([...sampleRecentSearches])

    const handleSearch = (searchQuery: string, searchFilters: any) => {
      console.log('Search:', { query: searchQuery, filters: searchFilters })

      // Add to search history
      const newSearch: SearchResult = {
        query: searchQuery,
        filters: searchFilters,
        timestamp: new Date()
      }
      setSearchHistory([newSearch, ...searchHistory.slice(0, 4)])

      alert(`Searching for: "${searchQuery}" with ${Object.keys(searchFilters).length} filters`)
    }

    const handleClearHistory = () => {
      setSearchHistory([])
      console.log('Search history cleared')
    }

    return (
      <div className="w-full max-w-2xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          suggestions={sampleSuggestions}
          recentSearches={searchHistory}
          filterGroups={sampleFilterGroups}
          filters={filters}
          onFilterChange={setFilters}
          onClearRecentSearches={handleClearHistory}
          placeholder="Try searching and using filters..."
        />

        {/* Debug Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
          <div><strong>Query:</strong> {query || 'None'}</div>
          <div><strong>Active Filters:</strong> {Object.keys(filters).length || 'None'}</div>
          <div><strong>Recent Searches:</strong> {searchHistory.length}</div>
          {Object.keys(filters).length > 0 && (
            <div className="mt-2">
              <strong>Filter Details:</strong>
              <pre className="mt-1 text-xs">{JSON.stringify(filters, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with full state management, search history, and filter persistence. Open the console to see search events.'
      }
    }
  }
}

// Accessibility Demo
export const AccessibilityDemo: Story = {
  args: Default.args,
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features Demonstrated:

1. **Keyboard Navigation**:
   - Tab to focus search input
   - Arrow keys to navigate suggestions
   - Enter to select or submit
   - Escape to close dropdowns

2. **Screen Reader Support**:
   - Semantic HTML structure
   - ARIA labels for icons and buttons
   - Proper form associations

3. **Focus Management**:
   - Visible focus indicators
   - Logical tab order
   - Focus retention after interactions

4. **Visual Accessibility**:
   - High contrast colors
   - Clear visual hierarchy
   - Icon + text combinations

Try navigating this example using only the keyboard to experience the full accessibility support.
        `
      }
    }
  }
}

// Dark Mode Example
export const DarkModeExample: Story = {
  args: Default.args,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'SearchBar automatically adapts to dark mode with proper contrast and visibility.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <div className="bg-gray-900 p-6 rounded-lg">
          <Story />
        </div>
      </div>
    )
  ]
}