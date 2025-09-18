'use client'

import React, { Fragment, ReactNode, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../design-system/utils'
import { Icon } from '../primitives/Icon'
import { Button } from '../ui/Button'
import { X } from 'lucide-react'

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean
  /**
   * Callback when the modal should be closed
   */
  onClose: () => void
  /**
   * Modal content
   */
  children: ReactNode
  /**
   * Modal size variant
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean
  /**
   * Whether clicking outside closes the modal
   */
  closeOnBackdropClick?: boolean
  /**
   * Whether pressing ESC closes the modal
   */
  closeOnEscape?: boolean
  /**
   * Initial focus element selector
   */
  initialFocus?: string
  /**
   * Additional CSS classes for the modal panel
   */
  className?: string
  /**
   * Additional CSS classes for the backdrop
   */
  backdropClassName?: string
  /**
   * Disable scroll lock on body
   */
  disableScrollLock?: boolean
  /**
   * Custom z-index
   */
  zIndex?: number
  /**
   * Animation variant
   */
  animation?: 'fade' | 'slide' | 'scale' | 'none'
}

// Size mappings based on design system
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  fullscreen: 'max-w-none w-screen h-screen'
}

// Animation variants for framer motion
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  none: {
    initial: {},
    animate: {},
    exit: {}
  }
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  initialFocus,
  className = '',
  backdropClassName = '',
  disableScrollLock = false,
  zIndex = 50,
  animation = 'scale'
}) => {
  // Handle scroll lock
  useEffect(() => {
    if (disableScrollLock) return

    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow
      const originalPaddingRight = document.body.style.paddingRight

      // Calculate scrollbar width
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

      // Apply scroll lock
      document.body.style.overflow = 'hidden'
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }

      return () => {
        // Restore original values
        document.body.style.overflow = originalOverflow
        document.body.style.paddingRight = originalPaddingRight
      }
    }
  }, [isOpen, disableScrollLock])

  // Handle initial focus
  useEffect(() => {
    if (isOpen && initialFocus) {
      const element = document.querySelector(initialFocus) as HTMLElement
      if (element) {
        // Small delay to ensure the modal is rendered
        setTimeout(() => {
          element.focus()
        }, 100)
      }
    }
  }, [isOpen, initialFocus])

  const currentAnimation = animationVariants[animation]
  const sizeClass = size === 'fullscreen' ? sizeClasses[size] : `w-full ${sizeClasses[size]}`

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          open={isOpen}
          onClose={closeOnEscape ? onClose : () => {}}
          className="relative"
          style={{ zIndex }}
        >
          {/* Backdrop */}
          <motion.div
            className={cn(
              'fixed inset-0 bg-black/50 backdrop-blur-sm',
              backdropClassName
            )}
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Panel Container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={cn(
                'flex min-h-full items-center justify-center p-4',
                size === 'fullscreen' ? 'p-0' : 'p-4 text-center sm:p-0'
              )}
            >
              <Dialog.Panel
                className={cn(
                  // Base styles
                  'relative transform rounded-lg bg-white text-left shadow-xl',
                  // Size classes
                  sizeClass,
                  // Fullscreen specific styles
                  size === 'fullscreen'
                    ? 'rounded-none'
                    : 'mx-auto my-8',
                  // Custom classes
                  className
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  variants={currentAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: 0.3,
                    ...(animation === 'scale' ? {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    } : {})
                  }}
                  className="w-full h-full"
                >
                  {/* Close Button */}
                  {showCloseButton && (
                    <div className="absolute right-4 top-4 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                      >
                        <Icon icon={X} size="sm" />
                      </Button>
                    </div>
                  )}

                  {/* Content */}
                  {children}
                </motion.div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default Modal