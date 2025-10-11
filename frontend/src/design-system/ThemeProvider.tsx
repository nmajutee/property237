'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'dark' | 'light'
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  actualTheme: 'light',
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'property237-ui-theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only accessing localStorage after mount
  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme
    if (stored && ['dark', 'light', 'system'].includes(stored)) {
      setTheme(stored)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    let newActualTheme: 'dark' | 'light' = 'light'

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      newActualTheme = systemTheme
    } else {
      root.classList.add(theme)
      newActualTheme = theme === 'dark' ? 'dark' : 'light'
    }

    setActualTheme(newActualTheme)

    // Update theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        'content',
        newActualTheme === 'dark' ? '#171717' : '#ffffff'
      )
    }
  }, [theme, enableSystem])

  const handleThemeChange = React.useCallback((newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }, [storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      const root = window.document.documentElement

      root.classList.remove('light', 'dark')
      root.classList.add(systemTheme)
      setActualTheme(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: handleThemeChange,
      actualTheme,
    }),
    [theme, handleThemeChange, actualTheme]
  )

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// Theme toggle hook for easy usage
export const useThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [theme, setTheme])

  const setLightTheme = React.useCallback(() => setTheme('light'), [setTheme])
  const setDarkTheme = React.useCallback(() => setTheme('dark'), [setTheme])
  const setSystemTheme = React.useCallback(() => setTheme('system'), [setTheme])

  return {
    theme,
    actualTheme,
    toggleTheme,
    setTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    isLight: actualTheme === 'light',
    isDark: actualTheme === 'dark',
    isSystem: theme === 'system',
  }
}