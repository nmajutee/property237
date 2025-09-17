/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost', 'property237.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
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