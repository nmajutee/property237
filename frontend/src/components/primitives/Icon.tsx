import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../design-system/utils';

export interface IconProps {
  /**
   * The Lucide icon component to render
   */
  icon: LucideIcon;
  /**
   * Icon size - maps to design system spacing tokens
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Icon color variant
   */
  variant?: 'default' | 'muted' | 'brand' | 'success' | 'warning' | 'danger' | 'inverse';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
  /**
   * Whether the icon is decorative (hidden from screen readers)
   */
  decorative?: boolean;
  /**
   * Custom color (overrides variant)
   */
  color?: string;
}

const sizeStyles = {
  xs: 'w-3 h-3', // 12px
  sm: 'w-4 h-4', // 16px
  md: 'w-5 h-5', // 20px
  lg: 'w-6 h-6', // 24px
  xl: 'w-8 h-8', // 32px
};

const variantStyles = {
  default: 'text-text-primary',
  muted: 'text-text-muted',
  brand: 'text-brand-500',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  inverse: 'text-text-inverse',
};

/**
 * Livest Design System Icon Component
 *
 * Standardized wrapper for Lucide icons with consistent sizing, colors, and accessibility.
 * Supports design system color variants and proper ARIA attributes.
 *
 * @example
 * ```tsx
 * import { Search, Heart } from 'lucide-react';
 * import { Icon } from '@/components/primitives/Icon';
 *
 * // Basic usage
 * <Icon icon={Search} size="md" />
 *
 * // With semantic variant
 * <Icon icon={Heart} variant="danger" aria-label="Remove from favorites" />
 *
 * // Decorative icon (hidden from screen readers)
 * <Icon icon={Search} decorative className="ml-2" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  variant = 'default',
  className,
  'aria-label': ariaLabel,
  decorative = false,
  color,
  ...props
}) => {
  const iconClasses = cn(
    // Base styles
    'inline-block flex-shrink-0',
    // Size styles
    sizeStyles[size],
    // Color variant styles (unless custom color provided)
    !color && variantStyles[variant],
    // Custom classes
    className
  );

  const iconProps = {
    className: iconClasses,
    style: color ? { color } : undefined,
    // Accessibility attributes
    ...(decorative
      ? { 'aria-hidden': true }
      : {
          role: ariaLabel ? 'img' : undefined,
          'aria-label': ariaLabel,
        }
    ),
    ...props,
  };

  return <IconComponent {...iconProps} />;
};

// Convenience components for common icon patterns
export interface IconButtonProps extends Omit<IconProps, 'decorative'> {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Icon Button - Clickable icon with proper accessibility
 */
export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  className,
  ...iconProps
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={loading ? 'Loading...' : ariaLabel}
      className={cn(
        // Base button styles
        'inline-flex items-center justify-center',
        'rounded-md transition-colors duration-fast',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        // Interactive states
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'active:bg-neutral-200 dark:active:bg-neutral-700',
        // Disabled state
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        // Padding based on icon size
        iconProps.size === 'xs' && 'p-1',
        iconProps.size === 'sm' && 'p-1.5',
        iconProps.size === 'md' && 'p-2',
        iconProps.size === 'lg' && 'p-2.5',
        iconProps.size === 'xl' && 'p-3',
        className
      )}
    >
      <Icon
        {...iconProps}
        aria-label={undefined} // Handled by button
        decorative
      />
    </button>
  );
};

// Export common icon sets for easy importing
export {
  // Navigation
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,

  // Actions
  Search,
  Filter,
  ArrowUpDown as Sort,
  Plus,
  Minus,
  Edit,
  Trash,
  Download,
  Upload,
  Share,
  Heart,
  Star,

  // Status & Feedback
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Eye,
  EyeOff,

  // Content
  Image,
  Video,
  File,
  FileText,
  Link,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,

  // Property specific
  Building,
  Home as House,
  MapPin as Location,
  Car,
  Bed,
  Bath,
  Square,

  // User & Account
  User,
  Users,
  Settings,
  LogIn,
  LogOut,
  Shield,

} from 'lucide-react';