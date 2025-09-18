import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SignUpCard } from './SignUpCard'

const meta: Meta<typeof SignUpCard> = {
  title: 'Auth/SignUpCard',
  component: SignUpCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'HomeFinder sign-up page with role selection for tenants and agents.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SignUpCard>

export const Default: Story = {
  args: {
    onSelectRole: (role) => {
      console.log(`Selected role: ${role}`)
    },
    loading: false,
    error: undefined,
  },
}

export const Loading: Story = {
  args: {
    onSelectRole: (role) => {
      console.log(`Selected role: ${role}`)
    },
    loading: true,
    error: undefined,
  },
}

export const WithError: Story = {
  args: {
    onSelectRole: (role) => {
      console.log(`Selected role: ${role}`)
    },
    loading: false,
    error: 'Something went wrong. Please try again.',
  },
}

export const DarkMode: Story = {
  args: {
    onSelectRole: (role) => {
      console.log(`Selected role: ${role}`)
    },
    loading: false,
    error: undefined,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}

export const Interactive: Story = {
  args: {
    onSelectRole: (role) => {
      // Simulate a delay and then show success
      return new Promise((resolve) => {
        setTimeout(() => {
          alert(`Successfully selected ${role} role!`)
          resolve(undefined)
        }, 1500)
      })
    },
    loading: false,
    error: undefined,
  },
}