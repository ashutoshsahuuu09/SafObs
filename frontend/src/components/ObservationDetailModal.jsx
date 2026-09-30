import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Building, 
  MapPin, 
  User, 
  Sparkles, 
  Wrench, 
  Calendar, 
  Clock, 
  Flame,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

export default function ObservationDetailModal({ observation, isOpen, onClose, onRefresh }) {
  if (!isOpen || !observation) return null;

  const [isUpdating, setIsUpdating] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const handleResolve = async () => {
    setIsUpdating(true);
    try {
      await api.updateObservation(observation.id, { status: 'RESOLVED' });
      if (observation.corrective_actions?.length > 0) {
        for (const capa of observation.corrective_actions) {
          await api.updateCapa(capa.id, { 
            status: 'CLOSED', 
            resolution_notes: resolutionNote || 'Hazard fixed and verified on site.' 
          });
        }
      }
      setIsUpdating(false);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to resolve:", err);
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {observation.status === 'RESOLVED' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Fixed & Closed</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Action In Progress</span>
              </span>
            )}

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              observation.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              observation.risk_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {observation.risk_level} Risk (Score {observation.severity_score}/10)
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Title */}
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
              {observation.hazard_category}
            </span>
            <h2 className="text-lg font-bold text-white leading-snug">
              {observation.title}
            </h2>
          </div>

          {/* Location & Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Department</span>
              <span className="font-semibold text-slate-200 flex items-center">
                <Building className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {observation.department}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Exact Location</span>
              <span className="font-semibold text-slate-200 flex items-center truncate">
                <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {observation.location_details}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Reported By</span>
              <span className="font-semibold text-slate-200 flex items-center">
                <User className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {observation.observer_name}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hazard Details
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-950 text-xs text-slate-300 leading-relaxed border border-slate-800">
              {observation.description}
            </div>
          </div>

          {/* Corrective Action */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Wrench className="h-4 w-4" />
              <span>Required Fix / Action (CAPA):</span>
            </div>
            <p className="text-xs font-semibold text-slate-200 leading-relaxed">
              {observation.recommended_capa || "Clear site hazards and inspect safety boundary."}
            </p>
            {observation.corrective_actions?.length > 0 && (
              <div className="pt-2 border-t border-amber-500/20 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Assigned to: <strong className="text-slate-200">{observation.corrective_actions[0].assigned_to}</strong></span>
                <span>Priority: <strong className="text-amber-300">{observation.corrective_actions[0].priority}</strong></span>
              </div>
            )}
          </div>

          {/* Action Note if Open */}
          {observation.status !== 'RESOLVED' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Add note before closing (Optional):
              </label>
              <input
                type="text"
                placeholder="E.g. Pallets moved to designated rack; area cleaned."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Close Window
            </button>

            {observation.status !== 'RESOLVED' ? (
              <button
                onClick={handleResolve}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isUpdating ? "Marking Fixed..." : "Mark Hazard Fixed & Complete"}</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Resolved & Documented</span>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
