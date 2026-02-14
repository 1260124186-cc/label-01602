/**
 * 认证状态管理 (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi, setToken, removeToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }),
      
      setToken: (token) => {
        if (token) {
          setToken(token);
        } else {
          removeToken();
        }
        set({ token });
      },
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            get().setToken(token);
            get().setUser(user);
            return { success: true };
          }
          
          return { success: false, error: response.error || '登录失败' };
        } catch (error) {
          return { success: false, error: '网络错误' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ email, password, name });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            get().setToken(token);
            get().setUser(user);
            return { success: true };
          }
          
          return { success: false, error: response.error || '注册失败' };
        } catch (error) {
          return { success: false, error: '网络错误' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: () => {
        get().setToken(null);
        get().setUser(null);
      },
      
      fetchUser: async () => {
        const token = get().token;
        if (!token) return;
        
        set({ isLoading: true });
        try {
          const response = await authApi.me();
          if (response.success && response.data) {
            get().setUser(response.data);
          } else {
            // Token 无效，清除登录状态
            get().logout();
          }
        } catch {
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);
