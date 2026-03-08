/**
 * 用户注册 API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { rsaDecrypt } from '@/lib/crypto';
import { validateRegister } from '@/lib/validations';
import type { RegisterRequest, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 数据验证
    const validation = validateRegister(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('; ') },
        { status: 400 }
      );
    }
    
    const { email, password, name, encrypted } = body as RegisterRequest & { encrypted?: boolean };
    
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
    
    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该邮箱已被注册' },
        { status: 400 }
      );
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(plainPassword);
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user', // 默认为普通用户
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    // 生成 Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    console.log(`[Auth] 用户注册成功: ${email}`);
    
    const response: AuthResponse = {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      token,
    };
    
    return NextResponse.json({ success: true, data: response }, { status: 201 });
    
  } catch (error) {
    console.error('[Auth] 注册失败:', error);
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
