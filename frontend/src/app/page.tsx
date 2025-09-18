'use client'

import { Button } from '../components/ui/Button'
import { useThemeToggle } from '../design-system/ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function HomePage() {
  const {
    theme,
    actualTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme
  } = useThemeToggle()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-4">
            Property237
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Modern Real Estate Management Platform for Cameroon
          </p>

          {/* Quick Navigation */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.href = '/signup'}>
              Try Sign Up Flow
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Login Demo
            </Button>
          </div>
        </header>

        {/* Theme Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Theme: {theme} (showing: {actualTheme})
            </h2>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={setLightTheme}
                leftIcon={<Sun className="h-4 w-4" />}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={setDarkTheme}
                leftIcon={<Moon className="h-4 w-4" />}
              >
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={setSystemTheme}
                leftIcon={<Monitor className="h-4 w-4" />}
              >
                System
              </Button>
            </div>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Button Components
          </h2>

          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button loading loadingText="Loading...">Loading</Button>
                <Button disabled>Disabled</Button>
                <Button leftIcon={<Sun className="h-4 w-4" />}>With Icon</Button>
              </div>
            </div>

            <div>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>
        </div>

        {/* Simple Color Test */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Basic Colors Test
          </h2>

          <div className="grid grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs">Red</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs">Green</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs">Yellow</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs">Blue</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs">Purple</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs">Gray</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}