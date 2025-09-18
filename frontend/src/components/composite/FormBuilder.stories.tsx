import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormBuilder, type FormField, type FormBuilderProps } from './FormBuilder'

const meta: Meta<typeof FormBuilder> = {
  title: 'Composite/FormBuilder',
  component: FormBuilder,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A dynamic FormBuilder component for constructing complex forms declaratively.

- Supports multiple field types: text, textarea, number, select, multiselect, checkbox, radio, date, file, email, phone, currency, custom
- Built-in validation: required, pattern, min/max, custom validators
- Conditional visibility based on other fields
- Custom field rendering via render prop
- Tailwind-styled and accessible by default
        `
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof FormBuilder>

const basicFields: FormField[] = [
  { id: 'f1', name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter title' },
  { id: 'f2', name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' },
  { id: 'f3', name: 'price', label: 'Monthly Rent ($)', type: 'number', min: 0, step: 50, required: true },
  { id: 'f4', name: 'type', label: 'Property Type', type: 'select', required: true, options: [
    { id: 'apartment', label: 'Apartment', value: 'apartment' },
    { id: 'condo', label: 'Condominium', value: 'condo' },
    { id: 'house', label: 'House', value: 'house' }
  ]},
  { id: 'f5', name: 'amenities', label: 'Amenities', type: 'multiselect', options: [
    { id: 'parking', label: 'Parking', value: 'parking' },
    { id: 'pool', label: 'Pool', value: 'pool' },
    { id: 'gym', label: 'Gym', value: 'gym' }
  ]},
  { id: 'f6', name: 'isActive', label: 'Active Listing', type: 'checkbox', defaultValue: true },
  { id: 'f7', name: 'availableFrom', label: 'Available From', type: 'date', required: true },
  { id: 'f8', name: 'contactEmail', label: 'Contact Email', type: 'email', pattern: '^[^\n@]+@[^\n@]+\.[^\n@]+$' },
]

export const Basic: Story = {
  args: {
    fields: basicFields,
    submitLabel: 'Create Listing',
    onSubmit: (values) => alert('Submitted: ' + JSON.stringify(values, null, 2))
  }
}

const conditionalFields: FormField[] = [
  { id: 'c1', name: 'hasParking', label: 'Has Parking?', type: 'checkbox' },
  { id: 'c2', name: 'parkingSpots', label: 'Number of Spots', type: 'number', min: 0, max: 10, step: 1, defaultValue: 1, required: true, conditional: { field: 'hasParking', value: true } },
  { id: 'c3', name: 'unitType', label: 'Unit Type', type: 'radio', required: true, options: [
    { id: 'studio', label: 'Studio', value: 'studio' },
    { id: '1br', label: '1 Bedroom', value: '1br' },
    { id: '2br', label: '2 Bedroom', value: '2br' }
  ]},
]

export const ConditionalLogic: Story = {
  args: {
    fields: conditionalFields,
    submitLabel: 'Save Preferences',
    onSubmit: (values) => alert('Saved: ' + JSON.stringify(values, null, 2))
  }
}

const customFields: FormField[] = [
  { id: 'u1', name: 'rent', label: 'Rent (USD)', type: 'currency', required: true, validate: (v) => (v && v > 0 ? null : 'Enter a positive amount') },
  { id: 'u2', name: 'photos', label: 'Property Photo', type: 'file' },
  {
    id: 'u3', name: 'address', label: 'Address', type: 'custom', customRender: ({ value, onChange, error }) => (
      <div>
        <input
          className={`block w-full rounded-md border px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="123 Main St"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">Autocomplete could be wired here.</div>
      </div>
    )
  }
]

export const CustomRenderers: Story = {
  args: {
    fields: customFields,
    submitLabel: 'Submit Custom Form',
    onSubmit: (values) => alert('Submitted: ' + JSON.stringify(values, null, 2))
  }
}

export const DisabledAndLoading: Story = {
  args: {
    fields: basicFields,
    disabled: true,
    loading: true,
    submitLabel: 'Submitting...'
  }
}
