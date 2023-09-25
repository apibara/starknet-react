const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => [
    {
      source: "/",
      destination: "/docs/getting-started",
      permanent: true,
    },
    {
      source: "/docs",
      destination: "/docs/getting-started",
      permanent: true,
    },
    {
      source: "/demos",
      destination: "/demos/connect-wallet",
      permanent: true,
    },
  ],
};

module.exports = withContentlayer(nextConfig);
