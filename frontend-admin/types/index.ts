/**
 * 全局类型定义
 */

// ==================== 枚举类型 ====================

/** 用户角色 */
export type Role = 'user' | 'admin';

/** 房源状态 */
export type ListingStatus = 'pending' | 'approved' | 'rejected';

/** 租房类型 */
export type RentType = 'whole' | 'shared';

// ==================== 用户相关类型 ====================

/** 用户基础信息（不含密码） */
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

/** 用户注册请求 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/** 用户登录请求 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 认证响应 */
export interface AuthResponse {
  user: User;
  token: string;
}

/** JWT Payload */
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// ==================== 房源相关类型 ====================

/** 房源信息 */
export interface Listing {
  id: string;
  title: string;
  rent: number;
  address: string;
  rentType: RentType;
  area: number | null;
  floor: number | null;
  tags: string[];
  description: string | null;
  status: ListingStatus;
  rejectReason: string | null;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

/** 创建房源请求 */
export interface CreateListingRequest {
  title: string;
  rent: number;
  address: string;
  rentType: RentType;
  area?: number;
  floor?: number;
  tags?: string[];
  description?: string;
}

/** 更新房源请求 */
export interface UpdateListingRequest {
  title?: string;
  rent?: number;
  address?: string;
  rentType?: RentType;
  area?: number;
  floor?: number;
  tags?: string[];
  description?: string;
}

/** 房源筛选参数 */
export interface ListingFilter {
  rentType?: RentType;
  minRent?: number;
  maxRent?: number;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== 管理员相关类型 ====================

/** 审核驳回请求 */
export interface RejectRequest {
  reason: string;
}

// ==================== API 响应类型 ====================

/** 通用 API 响应 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/** API 错误 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

// ==================== 状态显示配置 ====================

/** 房源状态显示配置 */
export const ListingStatusConfig: Record<ListingStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待审核', color: 'text-warning', bgColor: 'bg-yellow-100' },
  approved: { label: '已通过', color: 'text-success', bgColor: 'bg-green-100' },
  rejected: { label: '已驳回', color: 'text-danger', bgColor: 'bg-red-100' },
};

/** 租房类型显示配置 */
export const RentTypeConfig: Record<RentType, { label: string }> = {
  whole: { label: '整租' },
  shared: { label: '合租' },
};
