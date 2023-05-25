/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/starknet-react',
  assetPrefix: '/starknet-react',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
