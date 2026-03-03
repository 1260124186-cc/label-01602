/**
 * 页面头部组件
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const toast = useToastStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 路由变化时关闭移动菜单
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);
  
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    toast.success('已退出登录');
    router.push('/');
  };
  
  const navItems = [
    { href: '/', label: '房源列表' },
    ...(isAuthenticated ? [
      { href: '/publish', label: '发布房源' },
      { href: '/my-listings', label: '我的房源' },
    ] : []),
    ...(isAdmin ? [
      { href: '/admin', label: '管理后台' },
    ] : []),
  ];
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 items-center [grid-template-columns:1fr_auto_1fr] gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 justify-self-start min-w-0">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">租房平台</span>
          </Link>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-1 justify-self-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-btn text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* 用户操作 */}
          <div className="flex items-center gap-2 justify-self-end justify-end min-w-0">
            {/* 移动端菜单按钮 */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={cn(
                  'p-2 rounded-btn transition-colors',
                  'hover:bg-gray-100',
                  showMobileMenu && 'bg-gray-100'
                )}
                aria-label="打开菜单"
              >
                {showMobileMenu ? (
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              
              {/* 移动端下拉菜单 */}
              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {/* 导航链接 */}
                  <div className="py-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'block px-4 py-2.5 text-sm transition-colors',
                          pathname === item.href
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  
                  {/* 登录/注册按钮（未登录时显示） */}
                  {!isAuthenticated && (
                    <div className="border-t border-gray-100 p-3 flex gap-2">
                      <Link href="/login" className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full">登录</Button>
                      </Link>
                      <Link href="/register" className="flex-1">
                        <Button size="sm" className="w-full">注册</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* 用户头像和名称 */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-btn transition-colors',
                    'hover:bg-gray-100',
                    showDropdown && 'bg-gray-100'
                  )}
                >
                  {/* 默认头像 */}
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* 用户名 */}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  
                  {/* 管理员标识 */}
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-600 rounded">
                      管理员
                    </span>
                  )}
                  
                  {/* 下拉箭头 */}
                  <svg
                    className={cn(
                      'w-4 h-4 text-gray-400 transition-transform',
                      showDropdown && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* 下拉菜单 */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-btn shadow-lg overflow-hidden z-50">
                    {/* 用户信息 */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    {/* 菜单项 */}
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 登录/注册按钮 - 桌面端显示 */
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center font-medium rounded-btn transition-colors focus:outline-none bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 px-3 py-1.5 text-sm"
                >
                  登录
                </Link>
                <Link 
                  href="/register"
                  className="inline-flex items-center justify-center font-medium rounded-btn transition-colors focus:outline-none bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 px-3 py-1.5 text-sm"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
