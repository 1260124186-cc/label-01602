/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 启用 standalone 输出模式（用于 Docker）
  output: 'standalone',
};

module.exports = nextConfig;
