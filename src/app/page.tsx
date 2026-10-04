import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { IssueCard } from '@/components/issue-card';
import { ClusterCard } from '@/components/cluster-card';
import { MapPin, PlusCircle, Building2, ShieldCheck, ArrowRight, Layers, CheckCircle2, BarChart2 } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const totalIssues = await db.issue.count();
  const criticalCount = await db.issue.count({ where: { priority: 'CRITICAL' } });
  const resolvedCount = await db.issue.count({ where: { status: 'RESOLVED' } });
  const clusters = await db.cluster.findMany({
    take: 2,
    include: { issues: true },
    orderBy: { reportCount: 'desc' },
  });

  const featuredIssues = await db.issue.findMany({
    take: 3,
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      supports: true,
      cluster: true,
    },
    orderBy: [{ impactScore: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-semibold rounded border border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sustainable Cities Civic-Tech Infrastructure</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              SANKALP — Direct Citizen to Authority Civic Action Platform
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Eliminate complaint multi-layer escalation delays. SANKALP uses AI to route complaints directly to responsible municipal departments, calculate real-world urban impact scores, and cluster duplicate citizen reports into single action items.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/report"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded shadow-xs transition-colors inline-flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Civic Issue</span>
            </Link>

            <Link
              href="/feed"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-sm rounded transition-colors inline-flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>View Issue Feed & Map</span>
            </Link>

            <Link
              href="/authority/dashboard"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800 font-semibold text-sm rounded transition-colors inline-flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Authority Dashboard</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Total Registered Reports</span>
              <span className="text-2xl font-bold text-white mt-1 block">{totalIssues}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Critical Priority Hotspots</span>
              <span className="text-2xl font-bold text-red-400 mt-1 block">{criticalCount}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Unified Clusters (Duplicates)</span>
              <span className="text-2xl font-bold text-purple-400 mt-1 block">{clusters.length}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Successfully Resolved</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Core Innovations Section */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Platform Innovations
            </h2>
            <p className="text-sm text-slate-600">
              Addressing existing civic portal gaps (CPGRAMS, Swachhata, BMC 1916) with impact scoring & duplicate clustering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 space-y-3">
              <div className="px-2.5 py-1 bg-purple-950 text-purple-300 font-mono text-xs font-bold rounded inline-block border border-purple-800">
                INNOVATION 1 — AI URBAN IMPACT ENGINE
              </div>
              <h3 className="font-bold text-lg text-slate-100">Multi-Factor Prioritization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than treating complaints on a simple first-come-first-served basis, our AI scores every issue from 0 to 100 based on Severity, Environmental Impact, Population Affected, Urgency, and Community Verification.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 font-mono pt-1">
                <li>• Low Impact (0-39) ➔ Normal Priority</li>
                <li>• Medium Impact (40-59) ➔ Medium Priority</li>
                <li>• High Impact (60-79) ➔ High Priority</li>
                <li>• Critical Impact (80-100) ➔ Critical Priority</li>
              </ul>
            </div>

            <div className="bg-purple-950/40 border-2 border-purple-300/40 text-slate-900 p-5 rounded-lg space-y-3">
              <div className="px-2.5 py-1 bg-purple-100 text-purple-800 font-mono text-xs font-bold rounded inline-block">
                INNOVATION 2 — AI ISSUE CLUSTERING
              </div>
              <h3 className="font-bold text-lg text-slate-900">Unified Hotspot Merging</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Multiple citizens often report the exact same physical issue (e.g. garbage heap on XYZ Road). The backend detects location proximity (~200m) and category similarity to combine duplicate reports into one Unified Issue.
              </p>
              <div className="bg-white p-2.5 rounded border border-purple-200 text-xs font-semibold text-purple-900">
                Result: Many Reports ➔ One Unified Issue ➔ One Priority ➔ One Resolution
              </div>
            </div>
          </div>
        </section>

        {/* Live Duplicate Issue Clusters Demo */}
        {clusters.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Active Unified Clusters (Duplicate Reports Merged)
                </h2>
                <p className="text-sm text-slate-600">
                  Demonstrating duplicate complaint clustering from multiple citizens around identical coordinates.
                </p>
              </div>
              <Link href="/feed" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center">
                <span>View all in feed</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clusters.map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster as any} />
              ))}
            </div>
          </section>
        )}

        {/* High Priority Active Issues Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                High Impact Civic Complaints
              </h2>
              <p className="text-sm text-slate-600">
                Directly routed to municipal authorities with live telemetry.
              </p>
            </div>
            <Link href="/feed" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center">
              <span>View full feed & map</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue as any} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
