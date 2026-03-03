/**
 * 管理员 - 违规房源处理 API
 * PUT /api/admin/listings/[id] - 修改违规房源
 * DELETE /api/admin/listings/[id] - 删除违规房源
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { validateUpdateListing } from '@/lib/validations';
import type { UpdateListingRequest } from '@/types';

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

    // 解析请求体
    const body = await request.json();

    // 数据验证
    const validation = validateUpdateListing(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('; ') },
        { status: 400 }
      );
    }

    const data = body as UpdateListingRequest;

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        ...data,
        rejectReason: null,
      },
    });

    console.log(`[Admin] 违规房源修改: ${id} by ${auth.user.email}`);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedListing,
        createdAt: updatedListing.createdAt.toISOString(),
        updatedAt: updatedListing.updatedAt.toISOString(),
      },
      message: '修改成功',
    });

  } catch (error) {
    console.error('[Admin] 修改房源失败:', error);
    return NextResponse.json(
      { success: false, error: '修改失败' },
      { status: 500 }
    );
  }
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
