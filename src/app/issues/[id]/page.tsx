import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PriorityBadge } from '@/components/priority-badge';
import { StatusBadge } from '@/components/status-badge';
import { ImpactCard } from '@/components/impact-card';
import { StatusTimeline } from '@/components/status-timeline';
import Link from 'next/link';
import { MapPin, ThumbsUp, Building, Layers, ArrowLeft, Calendar, ShieldCheck, User } from 'lucide-react';

export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function IssueDetailPage({ params }: Props) {
  const { id } = await params;

  const issue = await db.issue.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      supports: true,
      cluster: {
        include: {
          issues: {
            select: { id: true, title: true, status: true, impactScore: true, createdAt: true },
          },
        },
      },
      updates: {
        include: { updatedBy: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!issue) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back Navigation */}
      <Link
        href="/feed"
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 space-x-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Issue Feed</span>
      </Link>

      {/* Main Issue Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-slate-200 text-slate-800 text-xs font-bold rounded">
              {issue.category}
            </span>
            <span className="text-xs font-medium text-slate-500 flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Routed to: <strong className="ml-1 text-slate-800">{issue.department}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={issue.status as any} />
            <PriorityBadge priority={issue.priority as any} size="md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h1 className="text-2xl font-bold text-slate-900 leading-snug">{issue.title}</h1>
            <p className="text-slate-700 text-sm leading-relaxed">{issue.description}</p>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Coordinates: <strong className="text-slate-800 font-mono">{issue.latitude}, {issue.longitude}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Reported on: {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {issue.imageUrl && (
            <div className="relative w-full h-56 rounded-md bg-slate-100 overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* CORE INNOVATION 1: AI Urban Impact Engine Details Card */}
      <ImpactCard
        severity={issue.severity}
        environmentalImpact={issue.environmentalImpact}
        peopleAffected={issue.peopleAffected}
        urgency={issue.urgency}
        communitySupport={issue.communitySupport}
        impactScore={issue.impactScore}
        priority={issue.priority as any}
        aiExplanation={issue.aiExplanation}
        department={issue.department}
      />

      {/* CORE INNOVATION 2: Unified Issue Cluster Telemetry if linked */}
      {issue.cluster && (
        <div className="bg-purple-900/10 border-2 border-purple-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-purple-900">
            <Layers className="w-5 h-5 text-purple-700" />
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                CORE INNOVATION 2 — UNIFIED CLUSTER DETECTED
              </span>
              <h3 className="font-bold text-base mt-1">{issue.cluster.title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded border border-purple-100 text-xs">
            <div>
              <span className="text-slate-500 block">Total Reports Merged</span>
              <span className="text-lg font-bold text-purple-900">{issue.cluster.reportCount} reports</span>
            </div>
            <div>
              <span className="text-slate-500 block">Community Supporters</span>
              <span className="text-lg font-bold text-emerald-700">{issue.cluster.supporterCount} supporters</span>
            </div>
            <div>
              <span className="text-slate-500 block">Aggregated Impact</span>
              <span className="text-lg font-bold text-slate-900">{issue.cluster.impactScore.toFixed(0)} / 100</span>
            </div>
            <div>
              <span className="text-slate-500 block">Single Action Item</span>
              <span className="text-xs font-bold text-slate-800">One Issue ➔ One Resolution</span>
            </div>
          </div>
        </div>
      )}

      {/* Status Timeline Workflow */}
      <StatusTimeline currentStatus={issue.status as any} updates={issue.updates as any} />
    </div>
  );
}
