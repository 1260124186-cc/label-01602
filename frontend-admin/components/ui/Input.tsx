/**
 * 输入框组件
 */

'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-[42px] px-3 border rounded-btn text-sm transition-all',
            'focus:outline-none focus:border-primary-500',
            'hover:border-primary-400',
            'placeholder:text-gray-400',
            error
              ? 'border-danger focus:border-danger'
              : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
