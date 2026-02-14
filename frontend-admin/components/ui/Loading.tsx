/**
 * 加载状态组件
 */

import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loading({ size = 'md', className }: LoadingProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin text-primary-500', sizeStyles[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

/** 页面级加载 */
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size="lg" />
    </div>
  );
}

/** 空状态 */
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = '暂无数据',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg
        className="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
