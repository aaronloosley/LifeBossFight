import React from 'react';

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-700/60">
      <div className="h-full rounded-full bg-calm transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
