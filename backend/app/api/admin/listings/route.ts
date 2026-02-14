/**
 * 管理员 - 获取待审核房源列表 API
 * GET /api/admin/listings
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 认证请求
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
    }
    
    // 检查管理员权限
    if (auth.user.role !== 'admin') {
      return forbiddenResponse('需要管理员权限');
    }
    
    // 获取所有待审核房源
    const listings = await prisma.listing.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' }, // 按创建时间升序，先提交的先审核
    });
    
    // 格式化响应
    const formattedListings = listings.map(listing => ({
      ...listing,
      user: listing.user ? {
        ...listing.user,
        role: 'user' as const,
        createdAt: '',
        updatedAt: '',
      } : undefined,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }));
    
    return NextResponse.json({ success: true, data: formattedListings });
    
  } catch (error) {
    console.error('[Admin] 获取待审核列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取列表失败' },
      { status: 500 }
    );
  }
}
