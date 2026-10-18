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
      // Short link for QR codes and WhatsApp: opens the Google review form directly
      { source: '/review', destination: 'https://g.page/r/CVM40XnlQRGaEBM/review', permanent: false },
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
      // Mistyped URLs seen in Search Console (Oct 2026)
      ...[
        ['/blog/20-mono-vs-bifacial-solar-panels', '/blog/2026-01-07-mono-vs-bifacial-solar-panels'],
        ['/blog/20-26-01-07-mono-vs-bifacial-solar-panels', '/blog/2026-01-07-mono-vs-bifacial-solar-panels'],
        ['/blog/20-mono-vs-bifacial-solar-panels-is-the-extra-cost-worth-it', '/blog/2026-01-07-mono-vs-bifacial-solar-panels'],
        ['/blog/20-vs-bifacial-solar-panels-is-the-extra-cost-worth-it-in-2026', '/blog/2026-01-07-mono-vs-bifacial-solar-panels'],
        ['/blog/2025-12-01-best-solar-panel-brands-tamil-nud-puducherry', '/blog/2025-12-01-best-solar-panel-brands-tamil-nadu-puducherry'],
        ['/blog/2025-12-01-best-solar-panel-brands-tamil-puducherry', '/blog/2025-12-01-best-solar-panel-brands-tamil-nadu-puducherry'],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
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
