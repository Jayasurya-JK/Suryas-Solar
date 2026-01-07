/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // Enforce no trailing slashes to match canonical tags
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect www to non-www (enforce suryassolar.com as canonical)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.suryassolar.com',
          },
        ],
        destination: 'https://suryassolar.com/:path*',
        permanent: true, // 301 redirect
      },
      // Redirect HTTP to HTTPS (if somehow accessed via HTTP)
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://suryassolar.com/:path*',
        permanent: true, // 301 redirect
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
