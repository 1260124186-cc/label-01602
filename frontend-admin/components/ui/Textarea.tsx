/**
 * 多行文本输入组件
 */

'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-3 py-2 border rounded-btn text-sm transition-all resize-none',
            'focus:outline-none focus:border-primary-500',
            'hover:border-primary-400',
            'placeholder:text-gray-400',
            error
              ? 'border-danger focus:border-danger'
              : 'border-gray-300',
            className
          )}
          rows={4}
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

Textarea.displayName = 'Textarea';
