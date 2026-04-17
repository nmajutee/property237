import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ClientThemeProvider } from "../design-system/ClientThemeProvider"
import { QueryProvider } from "../providers/QueryProvider"
import { I18nProvider } from "../lib/i18n"
import localFont from 'next/font/local'
import { DM_Sans } from 'next/font/google'
import { absoluteUrl, getSiteUrl } from '@/lib/site'
import "./globals.css"
import 'leaflet/dist/leaflet.css'

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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Property237 | Real Estate Marketplace in Cameroon',
    template: '%s | Property237',
  },
  description:
    'Property237 helps renters, buyers, landlords, and agents discover verified real estate listings across Cameroon.',
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: 'Property237 | Real Estate Marketplace in Cameroon',
    description:
      'Discover verified apartments, homes, and commercial real estate across Cameroon with Property237.',
    url: absoluteUrl('/'),
    siteName: 'Property237',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Property237 | Real Estate Marketplace in Cameroon',
    description:
      'Search verified apartments, homes, and commercial properties across Cameroon.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${craftworkGrotesk.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <QueryProvider>
          <I18nProvider>
            <ClientThemeProvider>
              {children}
            </ClientThemeProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
