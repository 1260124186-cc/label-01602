/**
 * 通用工具函数（后端）
 */

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度（至少6位）
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * 生成分页参数
 */
export function getPaginationParams(page: number, pageSize: number) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * 计算总页数
 */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}
