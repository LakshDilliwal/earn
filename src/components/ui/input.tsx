import * as React from 'react';

import { cn } from '@/utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-[#D9D1C5] file:text-foreground focus-visible:ring-[#22362B] flex h-9 w-full rounded-md border bg-[#FBF7F0] px-3 py-1 text-[0.8rem] text-[#111111] shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#5E5A54] focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
