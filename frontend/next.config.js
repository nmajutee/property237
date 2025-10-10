/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move from experimental to main config
  typedRoutes: true,

  images: {
    domains: [
      'localhost',
      'property237.onrender.com',
      'property237.com'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Rewrites are handled by vercel.json in production
  // This allows local development without conflicts
  async rewrites() {
    // Only use rewrites in development (local)
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ]
    }
    // In production, vercel.json handles the rewrites
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