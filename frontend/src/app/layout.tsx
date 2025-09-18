import { ThemeProvider } from '../design-system/ThemeProvider'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata = {
  title: 'Property237 - Modern Real Estate Management',
  description: 'Enterprise real estate platform for Cameroon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} ${manrope.variable}`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="property237-ui-theme"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}