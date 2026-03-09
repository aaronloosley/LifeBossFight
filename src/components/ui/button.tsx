import { cn } from '@/lib/utils';
import React from 'react';

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:opacity-95 disabled:opacity-60',
        className
      )}
      {...props}
    />
  );
}
