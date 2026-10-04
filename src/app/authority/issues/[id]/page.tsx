'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PriorityBadge } from '@/components/priority-badge';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { Status } from '@/types';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Upload, Building, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function AuthorityIssueManagementPage({ params }: Props) {
  const router = useRouter();

  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Status>('IN_PROGRESS');
  const [comment, setComment] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/issues/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setIssue(data);
          setSelectedStatus(data.status);
          setLoading(false);
        });
    });
  }, [params]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/issues/${issue.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          comment: comment || `Status updated to ${selectedStatus} by Department Authority.`,
          proofImageUrl: proofImageUrl || (selectedStatus === 'RESOLVED' ? 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' : null),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setIssue((prev: any) => ({ ...prev, status: updated.status }));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !issue) {
    return <div className="p-12 text-center text-slate-500 text-sm">Loading issue telemetry...</div>;
  }

  const proofPresets = [
    { label: 'Cleared Garbage Dump Proof', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' },
    { label: 'Repaired Asphalt Pothole Proof', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Fixed Streetlight Proof', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/authority/dashboard"
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 space-x-1"
      >
        <span>← Back to Authority Dashboard</span>
      </Link>

      {/* Main Card */}
      <div className="bg-slate-900 text-white rounded-lg p-6 space-y-4 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono text-xs rounded border border-emerald-800">
              {issue.department}
            </span>
            <span className="text-xs text-slate-400">Category: {issue.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} size="md" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">{issue.title}</h1>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{issue.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Impact Score</span>
            <span className="text-lg font-bold text-white">{issue.impactScore.toFixed(0)} / 100</span>
          </div>
          <div>
            <span className="text-slate-400 block">Community Supporters</span>
            <span className="text-lg font-bold text-emerald-400">{issue.communitySupport} citizens</span>
          </div>
          <div>
            <span className="text-slate-400 block">Coordinates</span>
            <span className="text-xs font-mono font-semibold text-slate-200">{issue.latitude}, {issue.longitude}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Current Status</span>
            <span className="text-xs font-bold text-slate-200">{issue.status}</span>
          </div>
        </div>
      </div>

      {/* Update Action Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Authority Action & Resolution Proof Panel</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Update maintenance status, record official progress notes, and attach photo proof of resolution.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Update Status Transition *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Status)}
              className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm text-slate-900 font-bold"
            >
              <option value="ASSIGNED">3. ASSIGNED (Crew Dispatched)</option>
              <option value="IN_PROGRESS">4. IN_PROGRESS (Maintenance Underway)</option>
              <option value="RESOLVED">5. RESOLVED (Issue Cleared & Closed)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Department Resolution Notes *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter work details, crew ID, and resolution comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="space-y-2 bg-slate-50 p-4 rounded border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Upload className="w-4 h-4 mr-1 text-emerald-600" />
              <span>Resolution Proof Image URL (Required for RESOLVED)</span>
            </label>
            <input
              type="url"
              placeholder="Paste resolution proof photo URL"
              value={proofImageUrl}
              onChange={(e) => setProofImageUrl(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {proofPresets.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setProofImageUrl(p.url)}
                  className="px-2 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-100"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{updating ? 'Updating Telemetry...' : 'Publish Status Update & Proof'}</span>
          </button>
        </form>
      </div>

      {/* Resolution Timeline */}
      <StatusTimeline currentStatus={issue.status} updates={issue.updates as any} />
    </div>
  );
}
