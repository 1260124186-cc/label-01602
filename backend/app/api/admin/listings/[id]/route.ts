/**
 * 管理员 - 删除违规房源 API
 * DELETE /api/admin/listings/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    
    // 删除房源
    await prisma.listing.delete({
      where: { id },
    });
    
    console.log(`[Admin] 违规房源删除: ${id} by ${auth.user.email}`);
    
    return NextResponse.json({ success: true, message: '删除成功' });
    
  } catch (error) {
    console.error('[Admin] 删除房源失败:', error);
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
  }
}
