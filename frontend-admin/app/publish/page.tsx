/**
 * 发布房源页面
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingForm } from '@/components/listing/ListingForm';
import { listingApi } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';
import type { CreateListingRequest } from '@/types';

export default function PublishPage() {
  const router = useRouter();
  const toast = useToastStore();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (data: CreateListingRequest) => {
    setLoading(true);
    try {
      const response = await listingApi.create(data);
      if (response.success) {
        toast.success('发布成功，等待审核');
        router.push('/my-listings');
      } else {
        toast.error(response.error || '发布失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">发布房源</h1>
        <p className="text-gray-500 mt-1">
          填写房源信息后提交审核，审核通过后会显示在房源列表中
        </p>
      </div>
      
      <ListingForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
