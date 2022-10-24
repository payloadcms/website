/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    const configCopy = { ...config };
    configCopy.resolve.alias = {
      ...config.resolve.alias,
      '@scss': path.resolve(__dirname, './css/'),
    }
    return configCopy;
  },
}

module.exports = nextConfig
