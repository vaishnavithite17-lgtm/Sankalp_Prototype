import React from 'react';
import { Priority } from '@/types';

interface Props {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, size = 'md' }: Props) {
  let styles = 'bg-slate-100 text-slate-700 border-slate-300';
  let label = 'LOW';

  switch (priority) {
    case 'CRITICAL':
      styles = 'bg-red-50 text-red-700 border-red-200 font-bold';
      label = 'CRITICAL PRIORITY';
      break;
    case 'HIGH':
      styles = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      label = 'HIGH PRIORITY';
      break;
    case 'MEDIUM':
      styles = 'bg-blue-50 text-blue-800 border-blue-200 font-medium';
      label = 'MEDIUM PRIORITY';
      break;
    case 'LOW':
      styles = 'bg-slate-100 text-slate-700 border-slate-300';
      label = 'LOW PRIORITY';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded border tracking-wide uppercase ${sizeClasses[size]} ${styles}`}
    >
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          priority === 'CRITICAL'
            ? 'bg-red-600 animate-pulse'
            : priority === 'HIGH'
            ? 'bg-amber-500'
            : priority === 'MEDIUM'
            ? 'bg-blue-500'
            : 'bg-slate-400'
        }`}
      />
      {label}
    </span>
  );
}
