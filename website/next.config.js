/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/starknet-react',
  assetPrefix: '/starknet-react',
  images: {
    formats: ['image/webp'],
  },
}

module.exports = nextConfig
