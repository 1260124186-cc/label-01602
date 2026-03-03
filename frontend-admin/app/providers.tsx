/**
 * 客户端 Providers
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useAuthStore();

  // 初始化时根据 Cookie 拉取用户信息
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}
