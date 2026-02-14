/**
 * 自定义选择框组件（参考 Element Plus 样式）
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder = '请选择',
  value,
  onChange,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);

  // 同步外部 value 变化
  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue('');
    onChange?.('');
  };

  return (
    <div className={cn('w-full', className)} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* 选择框触发器 */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full h-[42px] px-3 border rounded-btn text-sm transition-all cursor-pointer',
            'flex items-center justify-between gap-2',
            'hover:border-primary-400',
            isOpen && 'border-primary-500',
            error ? 'border-danger' : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
          )}
        >
          <span className={cn(
            'truncate',
            selectedOption ? 'text-gray-900' : 'text-gray-400'
          )}>
            {selectedOption?.label || placeholder}
          </span>
          
          <div className="flex items-center gap-1">
            {/* 清除按钮 */}
            {selectedValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* 箭头图标 */}
            <svg
              className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                isOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 下拉选项列表 */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-btn shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400 text-center">
                暂无选项
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'px-3 py-2 text-sm cursor-pointer transition-colors',
                    'hover:bg-primary-50 hover:text-primary-600',
                    selectedValue === option.value && 'bg-primary-50 text-primary-600 font-medium'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
