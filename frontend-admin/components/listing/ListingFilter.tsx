/**
 * 房源筛选组件
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { ListingFilter } from '@/types';

interface ListingFilterProps {
  onFilter: (filter: ListingFilter) => void;
  loading?: boolean;
}

export function ListingFilterBar({ onFilter, loading }: ListingFilterProps) {
  const [keyword, setKeyword] = useState('');
  const [rentType, setRentType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  
  const handleSearch = () => {
    onFilter({
      keyword: keyword || undefined,
      rentType: rentType as ListingFilter['rentType'] || undefined,
      minRent: minRent ? Number(minRent) : undefined,
      maxRent: maxRent ? Number(maxRent) : undefined,
      page: 1,
    });
  };
  
  const handleReset = () => {
    setKeyword('');
    setRentType('');
    setMinRent('');
    setMaxRent('');
    onFilter({ page: 1 });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* 标签行 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-2">
        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-gray-500">关键词</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500">租房类型</label>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-gray-500">租金范围（元/月）</label>
        </div>
        <div className="md:col-span-3 hidden md:block">
          {/* 按钮区域不需要标签，但保留占位 */}
        </div>
      </div>
      
      {/* 输入行 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* 关键词搜索 */}
        <div className="md:col-span-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="搜索标题或地址..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* 租房类型 */}
        <div className="md:col-span-2">
          <Select
            placeholder="全部"
            value={rentType}
            onChange={(value) => setRentType(value)}
            options={[
              { value: 'whole', label: '整租' },
              { value: 'shared', label: '合租' },
            ]}
          />
        </div>
        
        {/* 租金范围 */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="最低"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="text-gray-300 flex-shrink-0">—</span>
            <Input
              type="number"
              placeholder="最高"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Button onClick={handleSearch} loading={loading} className="flex-1 h-[42px] flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索
          </Button>
          <Button variant="secondary" onClick={handleReset} className="h-[42px] px-4">
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
