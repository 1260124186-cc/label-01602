/**
 * 客户端 API 请求封装
 */

import type { ApiResponse } from '@/types';

// API 基础地址 - 从环境变量获取，客户端使用浏览器可访问的地址
const getApiBaseUrl = () => {
  // 浏览器环境：使用 window.location 或环境变量
  if (typeof window !== 'undefined') {
    // 优先使用环境变量配置的公开地址
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  }
  // 服务端环境：使用 Docker 内部网络地址
  return process.env.API_URL || 'http://backend:3001';
};

/**
 * 从 Cookie 获取 Token
 */
function getToken(): string | null {
  if (typeof document === 'undefined') return null;

  const tokenCookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('token='));

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(tokenCookie.substring('token='.length));
}

/**
 * 设置 Token（仅写入 Cookie）
 */
export function setToken(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
}

/**
 * 移除 Token（仅清理 Cookie）
 */
export function removeToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
}

/**
 * 构建请求头
 */
function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers(customHeaders);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return headers;
}

/**
 * 通用请求方法
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: buildHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || '请求失败',
      };
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络错误',
    };
  }
}

/**
 * GET 请求
 */
export function get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<ApiResponse<T>> {
  let url = endpoint;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return request<T>(url, { method: 'GET' });
}

/**
 * POST 请求
 */
export function post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 请求
 */
export function put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 请求
 */
export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: 'DELETE' });
}

// ==================== 业务 API ====================

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Listing,
  CreateListingRequest,
  UpdateListingRequest,
  ListingFilter,
  PaginatedResponse,
  RejectRequest,
} from '@/types';

/**
 * 认证相关 API
 */
export const authApi = {
  /** 注册 */
  register: (data: RegisterRequest) => post<AuthResponse>('/api/auth/register', data),
  
  /** 登录 */
  login: (data: LoginRequest) => post<AuthResponse>('/api/auth/login', data),
  
  /** 获取当前用户 */
  me: () => get<User>('/api/auth/me'),
};

/**
 * 房源相关 API
 */
export const listingApi = {
  /** 获取房源列表（公开） */
  getList: (filter?: ListingFilter) => get<PaginatedResponse<Listing>>('/api/listings', filter as Record<string, string | number | undefined>),
  
  /** 获取房源详情 */
  getById: (id: string) => get<Listing>(`/api/listings/${id}`),
  
  /** 创建房源 */
  create: (data: CreateListingRequest) => post<Listing>('/api/listings', data),
  
  /** 获取我的房源 */
  getMy: () => get<Listing[]>('/api/listings/my'),
  
  /** 更新房源 */
  update: (id: string, data: UpdateListingRequest) => put<Listing>(`/api/listings/${id}`, data),
  
  /** 删除房源 */
  delete: (id: string) => del<void>(`/api/listings/${id}`),
};

/**
 * 管理员相关 API
 */
export const adminApi = {
  /** 获取待审核房源 */
  getPendingListings: () => get<Listing[]>('/api/admin/listings'),

  /** 修改违规房源 */
  update: (id: string, data: UpdateListingRequest) => put<Listing>(`/api/admin/listings/${id}`, data),
  
  /** 审核通过 */
  approve: (id: string) => put<Listing>(`/api/admin/listings/${id}/approve`),
  
  /** 审核驳回 */
  reject: (id: string, data: RejectRequest) => put<Listing>(`/api/admin/listings/${id}/reject`, data),
  
  /** 删除房源 */
  delete: (id: string) => del<void>(`/api/admin/listings/${id}`),
};
