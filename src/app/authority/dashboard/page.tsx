import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PriorityBadge } from '@/components/priority-badge';
import { StatusBadge } from '@/components/status-badge';
import Link from 'next/link';
import { Building2, AlertTriangle, Layers, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 0;

interface Props {
  searchParams: Promise<{
    department?: string;
    priority?: string;
    status?: string;
  }>;
}

export default async function AuthorityDashboardPage({ searchParams }: Props) {
  const session = await getSession();
  const params = await searchParams;

  const selectedDepartment = params.department || session?.department || 'Waste Management';
  const priorityFilter = params.priority || '';
  const statusFilter = params.status || '';

  const where: any = {};
  if (selectedDepartment && selectedDepartment !== 'ALL') where.department = selectedDepartment;
  if (priorityFilter) where.priority = priorityFilter;
  if (statusFilter) where.status = statusFilter;

  const departmentIssues = await db.issue.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      cluster: true,
      updates: true,
    },
    orderBy: [{ impactScore: 'desc' }, { createdAt: 'desc' }],
  });

  const criticalIssues = departmentIssues.filter((i) => i.priority === 'CRITICAL');
  const pendingCount = departmentIssues.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CITIZEN_VERIFIED').length;
  const resolvedCount = departmentIssues.filter((i) => i.status === 'RESOLVED').length;

  const clusters = await db.cluster.findMany({
    where: selectedDepartment && selectedDepartment !== 'ALL' ? { department: selectedDepartment } : {},
    include: { issues: true },
    orderBy: { impactScore: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Authority Portal Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 border border-slate-800 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                Municipal Authority Portal — {selectedDepartment}
              </h1>
              <p className="text-xs text-slate-400">
                Data-driven prioritization engine. High urban impact hotspots are auto-assigned to top of queue.
              </p>
            </div>
          </div>

          {/* Department Selector */}
          <form method="GET" className="flex items-center space-x-2">
            <select
              name="department"
              defaultValue={selectedDepartment}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded px-3 py-1.5 font-medium focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Roads Department">Roads Department</option>
              <option value="Electrical Department">Electrical Department</option>
              <option value="Drainage Department">Drainage Department</option>
              <option value="Water Department">Water Department</option>
            </select>
            <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded">
              Switch
            </button>
          </form>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-slate-400 block">Assigned Queue</span>
            <span className="text-2xl font-bold text-white mt-0.5 block">{departmentIssues.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Critical Impact Hotspots</span>
            <span className="text-2xl font-bold text-red-400 mt-0.5 block">{criticalIssues.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Pending Action</span>
            <span className="text-2xl font-bold text-amber-400 mt-0.5 block">{pendingCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Resolved Cases</span>
            <span className="text-2xl font-bold text-emerald-400 mt-0.5 block">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Unified Clusters Priority Section */}
      {clusters.length > 0 && (
        <div className="bg-purple-900/10 border border-purple-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center">
              <Layers className="w-4 h-4 mr-1 text-purple-700" />
              Unified Issue Clusters (Grouped Duplicates)
            </span>
            <span className="text-xs text-purple-800">
              One resolution resolves all merged reports
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clusters.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded border border-purple-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{c.title}</span>
                  <PriorityBadge priority={c.priority as any} size="sm" />
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>{c.reportCount} duplicate citizen reports</span>
                  <span className="font-mono font-bold text-purple-900">Score: {c.impactScore.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Issue Work Queue Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs space-y-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Work Queue & Action Telemetry ({departmentIssues.length} items)
          </h2>

          <form method="GET" className="flex items-center space-x-2 text-xs">
            <input type="hidden" name="department" value={selectedDepartment} />
            <select
              name="priority"
              defaultValue={priorityFilter}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
            >
              <option value="">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
            </select>
            <select
              name="status"
              defaultValue={statusFilter}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="AI_ANALYSED">AI Analysed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <button type="submit" className="px-2.5 py-1 bg-slate-800 text-white font-bold rounded">
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Priority</th>
                <th className="p-3">Score</th>
                <th className="p-3">Issue Title & Category</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <PriorityBadge priority={issue.priority as any} size="sm" />
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {issue.impactScore.toFixed(0)} / 100
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{issue.title}</div>
                    <div className="text-[11px] text-slate-500">{issue.category} • {issue.communitySupport} supporters</div>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{issue.department}</td>
                  <td className="p-3">
                    <StatusBadge status={issue.status as any} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/authority/issues/${issue.id}`}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded inline-flex items-center space-x-1"
                    >
                      <span>Manage / Proof</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
