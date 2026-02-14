/**
 * 数据验证模块
 * 提供请求数据的校验功能
 */

import type { CreateListingRequest, LoginRequest, RegisterRequest, UpdateListingRequest } from '@/types';

/** 验证结果 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 验证注册数据
 */
export function validateRegister(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['无效的请求数据'] };
  }
  
  const { email, password, name } = data as RegisterRequest;
  
  // 邮箱验证
  if (!email || typeof email !== 'string') {
    errors.push('邮箱不能为空');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('邮箱格式不正确');
  }
  
  // 密码验证
  if (!password || typeof password !== 'string') {
    errors.push('密码不能为空');
  } else if (password.length < 6) {
    errors.push('密码长度至少6位');
  }
  
  // 用户名验证
  if (!name || typeof name !== 'string') {
    errors.push('用户名不能为空');
  } else if (name.length < 2 || name.length > 20) {
    errors.push('用户名长度需在2-20字符之间');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * 验证登录数据
 */
export function validateLogin(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['无效的请求数据'] };
  }
  
  const { email, password } = data as LoginRequest;
  
  if (!email || typeof email !== 'string') {
    errors.push('邮箱不能为空');
  }
  
  if (!password || typeof password !== 'string') {
    errors.push('密码不能为空');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * 验证创建房源数据
 */
export function validateCreateListing(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['无效的请求数据'] };
  }
  
  const { title, rent, address, rentType, area, tags } = data as CreateListingRequest;
  
  // 标题验证
  if (!title || typeof title !== 'string') {
    errors.push('房源标题不能为空');
  } else if (title.length < 5 || title.length > 100) {
    errors.push('房源标题长度需在5-100字符之间');
  }
  
  // 租金验证
  if (rent === undefined || rent === null) {
    errors.push('租金不能为空');
  } else if (typeof rent !== 'number' || rent <= 0 || rent > 100000) {
    errors.push('租金需在1-100000元之间');
  }
  
  // 地址验证
  if (!address || typeof address !== 'string') {
    errors.push('地址不能为空');
  } else if (address.length < 5 || address.length > 200) {
    errors.push('地址长度需在5-200字符之间');
  }
  
  // 租房类型验证
  if (!rentType || !['whole', 'shared'].includes(rentType)) {
    errors.push('请选择租房类型（整租/合租）');
  }
  
  // 面积验证（可选）
  if (area !== undefined && area !== null) {
    if (typeof area !== 'number' || area <= 0 || area > 1000) {
      errors.push('面积需在1-1000平方米之间');
    }
  }
  
  // 标签验证（可选）
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push('标签格式不正确');
    } else if (tags.length > 10) {
      errors.push('标签数量不能超过10个');
    } else if (tags.some(tag => typeof tag !== 'string' || tag.length > 20)) {
      errors.push('单个标签长度不能超过20字符');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * 验证更新房源数据
 */
export function validateUpdateListing(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['无效的请求数据'] };
  }
  
  const { title, rent, address, rentType, area, tags } = data as UpdateListingRequest;
  
  // 标题验证（如果提供）
  if (title !== undefined) {
    if (typeof title !== 'string' || title.length < 5 || title.length > 100) {
      errors.push('房源标题长度需在5-100字符之间');
    }
  }
  
  // 租金验证（如果提供）
  if (rent !== undefined) {
    if (typeof rent !== 'number' || rent <= 0 || rent > 100000) {
      errors.push('租金需在1-100000元之间');
    }
  }
  
  // 地址验证（如果提供）
  if (address !== undefined) {
    if (typeof address !== 'string' || address.length < 5 || address.length > 200) {
      errors.push('地址长度需在5-200字符之间');
    }
  }
  
  // 租房类型验证（如果提供）
  if (rentType !== undefined && !['whole', 'shared'].includes(rentType)) {
    errors.push('租房类型不正确');
  }
  
  // 面积验证（如果提供）
  if (area !== undefined && area !== null) {
    if (typeof area !== 'number' || area <= 0 || area > 1000) {
      errors.push('面积需在1-1000平方米之间');
    }
  }
  
  // 标签验证（如果提供）
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push('标签格式不正确');
    } else if (tags.length > 10) {
      errors.push('标签数量不能超过10个');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * 验证驳回原因
 */
export function validateRejectReason(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['无效的请求数据'] };
  }
  
  const { reason } = data as { reason: string };
  
  if (!reason || typeof reason !== 'string') {
    errors.push('驳回原因不能为空');
  } else if (reason.length < 5 || reason.length > 500) {
    errors.push('驳回原因长度需在5-500字符之间');
  }
  
  return { valid: errors.length === 0, errors };
}
