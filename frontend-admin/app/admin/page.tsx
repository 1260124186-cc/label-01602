/**
 * 管理员审核页面
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Textarea } from '@/components/ui/Textarea';
import { RentTypeBadge, StatusBadge } from '@/components/ui/Badge';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { ListingForm } from '@/components/listing/ListingForm';
import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { formatMoney, formatArea, formatDateTime } from '@/lib/utils';
import type { CreateListingRequest, Listing } from '@/types';

export default function AdminPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const toast = useToastStore();
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const isMounted = useRef(true);
  
  // 驳回弹窗
  const [rejectModal, setRejectModal] = useState<{ open: boolean; listingId: string | null }>({
    open: false,
    listingId: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  
  // 删除确认弹窗
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; listingId: string | null; title: string }>({
    open: false,
    listingId: null,
    title: '',
  });

  // 修改弹窗
  const [editModal, setEditModal] = useState<{ open: boolean; listing: Listing | null }>({
    open: false,
    listing: null,
  });
  
  const fetchPendingListings = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await adminApi.getPendingListings();
      if (!isMounted.current) return;
      
      if (response.success && response.data) {
        setListings(response.data);
      } else {
        if (response.error !== '未授权') {
          toast.error(response.error || '获取列表失败');
        }
      }
    } catch {
      if (isMounted.current) {
        toast.error('网络错误');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [toast, isAuthenticated, isAdmin]);
  
  useEffect(() => {
    isMounted.current = true;
    
    if (isAuthenticated && isAdmin) {
      fetchPendingListings();
    } else if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchPendingListings, isAuthenticated, isAdmin, router]);
  
  const handleApprove = async (id: string) => {
    if (!isAuthenticated || !isAdmin) return;
    
    setActionLoading(id);
    try {
      const response = await adminApi.approve(id);
      if (response.success) {
        toast.success('审核通过');
        setListings(prev => prev.filter(l => l.id !== id));
      } else {
        toast.error(response.error || '操作失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setActionLoading(null);
    }
  };
  
  const openRejectModal = (id: string) => {
    setRejectModal({ open: true, listingId: id });
    setRejectReason('');
  };
  
  const handleReject = async () => {
    if (!rejectModal.listingId || !isAuthenticated || !isAdmin) return;
    if (!rejectReason.trim() || rejectReason.length < 5) {
      toast.error('请输入至少5个字符的驳回原因');
      return;
    }
    
    setActionLoading(rejectModal.listingId);
    try {
      const response = await adminApi.reject(rejectModal.listingId, { reason: rejectReason });
      if (response.success) {
        toast.success('已驳回');
        setListings(prev => prev.filter(l => l.id !== rejectModal.listingId));
        setRejectModal({ open: false, listingId: null });
      } else {
        toast.error(response.error || '操作失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setActionLoading(null);
    }
  };
  
  const openDeleteDialog = (id: string, title: string) => {
    setDeleteDialog({ open: true, listingId: id, title });
  };

  const openEditModal = (listing: Listing) => {
    setEditModal({ open: true, listing });
  };

  const handleAdminUpdate = async (data: CreateListingRequest) => {
    if (!editModal.listing || !isAuthenticated || !isAdmin) return;

    setActionLoading(editModal.listing.id);
    try {
      const response = await adminApi.update(editModal.listing.id, data);
      if (response.success && response.data) {
        toast.success('修改成功');
        setListings(prev => prev.map(l => (l.id === response.data?.id ? response.data : l)));
        setEditModal({ open: false, listing: null });
      } else {
        toast.error(response.error || '修改失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleDelete = async () => {
    if (!deleteDialog.listingId || !isAuthenticated || !isAdmin) return;
    
    setActionLoading(deleteDialog.listingId);
    try {
      const response = await adminApi.delete(deleteDialog.listingId);
      if (response.success) {
        toast.success('删除成功');
        setListings(prev => prev.filter(l => l.id !== deleteDialog.listingId));
        setDeleteDialog({ open: false, listingId: null, title: '' });
      } else {
        toast.error(response.error || '删除失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setActionLoading(null);
    }
  };
  
  if (!isAuthenticated || !isAdmin) {
    return <PageLoading />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">房源审核</h1>
              <p className="text-sm text-gray-500">
                审核用户提交的房源信息
                {listings.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
                    {listings.length} 条待审核
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <PageLoading />
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <EmptyState
              title="暂无待审核房源"
              description="所有房源都已审核完毕，请稍后再来查看"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary-100 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  {/* 头部：标题和价格 */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status="pending" />
                        <span className="text-xs text-gray-400">#{listing.id.slice(-6)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {listing.title}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-2xl font-bold text-primary-500">
                        {formatMoney(listing.rent)}
                      </span>
                      <span className="text-sm text-gray-400">/月</span>
                    </div>
                  </div>
                  
                  {/* 基本信息 */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <RentTypeBadge rentType={listing.rentType} />
                    </div>
                    {listing.area && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span>{formatArea(listing.area)}</span>
                      </div>
                    )}
                    {listing.floor && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{listing.floor}层</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 地址 */}
                  <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">{listing.address}</span>
                  </div>
                  
                  {/* 描述 */}
                  {listing.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                  
                  {/* 标签 */}
                  {listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 底部：发布者信息和操作按钮 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{listing.user?.name || '未知用户'}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(listing.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditModal(listing)}
                        disabled={actionLoading === listing.id}
                      >
                        修改
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(listing.id)}
                        loading={actionLoading === listing.id}
                        className="px-4"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        通过
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openRejectModal(listing.id)}
                        disabled={actionLoading === listing.id}
                      >
                        驳回
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openDeleteDialog(listing.id, listing.title)}
                        disabled={actionLoading === listing.id}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 管理员修改弹窗 */}
        <Modal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, listing: null })}
          title="修改房源"
          size="lg"
        >
          {editModal.listing && (
            <ListingForm
              initialData={editModal.listing}
              onSubmit={handleAdminUpdate}
              loading={actionLoading === editModal.listing.id}
              inModal
            />
          )}
        </Modal>

        {/* 驳回原因弹窗 */}
        <Modal
          isOpen={rejectModal.open}
          onClose={() => setRejectModal({ open: false, listingId: null })}
          title="填写驳回原因"
        >
          <div className="space-y-4">
            <Textarea
              placeholder="请输入驳回原因（至少5个字符）"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setRejectModal({ open: false, listingId: null })}
              >
                取消
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={!!actionLoading}
              >
                确认驳回
              </Button>
            </div>
          </div>
        </Modal>
        
        {/* 删除确认弹窗 */}
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, listingId: null, title: '' })}
          onConfirm={handleDelete}
          title="确认删除"
          message={`确定要删除房源「${deleteDialog.title}」吗？此操作不可恢复。`}
          confirmText="确认删除"
          cancelText="取消"
          variant="danger"
          loading={!!actionLoading}
        />
      </div>
    </div>
  );
}
