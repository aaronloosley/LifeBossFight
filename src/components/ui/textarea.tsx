import { cn } from '@/lib/utils';

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('w-full rounded-xl border border-white/15 bg-slate-950/60 p-3 text-sm')} {...props} />;
}
