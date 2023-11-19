const redirects = require('./redirects')

/** @type {import('next').NextConfig} */
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 6000,
    domains: [
      'localhost',
      'cms.payloadcms.com',
      'cloud-api.payloadcms.com',
      'cms.local.payloadcms.com',
      'stage.cms.payloadcms.com',
      'cdn.discordapp.com',
      'avatars.githubusercontent.com',
      'img.youtube.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: config => {
    const configCopy = { ...config }
    configCopy.resolve.alias = {
      ...config.resolve.alias,
      '@scss': path.resolve(__dirname, './src/css/'),
      '@components': path.resolve(__dirname, './src/components'),
      '@cloud': path.resolve(__dirname, './src/app/cloud'),
      '@forms': path.resolve(__dirname, './src/forms'),
      '@blocks': path.resolve(__dirname, './src/blocks'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@icons': path.resolve(__dirname, './src/icons'),
      '@utilities': path.resolve(__dirname, './src/utilities'),
      '@types': path.resolve(__dirname, './payload-types.ts'),
      '@graphics': path.resolve(__dirname, './src/graphics'),
      '@graphql': path.resolve(__dirname, './src/graphql'),
      // IMPORTANT: the next lines are for development only
      // keep them commented out unless actively developing local react modules
      // modify their paths according to your local directory
      // "payload-admin-bar": path.join(__dirname, "../payload-admin-bar"),
    }
    return configCopy
  },
  redirects,
  async headers() {
    const headers = []

    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      })
    }
    return headers
  },
})

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'payload-cms',
    project: 'website',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
)
