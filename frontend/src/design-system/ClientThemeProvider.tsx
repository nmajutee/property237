'use client'

import { ThemeProvider } from './ThemeProvider'

interface ClientThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: 'dark' | 'light' | 'system'
  storageKey?: string
  enableSystem?: boolean
}

export function ClientThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'property237-ui-theme',
  enableSystem = true
}: ClientThemeProviderProps) {
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem={enableSystem}
    >
      {children}
    </ThemeProvider>
  )
}