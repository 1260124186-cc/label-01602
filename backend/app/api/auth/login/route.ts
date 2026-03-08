/**
 * 用户登录 API
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { rsaDecrypt } from '@/lib/crypto';
import { validateLogin } from '@/lib/validations';
import type { LoginRequest, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 数据验证
    const validation = validateLogin(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('; ') },
        { status: 400 }
      );
    }
    
    const { email, password, encrypted } = body as LoginRequest & { encrypted?: boolean };
    
    // 如果密码是加密传输的，先解密
    let plainPassword = password;
    if (encrypted) {
      try {
        plainPassword = rsaDecrypt(password);
      } catch (err) {
        console.error('[Auth] 密码解密失败:', err);
        return NextResponse.json(
          { success: false, error: '密码解密失败，请刷新页面重试' },
          { status: 400 }
        );
      }
    }
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
    
    // 验证密码
    const isPasswordValid = await comparePassword(plainPassword, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
    
    // 生成 Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    console.log(`[Auth] 用户登录成功: ${email}`);
    
    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      token,
    };
    
    return NextResponse.json({ success: true, data: response });
    
  } catch (error) {
    console.error('[Auth] 登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
