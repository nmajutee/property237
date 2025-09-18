'use client'

import React, { ReactNode } from 'react'
import { Modal } from './Modal'
import { DialogHeader, DialogContent, DialogFooter, DialogAction } from './DialogComponents'
import { Icon } from '../primitives/Icon'
import { AlertTriangle, CheckCircle, Info, XCircle, HelpCircle } from 'lucide-react'

// Confirm Dialog
export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger' | 'warning'
  loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false
}) => {
  const icons = {
    default: HelpCircle,
    danger: XCircle,
    warning: AlertTriangle
  }

  const iconColors = {
    default: 'text-blue-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500'
  }

  const buttonVariants = {
    default: 'default' as const,
    danger: 'destructive' as const,
    warning: 'default' as const
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex items-start gap-4 p-6">
        <div className={`flex-shrink-0 ${iconColors[variant]}`}>
          <Icon icon={icons[variant]} size="lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-6">{description}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : variant === 'warning'
                  ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Loading...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Alert Dialog
export interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  actionLabel?: string
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
  actionLabel = 'OK'
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
  }

  const iconColors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex items-start gap-4 p-6">
        <div className={`flex-shrink-0 ${iconColors[type]}`}>
          <Icon icon={icons[type]} size="lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-6">{description}</p>
          )}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Image Modal
export interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
  title?: string
  description?: string
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
  alt = '',
  title,
  description
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      animation="fade"
      backdropClassName="bg-black/80"
    >
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[80vh] object-contain"
        />
        {(title || description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            {title && <h3 className="font-semibold mb-1">{title}</h3>}
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>
        )}
      </div>
    </Modal>
  )
}

// Form Modal
export interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  size = 'md'
}) => {
  const actions: DialogAction[] = []

  if (onSubmit) {
    actions.push({
      label: cancelLabel,
      onClick: onClose,
      variant: 'secondary',
      disabled: loading
    })

    actions.push({
      label: loading ? 'Saving...' : submitLabel,
      onClick: onSubmit,
      variant: 'default',
      disabled: loading
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <DialogHeader title={title} description={description} />
      <DialogContent>{children}</DialogContent>
      {actions.length > 0 && <DialogFooter actions={actions} />}
    </Modal>
  )
}

const ModalVariants = {
  ConfirmDialog,
  AlertDialog,
  ImageModal,
  FormModal
};

export default ModalVariants;