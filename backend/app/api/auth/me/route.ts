/**
 * 获取当前用户信息 API
 * GET /api/auth/me
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 认证请求
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
    }
    
    return NextResponse.json({ success: true, data: auth.user });
    
  } catch (error) {
    console.error('[Auth] 获取用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
