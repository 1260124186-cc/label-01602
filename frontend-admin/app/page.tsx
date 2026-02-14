/**
 * 首页 - 房源列表
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingFilterBar } from '@/components/listing/ListingFilter';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { listingApi } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';
import type { Listing, ListingFilter, PaginatedResponse } from '@/types';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ListingFilter>({ page: 1, pageSize: 12 });
  const toast = useToastStore();

  const fetchListings = useCallback(async (filterParams: ListingFilter) => {
    setLoading(true);
    try {
      const response = await listingApi.getList(filterParams);
      if (response.success && response.data) {
        const data = response.data as PaginatedResponse<Listing>;
        setListings(data.data);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
        });
      } else {
        toast.error(response.error || '获取房源列表失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchListings(filter);
  }, [filter, fetchListings]);

  const handleFilter = (newFilter: ListingFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handlePageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero 区域 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              找到适合你的租房信息
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              专为大学生打造的租房平台，安全、便捷、可靠
            </p>
            {pagination.total > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="font-medium">共 {pagination.total} 套优质房源</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 筛选栏 */}
        <div className="mt-8 relative z-10 mb-8">
          <ListingFilterBar onFilter={handleFilter} loading={loading} />
        </div>

        {/* 房源列表 */}
        {loading ? (
          <PageLoading />
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <EmptyState
              title="暂无房源"
              description="暂时没有符合条件的房源，试试调整筛选条件"
            />
          </div>
        ) : (
          <>
            {/* 结果提示 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                为您找到 <span className="font-semibold text-gray-900">{pagination.total}</span> 套房源
              </p>
              <p className="text-sm text-gray-400">
                第 {pagination.page} 页，共 {pagination.totalPages} 页
              </p>
            </div>

            {/* 房源网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  上一页
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="flex items-center gap-1"
                >
                  下一页
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
