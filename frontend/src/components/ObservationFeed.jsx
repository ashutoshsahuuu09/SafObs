import React, { useState } from 'react';
import { 
  Search, 
  Camera, 
  Mic, 
  FileText, 
  PenTool, 
  Video,
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Plus,
  Filter,
  MapPin,
  Building
} from 'lucide-react';

export default function ObservationFeed({ observations, onSelectObservation, onOpenNewModal }) {
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState('ALL'); // ALL, CRITICAL, ACTION_NEEDED, RESOLVED
  const [selectedDept, setSelectedDept] = useState('ALL');

  const departments = Array.from(new Set(observations.map(o => o.department))).filter(Boolean);

  const filteredObservations = observations.filter(obs => {
    const matchesSearch = !search || 
      obs.title.toLowerCase().includes(search.toLowerCase()) ||
      obs.description.toLowerCase().includes(search.toLowerCase()) ||
      obs.department.toLowerCase().includes(search.toLowerCase()) ||
      obs.location_details.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || obs.department === selectedDept;

    let matchesQuick = true;
    if (quickFilter === 'CRITICAL') {
      matchesQuick = obs.risk_level === 'CRITICAL' || obs.risk_level === 'HIGH';
    } else if (quickFilter === 'ACTION_NEEDED') {
      matchesQuick = obs.status !== 'RESOLVED';
    } else if (quickFilter === 'RESOLVED') {
      matchesQuick = obs.status === 'RESOLVED';
    }

    return matchesSearch && matchesDept && matchesQuick;
  });

  const getSourceIcon = (type) => {
    switch (type) {
      case 'IMAGE': return <Camera className="h-4 w-4 text-orange-400" title="Photo Report" />;
      case 'VOICE': return <Mic className="h-4 w-4 text-amber-400" title="Voice Memo" />;
      case 'PDF': return <FileText className="h-4 w-4 text-cyan-400" title="Scanned Form" />;
      case 'CCTV': return <Video className="h-4 w-4 text-red-400" title="CCTV Camera Detection" />;
      default: return <PenTool className="h-4 w-4 text-slate-400" title="Manual Entry" />;
    }
  };

  const getRiskPill = (level, score) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center space-x-1">
            <Flame className="h-3.5 w-3.5 mr-1" />
            <span>Critical Urgent ({score}/10)</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center space-x-1">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            <span>High Risk ({score}/10)</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            Moderate ({score}/10)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            Minor ({score}/10)
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Friendly Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Quick Filter Segmented Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setQuickFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              quickFilter === 'ALL' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Hazards ({observations.length})
          </button>
          
          <button
            onClick={() => setQuickFilter('ACTION_NEEDED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              quickFilter === 'ACTION_NEEDED' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Action ({observations.filter(o => o.status !== 'RESOLVED').length})
          </button>

          <button
            onClick={() => setQuickFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              quickFilter === 'CRITICAL' ? 'bg-red-500 text-white shadow-sm' : 'text-red-400 hover:text-red-300'
            }`}
          >
            🔴 Urgent Only ({observations.filter(o => o.risk_level === 'CRITICAL' || o.risk_level === 'HIGH').length})
          </button>

          <button
            onClick={() => setQuickFilter('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              quickFilter === 'RESOLVED' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            ✓ Fixed ({observations.filter(o => o.status === 'RESOLVED').length})
          </button>
        </div>

        {/* Search & Dept Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500 placeholder-slate-500"
            />
          </div>

          {/* Department Dropdown */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Observation Cards List */}
      <div className="space-y-3">
        {filteredObservations.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-slate-800 space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No hazards found under this filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Everything in this category is clean or matches no active reports.
            </p>
            <button
              onClick={() => { setQuickFilter('ALL'); setSearch(''); setSelectedDept('ALL'); }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredObservations.map((obs) => (
            <div
              key={obs.id}
              onClick={() => onSelectObservation(obs)}
              className="glass-card p-5 rounded-2xl cursor-pointer hover:border-orange-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getSourceIcon(obs.source_type)}
                  </div>
                  {getRiskPill(obs.risk_level, obs.severity_score)}
                  <span className="text-xs font-semibold text-slate-300 flex items-center">
                    <Building className="h-3 w-3 mr-1 text-slate-500" />
                    {obs.department}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-slate-500" />
                    {obs.location_details}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                  {obs.title}
                </h3>

                {/* Plain description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {obs.description}
                </p>

                {/* AI Recommended Fix Preview */}
                {obs.recommended_capa && (
                  <div className="text-[11px] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg w-fit">
                    <strong className="text-amber-400">Action:</strong> {obs.recommended_capa}
                  </div>
                )}

              </div>

              {/* Right Side Status & Arrow */}
              <div className="flex items-center space-x-3 self-end sm:self-center">
                <div className="text-right">
                  {obs.status === 'RESOLVED' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Fixed & Closed</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Action Assigned</span>
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {new Date(obs.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-orange-500 transition-all">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
