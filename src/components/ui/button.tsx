import { cn } from '@/lib/utils';
import React from 'react';

export function buttonStyles(className?: string) {
  return cn(
    'inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:opacity-95 disabled:opacity-60',
    className
  );
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonStyles(className)} {...props} />;
}
