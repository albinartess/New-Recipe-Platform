/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['fonts.googleapis.com'],
  },
  experimental: {
    optimizeCss: false,
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Отключаем статическую генерацию для страниц с ошибками
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/recipes': { page: '/recipes' },
      '/recipes/new': { page: '/recipes/new' },
    }
  }
}

module.exports = nextConfig 