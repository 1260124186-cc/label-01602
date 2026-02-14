/**
 * Next.js 中间件
 * 用于路由级别的权限控制（客户端）
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的页面路径
const protectedPaths = ['/publish', '/my-listings'];

// 需要管理员权限的页面路径
const adminPaths = ['/admin'];

// 已登录用户不应访问的页面路径（如登录、注册页）
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 从 Cookie 获取 Token（客户端存储）
  const token = request.cookies.get('token')?.value;
  
  // 简单检查是否有 token（详细验证由 API 完成）
  const isAuthenticated = !!token;
  
  // 解析 token 获取角色信息（简单解析，不做签名验证）
  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.role === 'admin';
    } catch {
      // token 格式错误
    }
  }

  // 检查是否是受保护的页面
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // 未登录用户访问受保护页面 -> 重定向到登录页
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 非管理员访问管理员页面 -> 重定向到首页
  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 已登录用户访问登录/注册页 -> 重定向到首页
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
