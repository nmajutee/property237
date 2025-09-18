import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, ArrowRight, Heart, Download } from 'lucide-react';
import { Button, ButtonGroup } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible button component with multiple variants, sizes, and states. Supports icons, loading states, and full accessibility.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger'],
      description: 'Button visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Item',
  },
};

// Size variants
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button leftIcon={Search}>Search</Button>
        <Button rightIcon={ArrowRight} variant="primary">Continue</Button>
        <Button leftIcon={Download} variant="ghost">Download</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button leftIcon={Heart} variant="danger">Remove Favorite</Button>
        <Button rightIcon={ArrowRight} size="lg" variant="primary">Get Started</Button>
      </div>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button>Normal</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="primary">Normal</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </div>
  ),
};

// Full width
export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <Button fullWidth variant="primary" rightIcon={ArrowRight}>
        Full Width Button
      </Button>
    </div>
  ),
};

// Button group
export const ButtonGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Horizontal Group</h4>
        <ButtonGroup>
          <Button>Cancel</Button>
          <Button variant="primary">Save</Button>
        </ButtonGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Action Group</h4>
        <ButtonGroup spacing="md">
          <Button leftIcon={Search} variant="ghost">Search</Button>
          <Button leftIcon={Download} variant="secondary">Export</Button>
          <Button rightIcon={ArrowRight} variant="primary">Continue</Button>
        </ButtonGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Vertical Group</h4>
        <ButtonGroup orientation="vertical" spacing="sm">
          <Button variant="tertiary">Edit Property</Button>
          <Button variant="tertiary">View Details</Button>
          <Button variant="danger">Delete Property</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};