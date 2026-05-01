/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ui-avatars.com', 'randomuser.me', 'images.unsplash.com'], // Ajouté Unsplash pour les tests
  },
}

module.exports = nextConfig