'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/Button'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  CreditCardIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

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
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Check if user is logged in and fetch fresh data
    const token = localStorage.getItem('property237_access_token')
    const userData = localStorage.getItem('property237_user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        // Fetch fresh user data from backend
        fetchUserProfile(token)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [pathname]) // Re-check when pathname changes

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Update user state with fresh data
        setUser(data)
        // Update localStorage
        localStorage.setItem('property237_user', JSON.stringify(data))
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout()
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('property237_access_token')
    localStorage.removeItem('property237_refresh_token')
    localStorage.removeItem('property237_user')
    setUser(null)
    router.push('/')
  }

  // Public navbar (not logged in)
  const publicLinks = [
    { href: '/properties', label: 'Browse Properties', icon: BuildingOfficeIcon },
    { href: '/about', label: 'About', icon: null },
    { href: '/contact', label: 'Contact', icon: null }
  ]

  // Tenant navbar
  const tenantLinks = [
    { href: '/dashboard/tenant', label: 'Dashboard', icon: HomeIcon },
    { href: '/properties', label: 'Browse Properties', icon: MagnifyingGlassIcon },
    { href: '/my-favorites', label: 'My Favorites', icon: BuildingOfficeIcon },
    { href: '/my-applications', label: 'Applications', icon: DocumentTextIcon }
  ]

  // Agent navbar
  const agentLinks = [
    { href: '/dashboard/agent', label: 'Dashboard', icon: HomeIcon },
    { href: '/my-properties', label: 'My Properties', icon: BuildingOfficeIcon },
    { href: '/add-property', label: 'Add Property', icon: null },
    { href: '/analytics', label: 'Analytics', icon: ChartBarIcon }
  ]

  // Admin navbar
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/users', label: 'Users', icon: UsersIcon },
    { href: '/admin/properties', label: 'Properties', icon: BuildingOfficeIcon },
    { href: '/admin/transactions', label: 'Transactions', icon: CreditCardIcon },
    { href: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon }
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
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-property237-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-property237-primary dark:hover:text-property237-primary'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Credits Badge */}
                <Link href="/credits">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Credits</span>
                  </Button>
                </Link>

                {/* Notifications */}
                <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-property237-primary dark:hover:text-property237-primary">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.full_name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.full_name}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
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
                key={link.href}
                href={link.href as any}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-property237-light text-property237-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon && <link.icon className="h-5 w-5" />}
                <span>{link.label}</span>
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
