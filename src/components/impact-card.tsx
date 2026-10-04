import React from 'react';
import { PriorityBadge } from './priority-badge';
import { Priority } from '@/types';
import { Sparkles, AlertTriangle, Users, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  severity: number;
  environmentalImpact: number;
  peopleAffected: number;
  urgency: number;
  communitySupport: number;
  impactScore: number;
  priority: Priority;
  aiExplanation: string;
  department: string;
}

export function ImpactCard({
  severity,
  environmentalImpact,
  peopleAffected,
  urgency,
  communitySupport,
  impactScore,
  priority,
  aiExplanation,
  department,
}: Props) {
  return (
    <div className="bg-slate-900 text-white rounded-lg border border-slate-800 p-5 space-y-4 shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight text-slate-100">
              AI Urban Impact Engine (Core Innovation 1)
            </h3>
            <p className="text-xs text-slate-400">Automated Multi-Factor Priority Evaluation</p>
          </div>
        </div>
        <PriorityBadge priority={priority} size="lg" />
      </div>

      {/* Main Score Gauge & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-md border border-slate-800 items-center">
        <div className="text-center md:text-left space-y-1">
          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Overall Impact Score</div>
          <div className="text-4xl font-extrabold text-white flex items-baseline justify-center md:justify-start">
            <span>{impactScore.toFixed(0)}</span>
            <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <div className="text-xs text-slate-300 font-semibold flex items-center">
            <BuildingDepartmentIcon department={department} />
            <span className="ml-1">Assigned Authority: {department}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-900 p-2.5 rounded border border-slate-800">
            {aiExplanation}
          </p>
        </div>
      </div>

      {/* 5-Factor Impact Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
        <FactorGauge label="Severity" score={severity} icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />} />
        <FactorGauge label="Environmental" score={environmentalImpact} icon={<Flame className="w-3.5 h-3.5 text-emerald-400" />} />
        <FactorGauge label="People Affected" score={peopleAffected} icon={<Users className="w-3.5 h-3.5 text-blue-400" />} />
        <FactorGauge label="Urgency" score={urgency} icon={<ShieldAlert className="w-3.5 h-3.5 text-red-400" />} />
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
          <div className="text-slate-400 font-medium text-[11px]">Community Support</div>
          <div className="text-lg font-bold text-emerald-400">{communitySupport} supporters</div>
          <div className="text-[10px] text-slate-500">+1 rescores priority</div>
        </div>
      </div>
    </div>
  );
}

function FactorGauge({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex flex-col justify-between space-y-1.5">
      <div className="flex items-center justify-between text-slate-400 font-medium text-[11px]">
        <span className="flex items-center space-x-1">
          {icon}
          <span>{label}</span>
        </span>
        <span className="font-bold text-slate-200">{score}/5</span>
      </div>
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            score >= 4 ? 'bg-red-500' : score >= 3 ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function BuildingDepartmentIcon({ department }: { department: string }) {
  return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
}
