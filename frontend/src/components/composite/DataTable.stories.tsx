import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable, DataTableColumn, RowAction } from './DataTable'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { Badge } from '../primitives/Badge'
import { useState } from 'react'

const meta: Meta<typeof DataTable> = {
  title: 'Composite/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The DataTable component provides a comprehensive data display solution with:

- **Sorting**: Click column headers to sort data ascending/descending
- **Filtering**: Global search and per-column filtering
- **Pagination**: Configurable page sizes and navigation
- **Row Selection**: Single or multiple row selection with checkboxes
- **Row Actions**: Configurable action buttons for each row
- **Responsive Design**: Mobile-friendly with column hiding options
- **Loading States**: Built-in loading and empty state handling
- **Customization**: Custom cell renderers and row styling

## Features

### Data Management
- Client-side or server-side data processing
- Flexible column definitions with custom accessors
- Type-safe row data handling
- Custom cell rendering with React components

### Interaction
- Row click handlers for navigation
- Action buttons with conditional visibility
- Bulk selection for batch operations
- Search and filter capabilities

### Accessibility
- Full keyboard navigation support
- Screen reader compatible
- Proper ARIA labels and semantics
- High contrast mode support
        `
      }
    }
  },
  argTypes: {
    data: {
      control: false,
      description: 'Array of data objects to display'
    },
    columns: {
      control: false,
      description: 'Column definitions with headers, accessors, and renderers'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state'
    },
    searchable: {
      control: 'boolean',
      description: 'Enable global search functionality'
    },
    selectable: {
      control: 'boolean',
      description: 'Enable row selection with checkboxes'
    },
    paginated: {
      control: 'boolean',
      description: 'Enable pagination controls'
    }
  }
}

export default meta
type Story = StoryObj<typeof DataTable>

// Property data type
type PropertyData = {
  id: string
  name: string
  address: string
  type: string
  units: number
  rent: number
  occupancy: number
  status: string
  lastUpdated: string
  manager: string
}

// Tenant data type
type TenantData = {
  id: string
  name: string
  email: string
  property: string
  unit: string
  rent: number
  status: string
  leaseEnd: string
  phone: string
}

// Sample property data
const propertyData = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main St, Cityville',
    type: 'Apartment Complex',
    units: 24,
    rent: 1200,
    occupancy: 92,
    status: 'Active',
    lastUpdated: '2024-01-15',
    manager: 'John Smith'
  },
  {
    id: '2',
    name: 'Oak Ridge Condos',
    address: '456 Oak Ave, Downtown',
    type: 'Condominium',
    units: 48,
    rent: 1800,
    occupancy: 88,
    status: 'Active',
    lastUpdated: '2024-01-14',
    manager: 'Sarah Johnson'
  },
  {
    id: '3',
    name: 'Pine Valley Houses',
    address: '789 Pine St, Suburbia',
    type: 'Single Family',
    units: 12,
    rent: 2200,
    occupancy: 100,
    status: 'Active',
    lastUpdated: '2024-01-13',
    manager: 'Mike Wilson'
  },
  {
    id: '4',
    name: 'Metro Lofts',
    address: '321 Industrial Blvd, Metro',
    type: 'Loft',
    units: 36,
    rent: 1600,
    occupancy: 75,
    status: 'Maintenance',
    lastUpdated: '2024-01-12',
    manager: 'Lisa Chen'
  },
  {
    id: '5',
    name: 'Riverside Towers',
    address: '654 River Rd, Riverside',
    type: 'High Rise',
    units: 120,
    rent: 2000,
    occupancy: 95,
    status: 'Active',
    lastUpdated: '2024-01-11',
    manager: 'David Brown'
  }
]

// Property table columns
const propertyColumns: DataTableColumn<PropertyData>[] = [
  {
    id: 'name',
    header: 'Property Name',
    accessor: 'name',
    sortable: true,
    filterable: true,
    cell: (value, row) => (
      <div className="flex items-center gap-2">
        <HomeIcon className="h-4 w-4 text-gray-400" />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.type}</div>
        </div>
      </div>
    )
  },
  {
    id: 'address',
    header: 'Address',
    accessor: 'address',
    sortable: true,
    filterable: true,
    hideOnMobile: true,
    cell: (value) => (
      <div className="flex items-center gap-2 text-sm">
        <MapPinIcon className="h-4 w-4 text-gray-400" />
        {value}
      </div>
    )
  },
  {
    id: 'units',
    header: 'Units',
    accessor: 'units',
    sortable: true,
    align: 'center',
    width: '80px'
  },
  {
    id: 'rent',
    header: 'Avg Rent',
    accessor: 'rent',
    sortable: true,
    align: 'right',
    cell: (value) => (
      <div className="flex items-center justify-end gap-1">
        <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
        <span className="font-medium">{value.toLocaleString()}</span>
      </div>
    )
  },
  {
    id: 'occupancy',
    header: 'Occupancy',
    accessor: 'occupancy',
    sortable: true,
    align: 'center',
    cell: (value) => (
      <div className="flex items-center justify-center">
        <div className="text-sm font-medium">{value}%</div>
        <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              value >= 90 ? 'bg-green-500' :
              value >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    )
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    filterable: true,
    align: 'center',
    cell: (value) => (
      <Badge
        variant={value === 'Active' ? 'success' : value === 'Maintenance' ? 'warning' : 'default'}
        size="sm"
      >
        {value}
      </Badge>
    )
  },
  {
    id: 'manager',
    header: 'Manager',
    accessor: 'manager',
    sortable: true,
    filterable: true,
    hideOnMobile: true
  }
]

// Row actions
const propertyActions: RowAction<PropertyData>[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: EyeIcon,
    onClick: (row: any) => console.log('Viewing', row.name),
    variant: 'default'
  },
  {
    id: 'edit',
    label: 'Edit Property',
    icon: PencilIcon,
    onClick: (row: any) => console.log('Editing', row.name),
    variant: 'primary'
  },
  {
    id: 'delete',
    label: 'Delete Property',
    icon: TrashIcon,
    onClick: (row: any) => console.log('Deleting', row.name),
    variant: 'danger',
    condition: (row: any) => row.status !== 'Active' // Only show for inactive properties
  }
]

// Basic DataTable Story
export const Default: Story = {
  args: {
    data: propertyData as any,
    columns: propertyColumns as any,
    actions: propertyActions as any,
    title: 'Property Listings',
    description: 'Manage your property portfolio',
    searchable: true,
    selectable: true,
    paginated: true,
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: propertyData.length,
      totalPages: Math.ceil(propertyData.length / 10)
    }
  }
}

// Loading State
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    loadingText: 'Loading properties...'
  }
}

// Empty State
export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyText: 'No properties found. Add your first property to get started.'
  }
}

// Without Search
export const WithoutSearch: Story = {
  args: {
    ...Default.args,
    searchable: false
  }
}

// Without Selection
export const WithoutSelection: Story = {
  args: {
    ...Default.args,
    selectable: false
  }
}

// Without Pagination
export const WithoutPagination: Story = {
  args: {
    ...Default.args,
    paginated: false
  }
}

// Minimal Configuration
export const Minimal: Story = {
  args: {
    data: propertyData.slice(0, 3) as any,
    columns: [
      { id: 'name', header: 'Property', accessor: 'name' as any, sortable: true },
      { id: 'units', header: 'Units', accessor: 'units' as any, align: 'center' },
      { id: 'status', header: 'Status', accessor: 'status' as any,
        cell: (value: any) => <Badge variant={value === 'Active' ? 'success' : 'warning'}>{value}</Badge>
      }
    ] as any,
    searchable: false,
    selectable: false,
    paginated: false
  }
}

// Large Dataset
export const LargeDataset: Story = {
  args: {
    ...Default.args,
    data: Array.from({ length: 100 }, (_, i) => ({
      ...propertyData[i % propertyData.length],
      id: `${i + 1}`,
      name: `${propertyData[i % propertyData.length].name} ${i + 1}`,
      rent: Math.floor(Math.random() * 1000) + 1000,
      occupancy: Math.floor(Math.random() * 30) + 70
    })),
    pagination: {
      currentPage: 1,
      pageSize: 25,
      totalItems: 100,
      totalPages: 4
    }
  }
}

// Custom Row Styling
export const CustomRowStyling: Story = {
  args: {
    ...Default.args,
    getRowClassName: (row: any) => {
      if (row.occupancy < 80) return 'bg-red-50 dark:bg-red-900/10'
      if (row.occupancy >= 95) return 'bg-green-50 dark:bg-green-900/10'
      return ''
    }
  }
}

// Interactive Example with State Management
export const InteractiveExample: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null)

    const handleRowSelect = (rows: string[]) => {
      setSelectedRows(rows)
      console.log('Selected rows:', rows)
    }

    const handleRowClick = (row: typeof propertyData[0]) => {
      console.log('Clicked row:', row)
      alert(`Clicked on ${row.name}`)
    }

    return (
      <div className="p-6">
        <DataTable
          data={propertyData as any}
          columns={propertyColumns as any}
          actions={propertyActions as any}
          title="Interactive Property Table"
          description={`${selectedRows.length} properties selected`}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onRowClick={handleRowClick}
          pagination={{
            currentPage,
            pageSize,
            totalItems: propertyData.length,
            totalPages: Math.ceil(propertyData.length / pageSize)
          }}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          sortConfig={sortConfig || undefined}
          onSortChange={setSortConfig}
        />
      </div>
    )
  }
}

// Tenant Data Example
const tenantData = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    property: 'Sunset Apartments',
    unit: 'A-101',
    rent: 1200,
    status: 'Current',
    leaseEnd: '2024-12-31',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@email.com',
    property: 'Oak Ridge Condos',
    unit: 'B-205',
    rent: 1800,
    status: 'Late',
    leaseEnd: '2024-08-15',
    phone: '(555) 987-6543'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@email.com',
    property: 'Pine Valley Houses',
    unit: 'House 7',
    rent: 2200,
    status: 'Current',
    leaseEnd: '2025-03-31',
    phone: '(555) 456-7890'
  }
]

const tenantColumns: DataTableColumn<TenantData>[] = [
  {
    id: 'name',
    header: 'Tenant',
    accessor: 'name',
    sortable: true,
    filterable: true,
    cell: (value, row) => (
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{row.email}</div>
      </div>
    )
  },
  {
    id: 'property',
    header: 'Property/Unit',
    accessor: 'property',
    sortable: true,
    cell: (value, row) => (
      <div>
        <div className="text-sm font-medium">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Unit {row.unit}</div>
      </div>
    )
  },
  {
    id: 'rent',
    header: 'Rent',
    accessor: 'rent',
    sortable: true,
    align: 'right',
    cell: (value) => <span className="font-medium">${value.toLocaleString()}</span>
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    align: 'center',
    cell: (value) => (
      <Badge
        variant={value === 'Current' ? 'success' : value === 'Late' ? 'danger' : 'default'}
        size="sm"
      >
        {value}
      </Badge>
    )
  },
  {
    id: 'leaseEnd',
    header: 'Lease End',
    accessor: 'leaseEnd',
    sortable: true,
    hideOnMobile: true
  }
]

export const TenantDataExample: Story = {
  args: {
    data: tenantData as any,
    columns: tenantColumns as any,
    actions: [
      {
        id: 'contact',
        label: 'Contact Tenant',
        icon: EyeIcon,
        onClick: (row: any) => console.log('Contacting', row.name)
      },
      {
        id: 'edit',
        label: 'Edit Lease',
        icon: PencilIcon,
        onClick: (row: any) => console.log('Editing lease for', row.name)
      }
    ] as any,
    title: 'Tenant Management',
    description: 'Manage tenant information and leases',
    searchable: true,
    selectable: true,
    paginated: false
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

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Screen Reader Support**: Proper table semantics and ARIA labels
3. **Focus Management**: Visible focus indicators throughout
4. **Sort Announcements**: Screen readers announce sort state changes
5. **Selection Feedback**: Clear indication of selected rows

Try navigating this example using only the keyboard:
- Tab through interactive elements
- Use Enter/Space to activate buttons
- Use arrow keys in dropdowns
- Screen readers will announce table structure and data
        `
      }
    }
  }
}