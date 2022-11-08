/** @type {import('next').NextConfig} */
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 6000,
    domains: ['localhost', process.env.NEXT_PUBLIC_CMS_URL, 'cms.payloadcms.com'],
  },
  experimental: {
    appDir: true,
  },
  webpack: config => {
    const configCopy = { ...config }
    configCopy.resolve.alias = {
      ...config.resolve.alias,
      '@scss': path.resolve(__dirname, './css/'),
      '@components': path.resolve(__dirname, './components'),
      '@forms': path.resolve(__dirname, './components/forms'),
      '@blocks': path.resolve(__dirname, './components/blocks'),
      // IMPORTANT: the next lines are for development only
      // keep them commented out unless actively developing local react modules
      // modify their paths according to your local directory
      // "payload-admin-bar": path.join(__dirname, "../payload-admin-bar"),
    }
    return configCopy
  },
  redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started/what-is-payload',
        permanent: true,
      },
    ]
  },
})

module.exports = nextConfig
