'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  BellIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  TrashIcon,
  UserCircleIcon,
  CameraIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { authAPI, getApiBaseUrl } from '../../../../services/api'
import DashboardLayout from '../../../../components/layouts/DashboardLayout'

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

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const profileData = await authAPI.getProfile()
      const userData = (profileData as any).user
      setUser(userData)
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
      })
      setProfileImage(userData.profile_picture || '')
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/sign-in')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('profile_picture', file)

    try {
      const token = localStorage.getItem('property237_access_token')
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
        alert('Profile picture updated successfully')
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('An error occurred while uploading')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('property237_access_token')
      const response = await fetch(`${getApiBaseUrl()}/auth/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Profile updated successfully')
        loadSettings()
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('An error occurred')
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      localStorage.removeItem('property237_access_token')
      localStorage.removeItem('property237_refresh_token')
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem('property237_access_token')
      localStorage.removeItem('property237_refresh_token')
      router.push('/sign-in')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pageTitle="Settings"
      pageDescription="Manage your account settings and preferences"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <UserCircleIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            </div>

            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-property237-primary">
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-2 bg-property237-primary text-white rounded-full hover:bg-property237-primary-dark disabled:opacity-50"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Click the camera icon to upload a new photo</p>
                  <p className="text-xs mt-1">JPG, PNG or GIF (max 5MB)</p>
                  {uploading && <p className="text-property237-primary mt-1">Uploading...</p>}
                </div>
              </div>
            </div>

            {/* Form Fields */}
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
            </div>

            <button
              onClick={handleSaveProfile}
              className="mt-6 px-6 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium"
            >
              Save Changes
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <BellIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive {key} notifications
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-property237-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-property237-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <LockClosedIcon className="h-6 w-6 text-property237-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>

            <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium text-left">
              Change Password
            </button>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Logout */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Logout</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-property237-primary text-white rounded-lg hover:bg-property237-primary-dark font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
