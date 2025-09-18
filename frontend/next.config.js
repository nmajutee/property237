/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move from experimental to main config
  typedRoutes: true,

  images: {
    domains: ['localhost', 'property237.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async rewrites() {
    // Only add rewrite if API URL is defined
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (apiUrl) {
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`,
        },
      ]
    }
    return []
  },

  webpack: (config) => {
    // Optimize bundle size for icons
    config.resolve.alias = {
      ...config.resolve.alias,
      '@heroicons/react/24/outline': '@heroicons/react/24/outline',
      '@heroicons/react/24/solid': '@heroicons/react/24/solid',
    }
    return config
  },
}

module.exports = nextConfig