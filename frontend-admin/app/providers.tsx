/**
 * 客户端 Providers
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, fetchUser } = useAuthStore();
  
  // 初始化时获取用户信息
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);
  
  return <>{children}</>;
}
