/**
 * 登录页面
 */

'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const { login, isLoading } = useAuthStore();
  const toast = useToastStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = '请输入邮箱';
    if (!password) newErrors.password = '请输入密码';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const result = await login(email, password);
    if (result.success) {
      toast.success('登录成功');
      router.push(redirect);
    } else {
      toast.error(result.error || '登录失败');
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">登录账户</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="邮箱"
          type="email"
          placeholder="请输入邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        
        <Input
          label="密码"
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        
        <Button type="submit" className="w-full" loading={isLoading}>
          登录
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        还没有账户？{' '}
        <Link href="/register" className="text-primary-500 hover:text-primary-600 font-medium">
          立即注册
        </Link>
      </div>
      
      {/* 测试账户提示 */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
        <p className="font-medium mb-1">测试账户：</p>
        <p>管理员: admin@rental.com / admin123</p>
        <p>用户: test@rental.com / user123</p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">登录账户</CardTitle>
          </CardHeader>
          <div className="p-4 text-center text-gray-500">加载中...</div>
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
