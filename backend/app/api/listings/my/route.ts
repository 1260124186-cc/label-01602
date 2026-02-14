/**
 * 我的房源 API
 * GET /api/listings/my - 获取当前用户发布的所有房源
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 认证请求
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
    }
    
    // 获取用户的所有房源
    const listings = await prisma.listing.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    // 格式化响应
    const formattedListings = listings.map(listing => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }));
    
    return NextResponse.json({ success: true, data: formattedListings });
    
  } catch (error) {
    console.error('[Listings] 获取我的房源失败:', error);
    return NextResponse.json(
      { success: false, error: '获取房源失败' },
      { status: 500 }
    );
  }
}
