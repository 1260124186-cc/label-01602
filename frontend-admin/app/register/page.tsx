/**
 * 注册页面
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const toast = useToastStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name || name.length < 2) {
      newErrors.name = '用户名至少2个字符';
    }
    if (!email) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '邮箱格式不正确';
    }
    if (!password || password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const result = await register(email, password, name);
    if (result.success) {
      toast.success('注册成功');
      router.push('/');
    } else {
      toast.error(result.error || '注册失败');
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">注册账户</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="用户名"
            placeholder="请输入用户名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          
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
            placeholder="至少6位密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          
          <Input
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          
          <Button type="submit" className="w-full" loading={isLoading}>
            注册
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          已有账户？{' '}
          <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  );
}
