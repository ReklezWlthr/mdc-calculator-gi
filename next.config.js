module.exports = {
  output: 'export',
  basePath: '/mdc-calculator',
  reactStrictMode: true,
  publicRuntimeConfig: {
    NEXT_PUBLIC_BE_HOST: process.env.NEXT_PUBLIC_BE_HOST,
  },
  images: {
    domains: ['enka.network'],
  },
}
