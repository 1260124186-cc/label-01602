/**
 * 根布局组件
 */

import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { AuthProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: '大学生租房平台',
  description: '面向大学生的租房信息发布与查询平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
