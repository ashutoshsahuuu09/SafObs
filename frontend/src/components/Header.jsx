import React from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Mic, 
  Bot, 
  Video, 
  Building2, 
  HelpCircle
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenObservationModal, 
  onOpenCopilot, 
  onOpenCCTV,
  selectedPlant,
  setSelectedPlant,
  totalObservations = 0,
  openCapasCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-glow-orange flex-shrink-0">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">SafObs</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Easy Safety Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI-Assisted Workplace Safety & Hazard Reporting</p>
            </div>

            {/* Plant Selector */}
            <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-slate-800">
              <Building2 className="h-4 w-4 text-slate-400" />
              <select 
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 px-3 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <option value="Plant 01 - Detroit Automotive Complex">Detroit Complex (Plant 01)</option>
                <option value="Plant 02 - Ohio Battery & Gigacell">Ohio Battery Gigacell (Plant 02)</option>
                <option value="Site 03 - Houston Fabrication Yard">Houston Fabrication Yard (Site 03)</option>
              </select>
            </div>
          </div>

          {/* Simple Main Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('observations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'observations' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <span>📋 Safety Observations</span>
              {totalObservations > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'observations' ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {totalObservations}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('capa')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'capa' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <span>⚡ Action Tasks (CAPA)</span>
              {openCapasCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'capa' ? 'bg-orange-700 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {openCapasCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              📊 Safety Charts & Health
            </button>

            <button
              onClick={onOpenCCTV}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:bg-cyan-500/10 flex items-center space-x-1.5 border border-cyan-500/30 transition-all"
              title="Preview Real-Time Camera Stream AI"
            >
              <Video className="h-3.5 w-3.5 text-cyan-400" />
              <span>Live CCTV Demo</span>
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenCopilot}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-glow-cyan"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI Copilot</span>
            </button>

            <button
              onClick={() => onOpenObservationModal('IMAGE')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-glow-orange active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Report Hazard</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('observations')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'observations' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            📋 Observations
          </button>
          <button
            onClick={() => setActiveTab('capa')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'capa' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            ⚡ Action Tasks
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'analytics' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            📊 Charts
          </button>
          <button
            onClick={onOpenCCTV}
            className="px-2 py-1 text-cyan-400 font-bold"
          >
            📹 CCTV Demo
          </button>
        </div>

      </div>
    </header>
  );
}
