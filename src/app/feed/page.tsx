import React from 'react';
import { db } from '@/lib/db';
import { IssueCard } from '@/components/issue-card';
import { ClusterCard } from '@/components/cluster-card';
import { MockMap } from '@/components/mock-map';
import Link from 'next/link';
import { MapPin, ListFilter, Filter, Layers, PlusCircle } from 'lucide-react';

export const revalidate = 0;

interface SearchParamsProps {
  searchParams: Promise<{
    category?: string;
    department?: string;
    priority?: string;
    status?: string;
    view?: string;
  }>;
}

export default async function FeedPage({ searchParams }: SearchParamsProps) {
  const params = await searchParams;
  const categoryFilter = params.category || '';
  const departmentFilter = params.department || '';
  const priorityFilter = params.priority || '';
  const statusFilter = params.status || '';
  const activeView = params.view || 'list';

  const where: any = {};
  if (categoryFilter) where.category = categoryFilter;
  if (departmentFilter) where.department = departmentFilter;
  if (priorityFilter) where.priority = priorityFilter;
  if (statusFilter) where.status = statusFilter;

  const issues = await db.issue.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      supports: true,
      cluster: true,
    },
    orderBy: [{ impactScore: 'desc' }, { createdAt: 'desc' }],
  });

  const clusters = await db.cluster.findMany({
    include: { issues: true },
    orderBy: [{ impactScore: 'desc' }, { reportCount: 'desc' }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Public Issue Feed & Urban Map</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Explore active civic complaints, verified hotspots, and AI-derived priority rankings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle Tabs */}
          <div className="bg-slate-100 p-1 rounded-md flex items-center border border-slate-200 text-xs">
            <Link
              href={`/feed?view=list${categoryFilter ? `&category=${categoryFilter}` : ''}`}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeView === 'list'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </Link>
            <Link
              href={`/feed?view=map${categoryFilter ? `&category=${categoryFilter}` : ''}`}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeView === 'map'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Map
            </Link>
          </div>

          <Link
            href="/report"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors inline-flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Issue</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <input type="hidden" name="view" value={activeView} />

        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
          <select
            name="category"
            defaultValue={categoryFilter}
            className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800"
          >
            <option value="">All Categories</option>
            <option value="Garbage / Waste">Garbage / Waste</option>
            <option value="Pothole / Road Damage">Pothole / Road Damage</option>
            <option value="Broken Streetlight">Broken Streetlight</option>
            <option value="Blocked Drainage">Blocked Drainage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Open Waste Burning">Open Waste Burning</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">Department</label>
          <select
            name="department"
            defaultValue={departmentFilter}
            className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800"
          >
            <option value="">All Departments</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Roads Department">Roads Department</option>
            <option value="Electrical Department">Electrical Department</option>
            <option value="Drainage Department">Drainage Department</option>
            <option value="Water Department">Water Department</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">AI Priority</label>
          <select
            name="priority"
            defaultValue={priorityFilter}
            className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">Status</label>
          <select
            name="status"
            defaultValue={statusFilter}
            className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="AI_ANALYSED">AI Analysed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div className="flex items-end space-x-2 col-span-2 sm:col-span-1">
          <button
            type="submit"
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded"
          >
            Apply Filters
          </button>
          <Link
            href={`/feed?view=${activeView}`}
            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded text-center"
          >
            Reset
          </Link>
        </div>
      </form>

      {/* Unified Clusters Highlight section */}
      {clusters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-900">
            <Layers className="w-4 h-4 text-purple-700" />
            <span>AI Unified Clusters ({clusters.length} Duplicate Hotspots Grouped)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster as any} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area: Map vs List */}
      {activeView === 'map' ? (
        <MockMap issues={issues as any} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {issues.length} reported issues (sorted by AI Impact Score)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue as any} />
            ))}
          </div>

          {issues.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded border border-dashed border-slate-300 text-slate-500 text-sm">
              No issues match the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
