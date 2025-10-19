/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // evita erro com imagens otimizadas
  },
  distDir: 'out', // define a pasta de saída (opcional)
};

export default nextConfig;
