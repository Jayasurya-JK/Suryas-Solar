/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // Enforce no trailing slashes to match canonical tags
  images: {
    unoptimized: true,
  },
  // Host/www redirects stay at Cloudflare (or Vercel domain settings), not here.
  // Next.js host redirects previously looped with Cloudflare "Flexible" SSL.
  async redirects() {
    return [
      {
        source: '/blog/2025-12-07-rooftop-solar-structure-types-tamil-nadu',
        destination: '/blog/2025-12-02-rooftop-solar-structure-types-tamil-nadu',
        permanent: true,
      },
      {
        source: '/blog/2025-12-11-solar-myths-vs-facts-tamil-nadu',
        destination: '/blog/2025-12-04-solar-myths-vs-facts-tamil-nadu',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig
