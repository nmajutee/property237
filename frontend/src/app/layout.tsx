import type { ReactNode } from 'react'
import { ClientThemeProvider } from "../design-system/ClientThemeProvider"
import localFont from 'next/font/local'
import { DM_Sans } from 'next/font/google'
import "./globals.css"

// Craftwork Grotesk - For headings, titles, buttons, and UI elements
const craftworkGrotesk = localFont({
  src: [
    {
      path: './fonts/craftwork-grotesk/CraftworkGrotesk-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/craftwork-grotesk/CraftworkGrotesk-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/craftwork-grotesk/CraftworkGrotesk-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/craftwork-grotesk/CraftworkGrotesk-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/craftwork-grotesk/CraftworkGrotesk-Heavy.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-craftwork-grotesk',
  display: 'swap',
})

// DM Sans - For body text, descriptions, and readable content
const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: "Property237 - Real Estate for Living and Investments",
  description: "Your trusted property management platform in Cameroon",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${craftworkGrotesk.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
}
