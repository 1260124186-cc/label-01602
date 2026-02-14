/**
 * 房源卡片组件
 */

import Link from 'next/link';
import { RentTypeBadge, StatusBadge } from '@/components/ui/Badge';
import { formatMoney, formatArea, formatDate, truncateText } from '@/lib/utils';
import type { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  showStatus?: boolean;
}

export function ListingCard({ listing, showStatus = false }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer h-full overflow-hidden group flex flex-col">
        {/* 内容区 */}
        <div className="p-5 flex-1">
          {/* 头部：状态和类型 */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <RentTypeBadge rentType={listing.rentType} />
            {showStatus && <StatusBadge status={listing.status} />}
          </div>
          
          {/* 标题 */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors">
            {truncateText(listing.title, 40)}
          </h3>
          
          {/* 价格 */}
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-bold text-primary-500">
              {formatMoney(listing.rent)}
            </span>
            <span className="text-sm text-gray-400">/月</span>
          </div>
          
          {/* 信息栏 */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {listing.area && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{formatArea(listing.area)}</span>
              </div>
            )}
            {listing.floor && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{listing.floor}</span>
              </div>
            )}
          </div>
          
          {/* 地址 */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl mb-4">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 line-clamp-1">{listing.address}</span>
          </div>
          
          {/* 标签 */}
          {listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {listing.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg font-medium"
                >
                  {tag}
                </span>
              ))}
              {listing.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{listing.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* 驳回原因（仅在显示状态且已驳回时展示） */}
          {showStatus && listing.status === 'rejected' && listing.rejectReason && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 mt-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium">驳回原因：</span>
                  {listing.rejectReason}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 底部信息 - 始终在最底部 */}
        <div className="px-5 py-3 bg-primary-500 group-hover:bg-primary-600 transition-colors flex items-center justify-between mt-auto rounded-b-2xl">
          <span className="text-xs text-white/80">
            发布于 {formatDate(listing.createdAt)}
          </span>
          <span className="text-xs text-white font-semibold">
            查看详情 →
          </span>
        </div>
      </div>
    </Link>
  );
}
