'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IssueItem } from '@/types';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';
import { MapPin, ThumbsUp, Layers, Building, ChevronRight, Clock } from 'lucide-react';

interface Props {
  issue: IssueItem;
  onSupportToggle?: () => void;
}

export function IssueCard({ issue, onSupportToggle }: Props) {
  const [supportCount, setSupportCount] = useState(issue.communitySupport);
  const [isSupporting, setIsSupporting] = useState(false);

  const handleSupport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSupporting(true);
    try {
      const res = await fetch(`/api/issues/${issue.id}/support`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setSupportCount(updated.communitySupport);
        if (onSupportToggle) onSupportToggle();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSupporting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header & Category Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-medium rounded">
              {issue.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center">
              <Building className="w-3 h-3 mr-1 text-slate-400" />
              {issue.department}
            </span>
          </div>
          <PriorityBadge priority={issue.priority} size="sm" />
        </div>

        {/* Card Main Body */}
        <div className="p-4 space-y-3">
          <div className="flex space-x-3">
            {issue.imageUrl && (
              <div className="relative w-24 h-24 rounded bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                href={`/issues/${issue.id}`}
                className="font-semibold text-slate-900 hover:text-emerald-700 text-base leading-snug line-clamp-2 transition-colors block"
              >
                {issue.title}
              </Link>
              <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                {issue.description}
              </p>
            </div>
          </div>

          {/* Unified Issue Cluster Tag if linked */}
          {issue.cluster && (
            <div className="bg-purple-50 border border-purple-200 rounded p-2 text-xs text-purple-900 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="font-medium">
                  Unified Cluster ({issue.cluster.reportCount} duplicate reports)
                </span>
              </div>
              <span className="font-bold text-purple-700">
                Score: {issue.cluster.impactScore.toFixed(0)}
              </span>
            </div>
          )}

          {/* AI Impact Score Bar */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center">
                AI Urban Impact Score
              </span>
              <span className="font-bold text-slate-900">{issue.impactScore.toFixed(0)} / 100</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  issue.impactScore >= 80
                    ? 'bg-red-600'
                    : issue.impactScore >= 60
                    ? 'bg-amber-500'
                    : issue.impactScore >= 40
                    ? 'bg-blue-500'
                    : 'bg-slate-400'
                }`}
                style={{ width: `${issue.impactScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusBadge status={issue.status} />

          <button
            onClick={handleSupport}
            disabled={isSupporting}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-medium transition-all"
            title="Verify & support this issue"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+1 Support ({supportCount})</span>
          </button>
        </div>

        <Link
          href={`/issues/${issue.id}`}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center"
        >
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
