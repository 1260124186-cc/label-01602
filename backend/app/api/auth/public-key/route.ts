/**
 * 获取 RSA 公钥 API
 * GET /api/auth/public-key
 * 前端在登录/注册前调用此接口获取公钥，用于加密密码
 */

import { NextResponse } from 'next/server';
import { getPublicKey } from '@/lib/crypto';

export async function GET() {
  try {
    const publicKey = getPublicKey();
    return NextResponse.json({ success: true, data: { publicKey } });
  } catch (error) {
    console.error('[Crypto] 获取公钥失败:', error);
    return NextResponse.json(
      { success: false, error: '获取公钥失败' },
      { status: 500 }
    );
  }
}
