/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  publicRuntimeConfig: {
    BASE_PATH: '',
  },
  images: {
    domains: ['enka.network'],
  },
}

module.exports = nextConfig
