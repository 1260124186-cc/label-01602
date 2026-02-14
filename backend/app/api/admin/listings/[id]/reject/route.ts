/**
 * 管理员 - 审核驳回 API
 * PUT /api/admin/listings/[id]/reject
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { validateRejectReason } from '@/lib/validations';

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
    
    // 解析请求体
    const body = await request.json();
    
    // 验证驳回原因
    const validation = validateRejectReason(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('; ') },
        { status: 400 }
      );
    }
    
    const { reason } = body;
    
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
    
    // 更新状态为驳回
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectReason: reason,
      },
    });
    
    console.log(`[Admin] 房源审核驳回: ${id} by ${auth.user.email}, reason: ${reason}`);
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedListing,
        createdAt: updatedListing.createdAt.toISOString(),
        updatedAt: updatedListing.updatedAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('[Admin] 审核驳回失败:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
