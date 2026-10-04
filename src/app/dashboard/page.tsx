import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { IssueCard } from '@/components/issue-card';
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const revalidate = 0;

export default async function CitizenDashboardPage() {
  const session = await getSession();
  const userId = session?.id || 'usr-cit-1';

  const myIssues = await db.issue.findMany({
    where: { createdById: userId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      supports: true,
      cluster: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const inProgressCount = myIssues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-emerald-600" />
            <span>Citizen Dashboard</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Track your reported civic complaints, impact rankings, and authority resolution updates.
          </p>
        </div>

        <Link
          href="/report"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors inline-flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">My Total Reports</span>
          <div className="text-3xl font-extrabold text-slate-900">{myIssues.length}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-amber-600 font-medium flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Work In Progress
          </span>
          <div className="text-3xl font-extrabold text-amber-600">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-emerald-600 font-medium flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Resolved Complaints
          </span>
          <div className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</div>
        </div>
      </div>

      {/* My Reports Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">My Submitted Complaints</h2>

        {myIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue as any} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-12 text-center space-y-3">
            <p className="text-sm text-slate-600">You haven't reported any civic complaints yet.</p>
            <Link
              href="/report"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded shadow-xs"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Report Your First Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
