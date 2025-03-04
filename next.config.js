/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'api.microlink.io',
      'via.placeholder.com',
      'www.google.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      }
    ]
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
