'use client'

import type { Route } from 'next'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getApiBaseUrl } from '@/services/api'
import {
  HomeIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  CreditCardIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '@/design-system/ThemeProvider'

type NavLink = {
  href: Route | { pathname: Route; query: Record<string, string> }
  activePath: string
  label: string
}

interface User {
  id: number
  username: string
  email: string
  full_name: string
  user_type: 'tenant' | 'agent' | 'admin'
  profile_picture?: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [language, setLanguage] = useState('EN')
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const handleLogout = useCallback(() => {
    localStorage.removeItem('property237_access_token')
    localStorage.removeItem('property237_refresh_token')
    localStorage.removeItem('property237_user')
    setUser(null)
    router.push('/')
  }, [router])

  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        localStorage.setItem('property237_user', JSON.stringify(data))
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [handleLogout])

  useEffect(() => {
    const token = localStorage.getItem('property237_access_token')
    const userData = localStorage.getItem('property237_user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        fetchUserProfile(token)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [fetchUserProfile, pathname])

  // Public navbar (not logged in)
  const publicLinks: NavLink[] = [
    { href: '/' as Route, activePath: '/', label: 'Home' },
    { href: '/properties' as Route, activePath: '/properties', label: 'Buy' },
    { href: { pathname: '/properties', query: { type: 'rent' } }, activePath: '/properties', label: 'Rent' },
    { href: '/agents' as Route, activePath: '/agents', label: 'Find Agents' },
    { href: '/about' as Route, activePath: '/about', label: 'About' },
    { href: '/contact' as Route, activePath: '/contact', label: 'Contact' }
  ]

  // Tenant navbar
  const tenantLinks: NavLink[] = [
    { href: '/dashboard/tenant' as Route, activePath: '/dashboard/tenant', label: 'Dashboard' },
    { href: '/properties' as Route, activePath: '/properties', label: 'Buy' },
    { href: { pathname: '/properties', query: { type: 'rent' } }, activePath: '/properties', label: 'Rent' },
    { href: '/my-favorites' as Route, activePath: '/my-favorites', label: 'Favorites' },
    { href: '/my-applications' as Route, activePath: '/my-applications', label: 'Applications' },
    { href: '/chat' as Route, activePath: '/chat', label: 'Messages' },
    { href: '/payments' as Route, activePath: '/payments', label: 'Payments' },
    { href: '/notifications' as Route, activePath: '/notifications', label: 'Notifications' }
  ]

  // Agent navbar
  const agentLinks: NavLink[] = [
    { href: '/dashboard/agent' as Route, activePath: '/dashboard/agent', label: 'Dashboard' },
    { href: '/dashboard/agent/properties' as Route, activePath: '/dashboard/agent/properties', label: 'My Listings' },
    { href: '/properties' as Route, activePath: '/properties', label: 'Browse Properties' },
    { href: '/chat' as Route, activePath: '/chat', label: 'Messages' },
    { href: '/dashboard/agent/analytics' as Route, activePath: '/dashboard/agent/analytics', label: 'Analytics' },
    { href: '/payments' as Route, activePath: '/payments', label: 'Payments' },
    { href: '/notifications' as Route, activePath: '/notifications', label: 'Notifications' }
  ]

  // Admin navbar
  const adminLinks: NavLink[] = [
    { href: '/dashboard/admin' as Route, activePath: '/dashboard/admin', label: 'Dashboard' },
    { href: '/properties' as Route, activePath: '/properties', label: 'Properties' },
    { href: '/agents' as Route, activePath: '/agents', label: 'Agents' },
    { href: '/payments' as Route, activePath: '/payments', label: 'Payments' },
    { href: '/analytics' as Route, activePath: '/analytics', label: 'Analytics' },
    { href: '/notifications' as Route, activePath: '/notifications', label: 'Notifications' }
  ]

  const getNavLinks = () => {
    if (!user) return publicLinks
    if (user.user_type === 'tenant') return tenantLinks
    if (user.user_type === 'agent') return agentLinks
    if (user.user_type === 'admin') return adminLinks
    return publicLinks
  }

  const navLinks = getNavLinks()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <HomeIcon className="h-8 w-8 text-property237-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Property237
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={`${link.activePath}-${link.label}`}
                href={link.href}
                className={`text-sm font-medium transition-colors font-heading ${
                  pathname === link.activePath
                    ? 'text-property237-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-property237-primary dark:hover:text-property237-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-1">
            {user && user.user_type === 'agent' && (
              <Link
                href="/add-property"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium font-heading text-gray-700 dark:text-gray-300 hover:text-property237-primary transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Property</span>
              </Link>
            )}

            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-property237-primary transition-colors">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium font-heading text-gray-700 dark:text-gray-300 hover:text-property237-primary transition-colors"
                  >
                    {user.profile_picture ? (
                      <Image
                        src={user.profile_picture}
                        alt={user.full_name}
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="h-5 w-5" />
                    )}
                    <span>{user.full_name}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserCircleIcon className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/credits"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <CreditCardIcon className="h-4 w-4" />
                        <span>Credits</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium font-heading text-gray-700 dark:text-gray-300 hover:text-property237-primary transition-colors"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

            {/* Language Switcher - Toggle Button */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')}
              className="px-3 py-1.5 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 hover:text-property237-primary transition-colors"
              title={`Switch to ${language === 'EN' ? 'French' : 'English'}`}
            >
              {language}
            </button>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-property237-primary transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={`${link.activePath}-${link.label}`}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium font-heading ${
                  pathname === link.activePath
                    ? 'bg-property237-light text-property237-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <Link
                  href="/credits"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  <span>Credits</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-property237-primary text-white hover:bg-property237-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
