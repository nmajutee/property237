'use client'

import React, { ReactNode } from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'
import { cn } from '../../design-system/utils'
import { Icon } from '../primitives/Icon'
import { Button } from '../ui/Button'
import { Modal } from './Modal'
import { ButtonProps } from '../ui/Button'

// Dialog Header Component
export interface DialogHeaderProps {
  /**
   * Dialog title
   */
  title?: string
  /**
   * Dialog description/subtitle
   */
  description?: string
  /**
   * Custom title element
   */
  titleElement?: ReactNode
  /**
   * Custom description element
   */
  descriptionElement?: ReactNode
  /**
   * Additional content in header
   */
  children?: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Title alignment
   */
  align?: 'left' | 'center' | 'right'
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  title,
  description,
  titleElement,
  descriptionElement,
  children,
  className = '',
  align = 'left'
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <div className={cn('px-6 pt-6 pb-4', alignmentClasses[align], className)}>
      {/* Title */}
      {titleElement || (title && (
        <HeadlessDialog.Title
          as="h3"
          className="text-lg font-semibold leading-6 text-gray-900 mb-2"
        >
          {title}
        </HeadlessDialog.Title>
      ))}

      {/* Description */}
      {descriptionElement || (description && (
        <HeadlessDialog.Description className="text-sm text-gray-600 mb-4">
          {description}
        </HeadlessDialog.Description>
      ))}

      {/* Additional content */}
      {children}
    </div>
  )
}

// Dialog Content Component
export interface DialogContentProps {
  /**
   * Content to display
   */
  children: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Content padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Enable scrolling for long content
   */
  scrollable?: boolean
  /**
   * Maximum height for scrollable content
   */
  maxHeight?: string
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = '',
  padding = 'md',
  scrollable = false,
  maxHeight = 'max-h-96'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }

  return (
    <div
      className={cn(
        'text-gray-900',
        paddingClasses[padding],
        scrollable && `overflow-y-auto ${maxHeight}`,
        className
      )}
    >
      {children}
    </div>
  )
}

// Dialog Footer Component
export interface DialogAction {
  label: string
  onClick: () => void
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  loading?: boolean
  disabled?: boolean
  icon?: any
  className?: string
}

export interface DialogFooterProps {
  /**
   * Action buttons
   */
  actions?: DialogAction[]
  /**
   * Primary action (typically confirm/save)
   */
  primaryAction?: DialogAction
  /**
   * Secondary action (typically cancel/close)
   */
  secondaryAction?: DialogAction
  /**
   * Custom footer content
   */
  children?: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Footer alignment
   */
  align?: 'left' | 'center' | 'right' | 'between' | 'around'
  /**
   * Reverse action order (secondary first)
   */
  reverseOrder?: boolean
  /**
   * Full width buttons on mobile
   */
  fullWidthOnMobile?: boolean
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  actions,
  primaryAction,
  secondaryAction,
  children,
  className = '',
  align = 'right',
  reverseOrder = false,
  fullWidthOnMobile = true
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }

  // Build action list
  const actionList = actions || []
  if (primaryAction || secondaryAction) {
    const builtActions = []
    if (secondaryAction) builtActions.push(secondaryAction)
    if (primaryAction) builtActions.push(primaryAction)
    actionList.push(...(reverseOrder ? builtActions.reverse() : builtActions))
  }

  if (children) {
    return (
      <div className={cn('px-6 pb-6 pt-4', className)}>
        {children}
      </div>
    )
  }

  if (actionList.length === 0) {
    return null
  }

  return (
    <div className={cn('px-6 pb-6 pt-4 bg-gray-50 rounded-b-lg', className)}>
      <div className={cn(
        'flex gap-3',
        alignmentClasses[align],
        fullWidthOnMobile && 'flex-col sm:flex-row'
      )}>
        {actionList.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'default'}
            size={action.size || 'default'}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              fullWidthOnMobile && 'w-full sm:w-auto',
              action.className
            )}
          >
            {action.icon && (
              <Icon
                icon={action.icon}
                size="sm"
                className="mr-2"
              />
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Convenience component that combines all parts
export interface ModalDialogProps {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean
  /**
   * Callback when dialog should be closed
   */
  onClose: () => void
  /**
   * Dialog title
   */
  title?: string
  /**
   * Dialog description
   */
  description?: string
  /**
   * Dialog content
   */
  children: ReactNode
  /**
   * Footer actions
   */
  actions?: DialogAction[]
  /**
   * Primary action
   */
  primaryAction?: DialogAction
  /**
   * Secondary action
   */
  secondaryAction?: DialogAction
  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  /**
   * Additional props for the Modal component
   */
  modalProps?: Partial<import('./Modal').ModalProps>
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  primaryAction,
  secondaryAction,
  size = 'md',
  modalProps = {}
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      {...modalProps}
    >
      {title && (
        <DialogHeader
          title={title}
          description={description}
        />
      )}

      <DialogContent>
        {children}
      </DialogContent>

      <DialogFooter
        actions={actions}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />
    </Modal>
  )
}

const DialogComponents = {
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
  ModalDialog
};

export default DialogComponents;