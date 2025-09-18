import React, { useState, useRef } from 'react'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'
import { Avatar } from '../primitives/Avatar'
import { Badge } from '../primitives/Badge'
import { useClickOutside } from '../../hooks/useClickOutside'

// Navigation item interface
interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: number
  active?: boolean
}

// User menu item interface
interface UserMenuItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger'
}

// NavigationBar component props
export interface NavigationBarProps {
  /** Brand/logo configuration */
  brand?: {
    name: string
    logo?: string
    href?: string
  }
  /** Primary navigation items */
  navItems?: NavItem[]
  /** User information */
  user?: {
    name: string
    email: string
    avatar?: string
  }
  /** User dropdown menu items */
  userMenuItems?: UserMenuItem[]
  /** Search configuration */
  search?: {
    placeholder?: string
    onSearch?: (query: string) => void
    disabled?: boolean
  }
  /** Notification count */
  notificationCount?: number
  /** Notification click handler */
  onNotificationClick?: () => void
  /** Theme toggle handler */
  onThemeToggle?: () => void
  /** Current theme state */
  isDarkMode?: boolean
  /** Show theme toggle button */
  showThemeToggle?: boolean
  /** Mobile menu state control (optional external control) */
  isMobileMenuOpen?: boolean
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: (isOpen: boolean) => void
  /** Additional CSS classes */
  className?: string
}

// Default navigation items for property management
const defaultNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: HomeIcon, active: false },
  { label: 'Properties', href: '/properties', icon: BuildingOfficeIcon, active: false },
  { label: 'Tenants', href: '/tenants', icon: UsersIcon, active: false },
]

// Default user menu items
const defaultUserMenuItems: UserMenuItem[] = [
  { label: 'Profile Settings', href: '/profile', icon: UserCircleIcon },
  { label: 'Account Settings', href: '/settings', icon: Cog6ToothIcon },
  { label: 'Sign Out', onClick: () => console.log('Sign out'), icon: ArrowRightOnRectangleIcon, variant: 'danger' }
]

export const NavigationBar: React.FC<NavigationBarProps> = ({
  brand = { name: 'Property237', href: '/' },
  navItems = defaultNavItems,
  user = { name: 'John Doe', email: 'john@example.com' },
  userMenuItems = defaultUserMenuItems,
  search,
  notificationCount = 0,
  onNotificationClick,
  onThemeToggle,
  isDarkMode = false,
  showThemeToggle = false,
  isMobileMenuOpen: externalMobileMenuOpen,
  onMobileMenuToggle,
  className = ''
}) => {
  // Internal mobile menu state (used when not externally controlled)
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Use external state if provided, otherwise use internal state
  const isMobileMenuOpen = externalMobileMenuOpen ?? internalMobileMenuOpen
  const setMobileMenuOpen = (isOpen: boolean) => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle(isOpen)
    } else {
      setInternalMobileMenuOpen(isOpen)
    }
  }

  // Refs for click outside detection
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useClickOutside(userDropdownRef, () => setUserDropdownOpen(false))
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false))

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search?.onSearch && searchQuery.trim()) {
      search.onSearch(searchQuery.trim())
    }
  }

  // Handle navigation item click
  const handleNavItemClick = (item: NavItem) => {
    // Close mobile menu when item is clicked
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false)
    }

    // If it's a link, let the browser handle it
    // If it has an onClick handler, call it
    if (item.href) {
      window.location.href = item.href
    }
  }

  // Handle user menu item click
  const handleUserMenuItemClick = (item: UserMenuItem) => {
    setUserDropdownOpen(false)

    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      window.location.href = item.href
    }
  }

  return (
    <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Brand + Desktop Navigation */}
          <div className="flex">
            {/* Brand/Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href={brand.href}
                className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 w-8 object-contain"
                  />
                )}
                <span>{brand.name}</span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavItemClick(item)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${item.active
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="danger" size="sm">
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right side: Search + Notifications + User Menu + Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Search Bar (Desktop) */}
            {search && (
              <form onSubmit={handleSearchSubmit} className="hidden md:block">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={search.placeholder || 'Search properties...'}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    disabled={search.disabled}
                    className="pl-10 w-64"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>
            )}

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNotificationClick}
                className="relative p-2"
              >
                <BellIcon className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="danger"
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
                  >
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Theme Toggle */}
            {showThemeToggle && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onThemeToggle}
                  className="p-2"
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-2"
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="sm"
                  initials={user.name.charAt(0)}
                />
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {userMenuItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={index}
                          onClick={() => handleUserMenuItemClick(item)}
                          className={`
                            w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors text-left
                            ${item.variant === 'danger'
                              ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700" ref={mobileMenuRef}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            {search && (
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={search.placeholder || 'Search properties...'}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    disabled={search.disabled}
                    className="pl-10 w-full"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>
            )}

            {/* Mobile Navigation Links */}
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavItemClick(item)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium transition-colors
                    ${item.active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="danger" size="sm">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </button>
              )
            })}

            {/* Mobile Theme Toggle */}
            {showThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}