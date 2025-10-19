/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para produção
  output: 'standalone',
  
  // Otimizações
  swcMinify: true,
  
  // Imagens
  images: {
    domains: [
      'via.placeholder.com',
      // Adicione aqui o domínio do Supabase Storage
      'your-supabase-project.supabase.co'
    ],
    unoptimized: true
  },

  // Variáveis de ambiente
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_LOGIN_EMAIL: process.env.NEXT_PUBLIC_LOGIN_EMAIL,
    NEXT_PUBLIC_LOGIN_PASSWORD: process.env.NEXT_PUBLIC_LOGIN_PASSWORD,
  },

  // Webpack config (para resolver problemas de módulos)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig