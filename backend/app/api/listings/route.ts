/**
 * 房源列表 API
 * GET /api/listings - 获取已审核的房源列表（公开）
 * POST /api/listings - 创建房源（需登录）
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';
import { validateCreateListing } from '@/lib/validations';
import { getPaginationParams, getTotalPages } from '@/lib/utils';
import type { CreateListingRequest, ListingFilter, PaginatedResponse, Listing } from '@/types';
import { Prisma } from '@prisma/client';

/**
 * 获取房源列表（仅审核通过的）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析筛选参数
    const filter: ListingFilter = {
      rentType: searchParams.get('rentType') as ListingFilter['rentType'] || undefined,
      minRent: searchParams.get('minRent') ? Number(searchParams.get('minRent')) : undefined,
      maxRent: searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : undefined,
      keyword: searchParams.get('keyword') || undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Math.min(Number(searchParams.get('pageSize')) || 10, 50), // 最大50条
    };
    
    // 构建查询条件
    const where: Prisma.ListingWhereInput = {
      status: 'approved', // 只返回审核通过的房源
    };
    
    // 租房类型筛选
    if (filter.rentType) {
      where.rentType = filter.rentType;
    }
    
    // 租金范围筛选
    if (filter.minRent || filter.maxRent) {
      where.rent = {};
      if (filter.minRent) where.rent.gte = filter.minRent;
      if (filter.maxRent) where.rent.lte = filter.maxRent;
    }
    
    // 关键词搜索（标题或地址）
    if (filter.keyword) {
      where.OR = [
        { title: { contains: filter.keyword, mode: 'insensitive' } },
        { address: { contains: filter.keyword, mode: 'insensitive' } },
      ];
    }
    
    // 分页参数
    const { skip, take } = getPaginationParams(filter.page!, filter.pageSize!);
    
    // 查询数据
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.listing.count({ where }),
    ]);
    
    // 格式化响应
    const response: PaginatedResponse<Listing> = {
      data: listings.map(listing => ({
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
      })),
      total,
      page: filter.page!,
      pageSize: filter.pageSize!,
      totalPages: getTotalPages(total, filter.pageSize!),
    };
    
    return NextResponse.json({ success: true, data: response });
    
  } catch (error) {
    console.error('[Listings] 获取列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取房源列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 创建房源（需登录）
 */
export async function POST(request: NextRequest) {
  try {
    // 认证请求
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.user) {
      return unauthorizedResponse(auth.error);
    }
    
    // 解析请求体
    const body = await request.json();
    
    // 数据验证
    const validation = validateCreateListing(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('; ') },
        { status: 400 }
      );
    }
    
    const data = body as CreateListingRequest;
    
    // 创建房源
    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        rent: data.rent,
        address: data.address,
        rentType: data.rentType,
        area: data.area,
        floor: data.floor,
        tags: data.tags || [],
        description: data.description,
        status: 'pending', // 默认待审核
        userId: auth.user.id,
      },
    });
    
    console.log(`[Listings] 房源创建成功: ${listing.id} by ${auth.user.email}`);
    
    return NextResponse.json({
      success: true,
      data: {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('[Listings] 创建房源失败:', error);
    return NextResponse.json(
      { success: false, error: '创建房源失败' },
      { status: 500 }
    );
  }
}
