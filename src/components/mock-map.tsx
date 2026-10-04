'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IssueItem } from '@/types';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';
import { MapPin, Navigation, Info, ExternalLink } from 'lucide-react';

interface Props {
  issues: IssueItem[];
}

export function MockMap({ issues }: Props) {
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(issues[0] || null);

  // Map coordinates grid projection (bounded between lat 18.50 to 18.55 and lon 73.83 to 73.88)
  const minLat = 18.50;
  const maxLat = 18.55;
  const minLon = 73.82;
  const maxLon = 73.88;

  const getPositionStyle = (lat: number, lon: number) => {
    const top = 100 - ((lat - minLat) / (maxLat - minLat)) * 80 - 10;
    const left = ((lon - minLon) / (maxLon - minLon)) * 80 + 10;
    return {
      top: `${Math.min(Math.max(top, 15), 85)}%`,
      left: `${Math.min(Math.max(left, 10), 90)}%`,
    };
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-3 text-white overflow-hidden shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm tracking-tight">Interactive Urban Issue Map Grid</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">City Sector Grid (Pune Metropolitan Zone)</div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded border border-slate-800 overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Map Grid Road Overlay simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-400"></div>
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-slate-500"></div>
          <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-slate-400"></div>
          <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-slate-500"></div>
        </div>

        {/* Map Pins */}
        {issues.map((issue) => {
          const pos = getPositionStyle(issue.latitude, issue.longitude);
          const isSelected = selectedIssue?.id === issue.id;

          let pinBg = 'bg-blue-600 border-white';
          if (issue.priority === 'CRITICAL') pinBg = 'bg-red-600 border-red-200 animate-bounce';
          else if (issue.priority === 'HIGH') pinBg = 'bg-amber-500 border-amber-200';

          return (
            <button
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              style={pos}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-transform ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
              title={`${issue.title} (${issue.priority})`}
            >
              <div
                className={`w-7 h-7 rounded-full ${pinBg} border-2 flex items-center justify-center shadow-lg cursor-pointer`}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap border border-slate-700 pointer-events-none shadow-md">
                {issue.title}
              </div>
            </button>
          );
        })}

        {/* Selected Pin Popup Drawer */}
        {selectedIssue && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-lg p-3 space-y-2 shadow-2xl z-40">
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                {selectedIssue.category}
              </span>
              <PriorityBadge priority={selectedIssue.priority} size="sm" />
            </div>
            <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{selectedIssue.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-2">{selectedIssue.description}</p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="font-mono text-emerald-400 font-bold">
                Impact: {selectedIssue.impactScore.toFixed(0)}/100
              </span>
              <Link
                href={`/issues/${selectedIssue.id}`}
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
              >
                <span>View telemetry</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-1.5" /> Critical
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" /> High
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" /> Medium/Low
          </span>
        </div>
        <span>Click pin to view telemetry</span>
      </div>
    </div>
  );
}
