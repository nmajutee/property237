import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'
import { DialogHeader, DialogContent, DialogFooter, ModalDialog } from './DialogComponents'
import { ConfirmDialog, AlertDialog, ImageModal, FormModal } from './ModalVariants'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const meta = {
  title: 'Composite/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Modal system provides a comprehensive set of overlay components for user interactions.
Built with Headless UI for accessibility and Framer Motion for smooth animations.

## Features
- **Portal Rendering**: Rendered outside the normal DOM tree
- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: ESC to close, Tab navigation
- **Backdrop Control**: Click-outside-to-close behavior
- **Size Variants**: Small to fullscreen modal sizes
- **Animation Options**: Fade, slide, scale, or no animation
- **Accessibility**: WCAG compliant with proper ARIA attributes

## Components
- **Modal**: Base modal component
- **DialogHeader/Content/Footer**: Structured dialog components
- **ConfirmDialog**: Yes/no confirmation dialogs
- **AlertDialog**: Informational alerts
- **ImageModal**: Image viewer with overlay
- **FormModal**: Modal with form handling
        `
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg', 'xl', 'fullscreen']
    },
    animation: {
      control: { type: 'radio' },
      options: ['fade', 'slide', 'scale', 'none']
    }
  }
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const defaultArgs = {
  isOpen: false,
  onClose: () => {},
  children: null
}

// Basic Modal Story
export const BasicModal: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6">
        <Button onClick={() => setIsOpen(true)}>
          Open Basic Modal
        </Button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Modal</h2>
            <p className="text-gray-600 mb-4">
              This is a basic modal with minimal styling. You can put any content here.
            </p>
            <Button onClick={() => setIsOpen(false)}>
              Close Modal
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}

// Structured Dialog Story
export const StructuredDialog: Story = {
  args: defaultArgs,
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6">
        <Button onClick={() => setIsOpen(true)}>
          Open Structured Dialog
        </Button>

        <ModalDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete Property"
          description="Are you sure you want to delete this property? This action cannot be undone."
          primaryAction={{
            label: 'Delete',
            onClick: () => setIsOpen(false),
            variant: 'destructive'
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => setIsOpen(false),
            variant: 'secondary'
          }}
        >
          <div className="space-y-4">
            <p>Property: <strong>Modern Apartment in Bastos</strong></p>
            <p>Listed by: <strong>Marie Dubois</strong></p>
            <p>Created: <strong>January 15, 2024</strong></p>
          </div>
        </ModalDialog>
      </div>
    )
  }
}

// Size Variants
export const SizeVariants: Story = {
  args: defaultArgs,
  render: () => {
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const sizes = ['sm', 'md', 'lg', 'xl', 'fullscreen'] as const

    return (
      <div className="p-6 space-x-4">
        {sizes.map(size => (
          <Button
            key={size}
            onClick={() => setActiveModal(size)}
            variant="outline"
          >
            {size.toUpperCase()} Modal
          </Button>
        ))}

        {sizes.map(size => (
          <Modal
            key={size}
            isOpen={activeModal === size}
            onClose={() => setActiveModal(null)}
            size={size}
          >
            <DialogHeader
              title={`${size.toUpperCase()} Modal`}
              description={`This is a ${size} sized modal`}
            />
            <DialogContent>
              <p>
                Modal content goes here. This modal is sized as "{size}".
                {size === 'fullscreen' && ' This fullscreen modal takes up the entire viewport.'}
              </p>
            </DialogContent>
            <DialogFooter
              primaryAction={{
                label: 'Close',
                onClick: () => setActiveModal(null)
              }}
            />
          </Modal>
        ))}
      </div>
    )
  }
}

// Animation Variants
export const AnimationVariants: Story = {
  args: defaultArgs,
  render: () => {
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const animations = ['fade', 'slide', 'scale', 'none'] as const

    return (
      <div className="p-6 space-x-4">
        {animations.map(animation => (
          <Button
            key={animation}
            onClick={() => setActiveModal(animation)}
            variant="outline"
          >
            {animation} Animation
          </Button>
        ))}

        {animations.map(animation => (
          <Modal
            key={animation}
            isOpen={activeModal === animation}
            onClose={() => setActiveModal(null)}
            animation={animation}
          >
            <DialogHeader
              title={`${animation} Animation`}
              description={`Modal with ${animation} animation`}
            />
            <DialogContent>
              <p>This modal uses the "{animation}" animation style.</p>
            </DialogContent>
            <DialogFooter
              primaryAction={{
                label: 'Close',
                onClick: () => setActiveModal(null)
              }}
            />
          </Modal>
        ))}
      </div>
    )
  }
}

// Confirm Dialog
export const ConfirmDialogStory: Story = {
  args: defaultArgs,
  name: 'Confirm Dialog',
  render: () => {
    const [activeDialog, setActiveDialog] = useState<string | null>(null)

    return (
      <div className="p-6 space-x-4">
        <Button
          onClick={() => setActiveDialog('default')}
          variant="outline"
        >
          Default Confirm
        </Button>
        <Button
          onClick={() => setActiveDialog('warning')}
          variant="outline"
        >
          Warning Confirm
        </Button>
        <Button
          onClick={() => setActiveDialog('danger')}
          variant="destructive"
        >
          Danger Confirm
        </Button>

        <ConfirmDialog
          isOpen={activeDialog === 'default'}
          onClose={() => setActiveDialog(null)}
          onConfirm={() => setActiveDialog(null)}
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
          variant="default"
        />

        <ConfirmDialog
          isOpen={activeDialog === 'warning'}
          onClose={() => setActiveDialog(null)}
          onConfirm={() => setActiveDialog(null)}
          title="Warning: Potential Data Loss"
          description="This action may result in data loss. Do you want to continue?"
          variant="warning"
          confirmLabel="Continue"
        />

        <ConfirmDialog
          isOpen={activeDialog === 'danger'}
          onClose={() => setActiveDialog(null)}
          onConfirm={() => setActiveDialog(null)}
          title="Delete Account"
          description="This will permanently delete your account and all associated data. This action cannot be undone."
          variant="danger"
          confirmLabel="Delete Account"
        />
      </div>
    )
  }
}

// Alert Dialog
export const AlertDialogStory: Story = {
  args: defaultArgs,
  name: 'Alert Dialog',
  render: () => {
    const [activeAlert, setActiveAlert] = useState<string | null>(null)

    return (
      <div className="p-6 space-x-4">
        <Button onClick={() => setActiveAlert('info')}>Info</Button>
        <Button onClick={() => setActiveAlert('success')}>Success</Button>
        <Button onClick={() => setActiveAlert('warning')}>Warning</Button>
        <Button onClick={() => setActiveAlert('error')}>Error</Button>

        <AlertDialog
          isOpen={activeAlert === 'info'}
          onClose={() => setActiveAlert(null)}
          title="Information"
          description="Your changes have been saved successfully."
          type="info"
        />

        <AlertDialog
          isOpen={activeAlert === 'success'}
          onClose={() => setActiveAlert(null)}
          title="Success!"
          description="Property listing has been published successfully."
          type="success"
        />

        <AlertDialog
          isOpen={activeAlert === 'warning'}
          onClose={() => setActiveAlert(null)}
          title="Warning"
          description="Some images failed to upload. Please try again."
          type="warning"
        />

        <AlertDialog
          isOpen={activeAlert === 'error'}
          onClose={() => setActiveAlert(null)}
          title="Error"
          description="Failed to save changes. Please check your connection and try again."
          type="error"
        />
      </div>
    )
  }
}

// Image Modal
export const ImageModalStory: Story = {
  args: defaultArgs,
  name: 'Image Modal',
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 max-w-md">
          {[1, 2, 3].map(i => (
            <img
              key={i}
              src={`https://images.unsplash.com/photo-${1570129477492 + i}-d68e34e2c25?w=300&h=200&fit=crop`}
              alt={`Property ${i}`}
              className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => setIsOpen(true)}
            />
          ))}
        </div>

        <ImageModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
          alt="Modern apartment interior"
          title="Modern Apartment in Bastos"
          description="Spacious living room with modern furnishings and natural lighting"
        />
      </div>
    )
  }
}

// Form Modal
export const FormModalStory: Story = {
  args: defaultArgs,
  name: 'Form Modal',
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setIsOpen(false)
      }, 2000)
    }

    return (
      <div className="p-6">
        <Button onClick={() => setIsOpen(true)}>
          Open Form Modal
        </Button>

        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Add New Property"
          description="Fill in the details to create a new property listing."
          onSubmit={handleSubmit}
          loading={loading}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Title</label>
              <Input placeholder="Enter property title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (XAF)</label>
              <Input type="number" placeholder="450000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input placeholder="e.g., Bastos, Yaoundé" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the property..."
              />
            </div>
          </div>
        </FormModal>
      </div>
    )
  }
}

// Accessibility Demo
export const AccessibilityDemo: Story = {
  args: defaultArgs,
  name: 'Accessibility Features',
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6">
        <div className="space-y-4 max-w-md">
          <h3 className="text-lg font-semibold">Accessibility Features</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• Focus trapping (Tab navigation stays within modal)</li>
            <li>• ESC key closes modal</li>
            <li>• Click outside backdrop closes modal</li>
            <li>• Focus restoration when modal closes</li>
            <li>• Screen reader announcements</li>
            <li>• Proper ARIA attributes</li>
          </ul>

          <Button onClick={() => setIsOpen(true)}>
            Test Accessibility
          </Button>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialFocus="#first-input"
        >
          <DialogHeader
            title="Accessibility Test Modal"
            description="Try navigating with Tab key, pressing ESC, or clicking outside"
          />
          <DialogContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="first-input" className="block text-sm font-medium mb-1">
                  First Input (Auto-focused)
                </label>
                <Input id="first-input" placeholder="This input gets focus" />
              </div>
              <div>
                <label htmlFor="second-input" className="block text-sm font-medium mb-1">
                  Second Input
                </label>
                <Input id="second-input" placeholder="Tab to reach this" />
              </div>
            </div>
          </DialogContent>
          <DialogFooter
            primaryAction={{
              label: 'Submit',
              onClick: () => setIsOpen(false)
            }}
            secondaryAction={{
              label: 'Cancel',
              onClick: () => setIsOpen(false),
              variant: 'secondary'
            }}
          />
        </Modal>
      </div>
    )
  }
}