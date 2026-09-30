import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function MetricCards({ analytics }) {
  const data = analytics || {
    total_observations: 6,
    open_observations: 4,
    high_risk_observations: 4,
    resolved_observations: 2,
    overdue_actions: 1,
    mean_time_to_resolve_hours: 18.4,
    risk_distribution: { CRITICAL: 2, HIGH: 2, MEDIUM: 1, LOW: 1 }
  };

  const criticalCount = data.risk_distribution?.CRITICAL || 0;
  const highCount = data.risk_distribution?.HIGH || 0;
  const urgentCount = criticalCount + highCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Hazards Logged */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Hazards Logged</span>
          <div className="p-2 rounded-xl bg-slate-800 text-orange-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{data.total_observations}</span>
          <span className="text-xs font-semibold text-slate-400">reports filed</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
          <span className="text-amber-400 font-semibold">{data.open_observations} Still Open</span>
          <span className="text-emerald-400 font-semibold flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" /> {data.resolved_observations} Fixed
          </span>
        </div>
      </div>

      {/* 2. Needs Immediate Fix (Critical & High) */}
      <div className="glass-panel p-5 rounded-2xl border border-red-500/30 bg-red-950/10 relative overflow-hidden group hover:border-red-500/50 transition-all shadow-glow-critical">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Urgent Attention</span>
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse-subtle">
            <Flame className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-red-400">{urgentCount}</span>
          <span className="text-xs font-medium text-slate-300">High / Critical Hazards</span>
        </div>
        <div className="mt-3 flex items-center space-x-2 text-xs pt-2 border-t border-red-500/20">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
            {criticalCount} Critical
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
            {highCount} High Risk
          </span>
        </div>
      </div>

      {/* 3. Action Tasks & SLA */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corrective Tasks (CAPA)</span>
          <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{data.open_observations}</span>
          <span className="text-xs font-medium text-slate-400">active assignments</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
          <span className={data.overdue_actions > 0 ? "text-red-400 font-bold" : "text-slate-400"}>
            {data.overdue_actions > 0 ? `⚠️ ${data.overdue_actions} Task Overdue` : "All on schedule"}
          </span>
          <span className="text-slate-300 font-medium">Avg ~18h fix time</span>
        </div>
      </div>

      {/* 4. AI Fast Assistant Advantage */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-glow-cyan">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Auto-Form Speed</span>
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-cyan-300">&lt; 30 sec</span>
          <span className="text-xs font-medium text-slate-400">vs 25 min paperwork</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-cyan-500/20">
          <span className="text-cyan-200">Instant OSHA & CAPA auto-fill</span>
          <span className="text-emerald-400 font-bold font-mono">96% Acc</span>
        </div>
      </div>

    </div>
  );
}
