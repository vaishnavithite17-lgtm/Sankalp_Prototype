import React from 'react';
import { Status } from '@/types';
import { CheckCircle2, Clock, ShieldCheck, UserCheck, Wrench, AlertCircle } from 'lucide-react';

interface TimelineStep {
  id: string;
  status: Status;
  comment: string;
  proofImageUrl?: string | null;
  createdAt: string;
  updatedBy?: { name: string; role: string };
}

interface Props {
  currentStatus: Status;
  updates?: TimelineStep[];
}

export function StatusTimeline({ currentStatus, updates = [] }: Props) {
  const steps: { key: Status; title: string; desc: string }[] = [
    { key: 'REPORTED', title: '1. Report Submitted', desc: 'Complaint registered by citizen' },
    { key: 'AI_ANALYSED', title: '2. AI Impact Analysed', desc: 'Prioritization score calculated' },
    { key: 'ASSIGNED', title: '3. Assigned to Dept', desc: 'Routed to responsible municipal authority' },
    { key: 'IN_PROGRESS', title: '4. Work In Progress', desc: 'Department maintenance crew dispatched' },
    { key: 'RESOLVED', title: '5. Issue Resolved', desc: 'Proof attached & issue closed' },
  ];

  const getStepState = (key: Status) => {
    const statusOrder: Status[] = ['REPORTED', 'AI_ANALYSED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CITIZEN_VERIFIED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const keyIndex = statusOrder.indexOf(key);

    if (keyIndex < currentIndex) return 'completed';
    if (keyIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-6">
      <h3 className="font-bold text-slate-900 text-base tracking-tight flex items-center justify-between border-b border-slate-100 pb-3">
        <span>Transparent Status Resolution Flow</span>
        <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Live Tracking
        </span>
      </h3>

      {/* Workflow Steps Horizontal/Vertical Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((step) => {
          const state = getStepState(step.key);
          let circleBg = 'bg-slate-100 border-slate-300 text-slate-400';
          let borderStyle = 'border-slate-200 bg-slate-50';

          if (state === 'completed') {
            circleBg = 'bg-emerald-600 text-white border-emerald-600';
            borderStyle = 'border-emerald-200 bg-emerald-50/50 text-emerald-950';
          } else if (state === 'current') {
            circleBg = 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100';
            borderStyle = 'border-blue-300 bg-blue-50 text-blue-950 font-medium';
          }

          return (
            <div key={step.key} className={`p-3 rounded-md border text-xs space-y-1.5 ${borderStyle}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${circleBg}`}>
                  {state === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{step.title.charAt(0)}</span>
                  )}
                </div>
                <span className="font-bold tracking-tight">{step.title.substring(3)}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Official Audit Trail & Authority Resolution Proof */}
      {updates.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Official Activity Log & Resolution Proofs
          </h4>
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-md space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                    <span>{update.updatedBy?.name || 'Department Officer'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(update.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-sans">{update.comment}</p>

                {/* Resolution Proof Attachment */}
                {update.proofImageUrl && (
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-emerald-800 mb-1 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Official Resolution Proof Uploaded</span>
                    </div>
                    <div className="relative w-full max-w-sm h-48 rounded bg-slate-200 overflow-hidden border border-emerald-300 shadow-xs">
                      <img
                        src={update.proofImageUrl}
                        alt="Resolution Proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
