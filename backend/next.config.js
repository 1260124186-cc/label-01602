/** @type {import('next').NextConfig} */
const nextConfig = {
  // 仅作为 API 服务
  reactStrictMode: true,
  
  // 启用 standalone 输出模式（用于 Docker）
  output: 'standalone',
  
  // 实验性功能
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

module.exports = nextConfig;
