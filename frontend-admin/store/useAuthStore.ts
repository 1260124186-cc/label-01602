/**
 * 认证状态管理 (Zustand)
 */

import { create } from 'zustand';
import type { User } from '@/types';
import { authApi, setToken as saveTokenToCookie, removeToken as clearTokenCookie } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const getUnauthenticatedState = () => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
});

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...getUnauthenticatedState(),
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        const { user, token } = response.data;
        saveTokenToCookie(token);
        get().setUser(user);
        return { success: true };
      }

      return { success: false, error: response.error || '登录失败' };
    } catch {
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
        saveTokenToCookie(token);
        get().setUser(user);
        return { success: true };
      }

      return { success: false, error: response.error || '注册失败' };
    } catch {
      return { success: false, error: '网络错误' };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    clearTokenCookie();
    set(getUnauthenticatedState());
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        get().setUser(response.data);
      } else {
        clearTokenCookie();
        set(getUnauthenticatedState());
      }
    } catch {
      clearTokenCookie();
      set(getUnauthenticatedState());
    } finally {
      set({ isLoading: false });
    }
  },
}));
