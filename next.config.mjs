/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Adicione esta linha para desabilitar o aviso do Turbopack
  turbopack: {},
};

export default nextConfig;