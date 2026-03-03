/**
 * 房源表单组件（发布/编辑）
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { CreateListingRequest, Listing } from '@/types';

interface ListingFormProps {
  initialData?: Listing;
  onSubmit: (data: CreateListingRequest) => Promise<void>;
  loading?: boolean;
  /** 在弹窗内使用时为 true，主内容区滚动、底部按钮固定 */
  inModal?: boolean;
}

export function ListingForm({ initialData, onSubmit, loading, inModal }: ListingFormProps) {
  const [formData, setFormData] = useState<CreateListingRequest>({
    title: initialData?.title || '',
    rent: initialData?.rent || 0,
    address: initialData?.address || '',
    rentType: initialData?.rentType || 'shared',
    area: initialData?.area || undefined,
    floor: initialData?.floor || undefined,
    tags: initialData?.tags || [],
    description: initialData?.description || '',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = '标题至少5个字符';
    }
    if (!formData.rent || formData.rent <= 0) {
      newErrors.rent = '请输入有效的租金';
    } else if (!Number.isInteger(formData.rent)) {
      newErrors.rent = '租金必须为整数，不能包含小数';
    } else if (formData.rent > 100000) {
      newErrors.rent = '租金不能超过100000元';
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = '地址至少5个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };
  
  const handleChange = (field: keyof CreateListingRequest, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags?.includes(trimmedTag) && (formData.tags?.length || 0) < 10) {
      handleChange('tags', [...(formData.tags || []), trimmedTag]);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags?.filter(tag => tag !== tagToRemove));
  };

  // 常用标签
  const commonTags = ['近地铁', '精装修', '有空调', '独卫', '拎包入住', '有暖气', '电梯房', '限女生', '限男生'];
  
  const formFields = (
    <div className={inModal ? 'flex-1 min-h-0 overflow-y-auto space-y-6' : 'space-y-6'}>
          {/* 基础信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="房源标题"
                placeholder="例如：学府路精装两室 近地铁 适合学生合租"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />
            </div>
            
            <Input
              label="月租金（元）"
              type="number"
              placeholder="请输入月租金"
              value={formData.rent || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('rent', val === '' ? 0 : Math.floor(Number(val)));
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              step="1"
              min="1"
              max="100000"
              error={errors.rent}
            />
            
            <Select
              label="租房类型"
              value={formData.rentType}
              onChange={(value) => handleChange('rentType', value)}
              options={[
                { value: 'whole', label: '整租' },
                { value: 'shared', label: '合租' },
              ]}
            />
          </div>
          
          {/* 地址 */}
          <Input
            label="详细地址"
            placeholder="请输入详细地址"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            error={errors.address}
          />
          
          {/* 可选信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="面积（平方米）"
              type="number"
              placeholder="可选"
              value={formData.area || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('area', val === '' ? undefined : Math.floor(Number(val)));
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              step="1"
              min="1"
              max="1000"
            />
            
            <Input
              label="楼层"
              type="number"
              placeholder="可选"
              value={formData.floor || ''}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('floor', val === '' ? undefined : Math.floor(Number(val)));
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              step="1"
              min="1"
              max="200"
            />
          </div>
          
          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签（最多10个）
            </label>
            
            {/* 输入框 - 按回车添加 */}
            <Input
              placeholder="输入自定义标签后按回车添加"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(tagInput);
                  setTagInput('');
                }
              }}
            />
            
            {/* 常用标签 - 点击添加 */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1.5">点击添加常用标签：</p>
              <div className="flex flex-wrap gap-1.5">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={formData.tags?.includes(tag)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      formData.tags?.includes(tag)
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 已选标签 */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1.5">已选标签：</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary-900"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 描述 */}
          <Textarea
            label="房源描述"
            placeholder="详细描述房源情况，如周边配套、交通、室友情况等"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={5}
          />
        </div>
  );

  const buttonBar = (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <Button type="submit" loading={loading}>
        {initialData ? '保存修改' : '提交审核'}
      </Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={inModal ? 'flex flex-1 min-h-0 flex-col' : ''}>
      {inModal ? (
        <>
          {formFields}
          <div className="flex-shrink-0">{buttonBar}</div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? '编辑房源' : '发布新房源'}</CardTitle>
          </CardHeader>
          {formFields}
          {buttonBar}
        </Card>
      )}
    </form>
  );
}
