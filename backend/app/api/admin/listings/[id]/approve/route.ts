/**
 * 管理员 - 审核通过 API
 * PUT /api/admin/listings/[id]/approve
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 认证请求
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
    }
    
    // 检查管理员权限
    if (auth.user.role !== 'admin') {
      return forbiddenResponse('需要管理员权限');
    }
    
    // 查找房源
    const listing = await prisma.listing.findUnique({
      where: { id },
    });
    
    if (!listing) {
      return NextResponse.json(
        { success: false, error: '房源不存在' },
        { status: 404 }
      );
    }
    
    // 更新状态为通过
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        status: 'approved',
        rejectReason: null,
      },
    });
    
    console.log(`[Admin] 房源审核通过: ${id} by ${auth.user.email}`);
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedListing,
        createdAt: updatedListing.createdAt.toISOString(),
        updatedAt: updatedListing.updatedAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('[Admin] 审核通过失败:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
