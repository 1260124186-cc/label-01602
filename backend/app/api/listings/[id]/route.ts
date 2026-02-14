/**
 * 房源详情 API
 * GET /api/listings/[id] - 获取房源详情
 * PUT /api/listings/[id] - 更新房源（房源所有者）
 * DELETE /api/listings/[id] - 删除房源（房源所有者或管理员）
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { validateUpdateListing } from '@/lib/validations';
import type { UpdateListingRequest } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 获取房源详情
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    if (!listing) {
      return NextResponse.json(
        { success: false, error: '房源不存在' },
        { status: 404 }
      );
    }
    
    // 未审核通过的房源只有所有者和管理员能查看
    if (listing.status !== 'approved') {
      const auth = await authenticateRequest(request);
      const isOwner = auth.user?.id === listing.userId;
      const isAdmin = auth.user?.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: '房源不存在' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...listing,
        user: listing.user ? {
          ...listing.user,
          email: '',
          role: 'user' as const,
          createdAt: '',
          updatedAt: '',
        } : undefined,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('[Listings] 获取详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取房源详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新房源（仅所有者）
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 认证请求
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
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
    
    // 检查权限（只有所有者可以更新）
    if (listing.userId !== auth.user.id) {
      return forbiddenResponse('只能修改自己发布的房源');
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
    
    // 更新房源（修改后重新进入待审核状态）
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        ...data,
        status: 'pending', // 修改后重新审核
        rejectReason: null, // 清除驳回原因
      },
    });
    
    console.log(`[Listings] 房源更新成功: ${id} by ${auth.user.email}`);
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedListing,
        createdAt: updatedListing.createdAt.toISOString(),
        updatedAt: updatedListing.updatedAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('[Listings] 更新失败:', error);
    return NextResponse.json(
      { success: false, error: '更新房源失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除房源（所有者或管理员）
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 认证请求
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
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
    
    // 检查权限（所有者或管理员可删除）
    const isOwner = listing.userId === auth.user.id;
    const isAdmin = auth.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return forbiddenResponse('无权删除此房源');
    }
    
    // 删除房源
    await prisma.listing.delete({
      where: { id },
    });
    
    console.log(`[Listings] 房源删除成功: ${id} by ${auth.user.email}`);
    
    return NextResponse.json({ success: true, message: '删除成功' });
    
  } catch (error) {
    console.error('[Listings] 删除失败:', error);
    return NextResponse.json(
      { success: false, error: '删除房源失败' },
      { status: 500 }
    );
  }
}
