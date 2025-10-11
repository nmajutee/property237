'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/navigation/Navbar'
import { Button } from '../../components/ui/Button'
import { getApiBaseUrl } from '@/services/api'
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface User {
  id: number
  username: string
  email: string
  full_name: string
  phone_number: string
  user_type: string
  profile_picture?: string
  is_phone_verified: boolean
  is_email_verified: boolean
  date_joined: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: ''
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('property237_access_token')
      if (!token) {
        router.push('/sign-in')
        return
      }

      const response = await fetch(`${getApiBaseUrl()}/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setFormData({
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number
        })
      } else {
        router.push('/sign-in')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('property237_access_token')
      const response = await fetch(`${getApiBaseUrl()}/auth/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-property237-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-property237-primary to-property237-dark px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="h-32 w-32 rounded-full border-4 border-white"
                />
              ) : (
                <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{user.full_name}</h1>
            <p className="text-white/90">@{user.username}</p>
            <div className="mt-4 inline-block px-4 py-1 bg-white/20 rounded-full">
              <span className="text-white capitalize">{user.user_type}</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {!isEditing ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <EnvelopeIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                      <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                      {user.is_email_verified ? (
                        <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                      ) : (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">⚠ Not Verified</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <PhoneIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                      <p className="text-lg text-gray-900 dark:text-white">{user.phone_number}</p>
                      {user.is_phone_verified ? (
                        <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                      ) : (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">⚠ Not Verified</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CalendarIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {new Date(user.date_joined).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Profile
                  </h2>
                  <div className="space-x-2">
                    <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-property237-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
