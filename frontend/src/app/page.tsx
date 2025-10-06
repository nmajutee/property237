'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../components/navigation/Navbar'
import { Button } from '../components/ui/Button'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const features = [
    {
      icon: HomeIcon,
      title: 'Browse Properties',
      description: 'Discover thousands of verified properties across Cameroon'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Listings',
      description: 'All properties are verified by our team for authenticity'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees'
    },
    {
      icon: ChartBarIcon,
      title: 'Market Insights',
      description: 'Get real-time market data and analytics'
    }
  ]

  const stats = [
    { label: 'Active Listings', value: '1,000+' },
    { label: 'Happy Tenants', value: '5,000+' },
    { label: 'Verified Agents', value: '200+' },
    { label: 'Cities Covered', value: '15+' }
  ]

  const popularCities = [
    { name: 'Douala', count: 450 },
    { name: 'Yaoundé', count: 380 },
    { name: 'Bamenda', count: 120 },
    { name: 'Bafoussam', count: 95 },
    { name: 'Garoua', count: 80 },
    { name: 'Limbe', count: 75 }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-property237-light via-green-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Find Your Perfect Home in <span className="text-property237-primary">Cameroon</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Property237 connects tenants with verified property listings across Cameroon.
              Browse thousands of apartments, houses, and commercial spaces.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter city or location..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-property237-primary"
                    />
                  </div>
                </div>
                <select className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-property237-primary">
                  <option>Property Type</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Studio</option>
                </select>
                <Button size="lg" className="w-full">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Find a Property
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-property237-primary mb-2">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose Property237?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We make finding and listing properties simple, secure, and efficient
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-property237-light dark:bg-property237-dark/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-property237-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Explore Properties by City
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find your ideal location across Cameroon
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city, index) => (
              <button key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-property237-primary hover:shadow-lg transition-all text-center group">
                <MapPinIcon className="h-8 w-8 text-property237-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{city.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{city.count} properties</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-property237-primary to-property237-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl opacity-90">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-property237-primary font-bold text-2xl">1</div>
              <h3 className="text-2xl font-bold mb-3">Create Account</h3>
              <p className="opacity-90">Sign up as a tenant or agent in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-property237-primary font-bold text-2xl">2</div>
              <h3 className="text-2xl font-bold mb-3">Search & Browse</h3>
              <p className="opacity-90">Explore verified properties with detailed information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-property237-primary font-bold text-2xl">3</div>
              <h3 className="text-2xl font-bold mb-3">Connect & Move In</h3>
              <p className="opacity-90">Contact agents and schedule viewings</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="bg-white text-property237-primary hover:bg-gray-100">
                Get Started Now
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-property237-primary mb-4">Property237</h3>
              <p className="text-gray-400 text-sm">Your trusted platform for properties in Cameroon.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Tenants</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/properties" className="hover:text-property237-primary">Browse Properties</a></li>
                <li><a href="/saved" className="hover:text-property237-primary">Saved Properties</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Agents</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/list-property" className="hover:text-property237-primary">List Property</a></li>
                <li><a href="/pricing" className="hover:text-property237-primary">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-property237-primary">About Us</a></li>
                <li><a href="/contact" className="hover:text-property237-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Property237. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
