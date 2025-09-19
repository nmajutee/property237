import { ClientThemeProvider } from "../design-system/ClientThemeProvider"
import "./globals.css"

export const metadata = {
  title: "Property237",
  description: "Your trusted property management platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
}
