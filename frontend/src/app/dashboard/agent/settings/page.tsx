'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  TrashIcon,
  UserCircleIcon,
  CameraIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'

export default function SettingsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>('')
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profileData = await authAPI.getProfile()
      const userData = (profileData as any).user
      setUser(userData)
      setProfileImage(userData.profile_picture || '')
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
      })
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/sign-in')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem('property237_access_token')
      const formData = new FormData()
      formData.append('profile_picture', file)

      const response = await fetch(`${getApiBaseUrl()}/auth/profile/update-picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfileImage(data.profile_picture)
        alert('Profile picture updated successfully!')
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('An error occurred while uploading')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('property237_access_token')
      const response = await fetch(`${getApiBaseUrl()}/auth/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        loadProfile()
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred')
    }
  }

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return
    
    try {
      await authAPI.logout()
      localStorage.removeItem('property237_access_token')
      localStorage.removeItem('property237_refresh_token')
      localStorage.removeItem('property237_user')
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      localStorage.removeItem('property237_access_token')
      localStorage.removeItem('property237_refresh_token')
      localStorage.removeItem('property237_user')
      router.push('/sign-in')
    }
  }

  const handleChangePassword = () => {
    router.push('/forgot-password')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion feature will be implemented soon.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property237</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agent Portal</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <Link href="/dashboard/agent" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChartBarIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href={"/dashboard/agent/properties" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <HomeIcon className="h-5 w-5" />
            My Properties
          </Link>
          <Link href={"/dashboard/agent/applications" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <UsersIcon className="h-5 w-5" />
            Applications
          </Link>
          <Link href={"/dashboard/agent/analytics" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Analytics
          </Link>
          <Link href={"/dashboard/agent/credits" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <CreditCardIcon className="h-5 w-5" />
            Credits
          </Link>
          <Link href={"/dashboard/agent/messages" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            Messages
          </Link>
          <Link href={"/dashboard/agent/settings" as any} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-property237-primary/10 text-property237-primary font-medium">
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-property237-primary/10 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-property237-primary">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <UserCircleIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            </div>

            {/* Profile Image */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-property237-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-bold text-property237-primary">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2 bg-property237-primary text-white rounded-full hover:bg-property237-primary-dark shadow-lg disabled:opacity-50"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {uploading ? 'Uploading...' : 'Click camera icon to update profile picture'}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium"
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                { key: 'marketing', label: 'Marketing Emails', desc: 'Receive updates about new features' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-property237-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'profileVisible', label: 'Profile Visible', desc: 'Make your profile visible to other users' },
                { key: 'showEmail', label: 'Show Email', desc: 'Display your email on your public profile' },
                { key: 'showPhone', label: 'Show Phone', desc: 'Display your phone number on your public profile' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key as keyof typeof privacy] })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy[item.key as keyof typeof privacy] ? 'bg-property237-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy[item.key as keyof typeof privacy] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <LockClosedIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Change Password
            </button>
          </div>

          {/* Logout */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-red-900 dark:text-red-400">Danger Zone</h2>
            </div>

            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
