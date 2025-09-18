import React from 'react';
import { cn } from '../../design-system/utils';
import { User } from 'lucide-react';
import { Icon } from './Icon';

export interface AvatarProps {
  /**
   * Avatar size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alternative text for image
   */
  alt?: string;
  /**
   * Fallback initials or text
   */
  initials?: string;
  /**
   * Avatar shape
   */
  variant?: 'circle' | 'square';
  /**
   * Show online status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
}

// Size styles
const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

// Status indicator sizes
const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

// Status colors
const statusColors = {
  online: 'bg-success',
  offline: 'bg-neutral-400',
  away: 'bg-yellow-500',
  busy: 'bg-danger',
};

// Icon sizes for fallback
const iconSizes = {
  xs: 'sm' as const,
  sm: 'sm' as const,
  md: 'sm' as const,
  lg: 'md' as const,
  xl: 'lg' as const,
  '2xl': 'xl' as const,
};

/**
 * Livest Design System Avatar Component
 *
 * User avatar with image, initials fallback, status indicators, and multiple sizes.
 * Supports both circular and square variants with accessibility features.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@/components/primitives/Avatar';
 *
 * // Basic avatar with image
 * <Avatar src="/user.jpg" alt="John Doe" />
 *
 * // Initials fallback
 * <Avatar initials="JD" alt="John Doe" />
 *
 * // With status indicator
 * <Avatar
 *   src="/user.jpg"
 *   alt="John Doe"
 *   status="online"
 *   size="lg"
 * />
 *
 * // Square variant
 * <Avatar
 *   src="/company-logo.jpg"
 *   variant="square"
 *   size="xl"
 * />
 *
 * // Clickable avatar
 * <Avatar
 *   src="/user.jpg"
 *   alt="John Doe"
 *   onClick={() => console.log('Avatar clicked')}
 * />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  src,
  alt = '',
  initials,
  variant = 'circle',
  status,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);

  const showImage = src && !imageError;
  const showInitials = !showImage && initials;
  const showIcon = !showImage && !showInitials;

  const avatarClasses = cn(
    'relative inline-flex items-center justify-center overflow-hidden',
    'bg-neutral-100 dark:bg-neutral-800',
    'font-medium text-neutral-600 dark:text-neutral-300',
    sizeStyles[size],
    variant === 'circle' ? 'rounded-full' : 'rounded-lg',
    onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className={avatarClasses} onClick={onClick}>
      {/* Image */}
      {showImage && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            variant === 'circle' ? 'rounded-full' : 'rounded-lg',
            imageLoading && 'opacity-0'
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Initials fallback */}
      {showInitials && (
        <span className="select-none">
          {initials}
        </span>
      )}

      {/* Icon fallback */}
      {showIcon && (
        <Icon
          icon={User}
          size={iconSizes[size]}
          variant="muted"
          decorative
        />
      )}

      {/* Status indicator */}
      {status && (
        <div className={cn(
          'absolute bottom-0 right-0',
          'border-2 border-white dark:border-neutral-900',
          'rounded-full',
          statusSizes[size],
          statusColors[status]
        )} />
      )}
    </div>
  );
};

// Avatar group for showing multiple avatars
export interface AvatarGroupProps {
  /**
   * Avatar size for all avatars in group
   */
  size?: AvatarProps['size'];
  /**
   * Maximum number of avatars to show
   */
  max?: number;
  /**
   * Avatar data
   */
  avatars: Array<{
    src?: string;
    alt?: string;
    initials?: string;
  }>;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler for overflow indicator
   */
  onOverflowClick?: () => void;
}

/**
 * Avatar Group - Display multiple avatars with overlap and overflow handling
 */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  size = 'md',
  max = 4,
  avatars,
  className,
  onOverflowClick,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const overflowCount = avatars.length - max;
  const hasOverflow = overflowCount > 0;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative">
          <Avatar
            size={size}
            src={avatar.src}
            alt={avatar.alt}
            initials={avatar.initials}
            className="ring-2 ring-white dark:ring-neutral-900"
          />
        </div>
      ))}

      {hasOverflow && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center',
            'bg-neutral-200 dark:bg-neutral-700',
            'font-medium text-neutral-600 dark:text-neutral-300',
            'ring-2 ring-white dark:ring-neutral-900',
            'rounded-full',
            sizeStyles[size],
            onOverflowClick && 'cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors'
          )}
          onClick={onOverflowClick}
        >
          <span className="text-xs">+{overflowCount}</span>
        </div>
      )}
    </div>
  );
};