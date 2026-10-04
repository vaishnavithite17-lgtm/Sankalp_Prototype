import React from 'react';
import Link from 'next/link';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';
import { ClusterItem } from '@/types';
import { Layers, MapPin, Users, FileText, ChevronRight } from 'lucide-react';

interface Props {
  cluster: ClusterItem;
}

export function ClusterCard({ cluster }: Props) {
  return (
    <div className="bg-purple-900/10 border-2 border-purple-200 rounded-lg p-4 space-y-3 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-purple-100 text-purple-700 rounded font-bold">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              CORE INNOVATION 2 — UNIFIED ISSUE CLUSTER
            </span>
            <h4 className="font-bold text-slate-900 text-base mt-1">{cluster.title}</h4>
          </div>
        </div>
        <PriorityBadge priority={cluster.priority} size="sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded border border-purple-100 text-xs">
        <div>
          <span className="text-slate-500 block">Total Reports Clustered</span>
          <span className="text-base font-bold text-purple-900 flex items-center mt-0.5">
            <FileText className="w-4 h-4 mr-1 text-purple-600" />
            {cluster.reportCount} reports
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Total Community Supporters</span>
          <span className="text-base font-bold text-emerald-700 flex items-center mt-0.5">
            <Users className="w-4 h-4 mr-1 text-emerald-600" />
            {cluster.supporterCount} supporters
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Aggregated Impact Score</span>
          <span className="text-base font-bold text-slate-900 mt-0.5 block">
            {cluster.impactScore.toFixed(0)} / 100
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Responsible Department</span>
          <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
            {cluster.department}
          </span>
        </div>
      </div>

      {cluster.issues && cluster.issues.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-medium text-slate-600">Reports merged into this cluster:</div>
          <div className="space-y-1">
            {cluster.issues.slice(0, 3).map((iss) => (
              <div
                key={iss.id}
                className="bg-white p-2 rounded border border-slate-200 text-xs flex items-center justify-between"
              >
                <span className="text-slate-800 font-medium truncate">{iss.title}</span>
                <span className="text-slate-500 text-[11px] shrink-0 ml-2">Score: {iss.impactScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <StatusBadge status={cluster.status} />
        <span className="text-xs text-purple-800 font-medium">
          One Issue ➔ One Priority ➔ One Resolution
        </span>
      </div>
    </div>
  );
}
