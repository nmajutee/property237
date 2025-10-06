'use client'

import React from 'react'
import Navbar from '../../components/navigation/Navbar'
import { Button } from '../../components/ui/Button'
import {
  UserGroupIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Transparency',
      description: 'We verify every property and agent to ensure a secure experience for all users.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Quality Assurance',
      description: 'All listings undergo thorough inspection before being published on our platform.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community First',
      description: 'We prioritize building lasting relationships between tenants, agents, and landlords.'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Market Expertise',
      description: 'Our team has deep knowledge of the Cameroonian real estate market.'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Properties Listed' },
    { value: '5,000+', label: 'Happy Tenants' },
    { value: '500+', label: 'Verified Agents' },
    { value: '15+', label: 'Cities Covered' }
  ]

  const team = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      image: null,
      bio: 'Passionate about making property rental accessible to everyone in Cameroon.'
    },
    {
      name: 'Jane Smith',
      role: 'Head of Operations',
      image: null,
      bio: '10+ years of experience in real estate and property management.'
    },
    {
      name: 'Mike Johnson',
      role: 'CTO',
      image: null,
      bio: 'Building technology solutions to revolutionize the property market.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-property237-primary to-property237-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About Property237</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're on a mission to make property rental simple, transparent, and accessible
            for everyone in Cameroon.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Founded in 2023, Property237 was born out of a simple observation: finding
                quality rental properties in Cameroon was unnecessarily difficult and opaque.
              </p>
              <p>
                We set out to create a platform that brings transparency, trust, and efficiency
                to the property rental market. Today, we're proud to serve thousands of tenants
                and work with hundreds of verified agents across major cities in Cameroon.
              </p>
              <p>
                Our platform leverages technology to make property search easier, pricing more
                transparent, and the entire rental process more secure for everyone involved.
              </p>
            </div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-96 flex items-center justify-center">
            <BuildingOfficeIcon className="h-32 w-32 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-property237-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <value.icon className="h-12 w-12 text-property237-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The people behind Property237
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center"
              >
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-property237-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-property237-primary to-property237-dark rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of satisfied tenants and agents on our platform
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" variant="outline" className="bg-white text-property237-primary hover:bg-gray-100">
              Browse Properties
            </Button>
            <Button size="lg" className="bg-white text-property237-primary hover:bg-gray-100">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
