/**
 * 后端服务 - 最小化布局（仅用于 API 服务）
 */

export const metadata = {
  title: '租房平台 API',
  description: 'Rental Platform Backend API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
