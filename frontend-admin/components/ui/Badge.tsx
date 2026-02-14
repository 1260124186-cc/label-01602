/**
 * 标签/徽章组件
 */

import { cn } from '@/lib/utils';
import type { ListingStatus, RentType } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** 房源状态徽章 */
export function StatusBadge({ status }: { status: ListingStatus }) {
  const config: Record<ListingStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: '待审核', variant: 'warning' },
    approved: { label: '已通过', variant: 'success' },
    rejected: { label: '已驳回', variant: 'danger' },
  };
  
  const { label, variant } = config[status];
  
  return <Badge variant={variant}>{label}</Badge>;
}

/** 租房类型徽章 */
export function RentTypeBadge({ rentType }: { rentType: RentType }) {
  const config: Record<RentType, { label: string; variant: BadgeProps['variant'] }> = {
    whole: { label: '整租', variant: 'info' },
    shared: { label: '合租', variant: 'default' },
  };
  
  const { label, variant } = config[rentType];
  
  return <Badge variant={variant}>{label}</Badge>;
}
