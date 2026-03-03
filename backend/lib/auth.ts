/**
 * JWT 认证工具模块
 * 提供 token 生成、验证和用户认证功能
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import type { JWTPayload, User, Role } from '@/types';
import prisma from './prisma';

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

/**
 * 生成 JWT Token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * 密码加密
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * 密码验证
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 从请求中获取 Token（优先 Authorization，其次 Cookie）
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * 认证请求并返回用户信息
 * 用于 API Routes
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  success: boolean;
  user?: User;
  payload?: JWTPayload;
  error?: string;
}> {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return { success: false, error: '未提供认证令牌' };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { success: false, error: '无效或过期的认证令牌' };
  }

  // 从数据库获取用户信息
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { success: false, error: '用户不存在' };
  }

  return {
    success: true,
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    payload,
  };
}

/**
 * 检查用户是否为管理员
 */
export function isAdmin(role: Role): boolean {
  return role === 'admin';
}

/**
 * 创建认证失败的响应
 */
export function unauthorizedResponse(message: string = '未授权访问') {
  return Response.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * 创建禁止访问的响应
 */
export function forbiddenResponse(message: string = '无权限访问') {
  return Response.json(
    { success: false, error: message },
    { status: 403 }
  );
}
