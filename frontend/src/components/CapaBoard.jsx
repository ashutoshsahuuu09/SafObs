import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Wrench, 
  AlertCircle,
  Play
} from 'lucide-react';
import { api } from '../services/api';

export default function CapaBoard({ capas, onRefresh }) {
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredCapas = capas.filter(c => {
    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'OPEN') return c.status !== 'CLOSED';
    if (selectedTab === 'CLOSED') return c.status === 'CLOSED';
    return c.status === selectedTab;
  });

  const handleUpdateStatus = async (capaId, newStatus) => {
    setIsUpdating(true);
    try {
      await api.updateCapa(capaId, {
        status: newStatus,
        resolution_notes: newStatus === 'CLOSED' ? 'Action item completed and verified on plant floor.' : undefined
      });
      setIsUpdating(false);
      onRefresh();
    } catch (err) {
      console.error("CAPA update failed:", err);
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Friendly Filter */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Safety Action Tasks (CAPA)</span>
          </h2>
          <p className="text-xs text-slate-400">Assigned fixes to resolve reported plant hazards</p>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSelectedTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTab === 'ALL' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tasks ({capas.length})
          </button>
          <button
            onClick={() => setSelectedTab('OPEN')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTab === 'OPEN' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Progress ({capas.filter(c => c.status !== 'CLOSED').length})
          </button>
          <button
            onClick={() => setSelectedTab('CLOSED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTab === 'CLOSED' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Completed ({capas.filter(c => c.status === 'CLOSED').length})
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCapas.map((capa) => {
          const isOverdue = new Date(capa.due_date) < new Date() && capa.status !== 'CLOSED';
          return (
            <div 
              key={capa.id}
              className={`glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border ${
                isOverdue ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                
                {/* Priority & Status Row */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    capa.priority === 'P1' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    capa.priority === 'P2' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    Priority {capa.priority}
                  </span>

                  {capa.status === 'CLOSED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>COMPLETED</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      IN PROGRESS
                    </span>
                  )}
                </div>

                {/* Task Title */}
                <h3 className="text-sm font-bold text-white">
                  {capa.title}
                </h3>

                {/* Action Instructions */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5">Fix Instructions:</strong>
                  {capa.action_description}
                </div>
              </div>

              {/* Assignee & Due Date Footer */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center text-slate-300 font-medium">
                    <User className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    {capa.assigned_to}
                  </span>
                  <span className={`flex items-center font-semibold ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {isOverdue ? "⚠️ Overdue" : `Due ${new Date(capa.due_date).toLocaleDateString()}`}
                  </span>
                </div>

                {/* Action Button */}
                {capa.status !== 'CLOSED' ? (
                  <button
                    onClick={() => handleUpdateStatus(capa.id, 'CLOSED')}
                    disabled={isUpdating}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark Fixed & Verify</span>
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-400 text-xs font-semibold">
                    ✓ Verified on {new Date(capa.closed_at || capa.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
