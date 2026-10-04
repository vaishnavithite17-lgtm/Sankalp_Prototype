import React from 'react';
import { Status } from '@/types';

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  let styles = 'bg-slate-100 text-slate-700 border-slate-300';
  let label = status.replace('_', ' ');

  switch (status) {
    case 'REPORTED':
      styles = 'bg-slate-100 text-slate-700 border-slate-300';
      label = 'Reported';
      break;
    case 'AI_ANALYSED':
      styles = 'bg-purple-50 text-purple-700 border-purple-200';
      label = 'AI Analysed';
      break;
    case 'ASSIGNED':
      styles = 'bg-blue-50 text-blue-700 border-blue-200';
      label = 'Assigned to Dept';
      break;
    case 'IN_PROGRESS':
      styles = 'bg-amber-50 text-amber-800 border-amber-300';
      label = 'Work In Progress';
      break;
    case 'RESOLVED':
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      label = 'Resolved';
      break;
    case 'CITIZEN_VERIFIED':
      styles = 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
      label = 'Citizen Verified';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
