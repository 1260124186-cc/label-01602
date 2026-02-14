/**
 * Toast 消息状态管理 (Zustand)
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  
  // Actions
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // 便捷方法
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    
    // 3秒后自动移除
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
  
  success: (message) => get().addToast(message, 'success'),
  error: (message) => get().addToast(message, 'error'),
  warning: (message) => get().addToast(message, 'warning'),
  info: (message) => get().addToast(message, 'info'),
}));
