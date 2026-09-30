import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import ObservationFeed from './components/ObservationFeed';
import ObservationModal from './components/ObservationModal';
import ObservationDetailModal from './components/ObservationDetailModal';
import CapaBoard from './components/CapaBoard';
import AnalyticsView from './components/AnalyticsView';
import CopilotDrawer from './components/CopilotDrawer';
import CCTVPreviewModal from './components/CCTVPreviewModal';
import { api } from './services/api';
import { Sparkles, Shield, Camera, Wrench, CheckCircle2, ArrowRight, X, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('observations'); // observations, capa, analytics
  const [selectedPlant, setSelectedPlant] = useState('Plant 01 - Detroit Automotive Complex');
  const [showGuide, setShowGuide] = useState(true);
  
  // Data state
  const [observations, setObservations] = useState([]);
  const [capas, setCapas] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [obsModalMode, setObsModalMode] = useState('IMAGE');
  const [selectedObsDetail, setSelectedObsDetail] = useState(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCCTVOpen, setIsCCTVOpen] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [obsData, capaData, analyticsData] = await Promise.all([
        api.getObservations(),
        api.getCapas(),
        api.getAnalytics()
      ]);
      setObservations(obsData);
      setCapas(capaData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.warn("Backend connection fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedPlant]);

  const handleOpenObservationModal = (mode = 'IMAGE') => {
    setObsModalMode(mode);
    setIsObsModalOpen(true);
  };

  const handleCCTVAlertToObservation = (alertPayload) => {
    setObsModalMode('IMAGE');
    setIsObsModalOpen(true);
  };

  const openCapasCount = capas.filter(c => c.status !== 'CLOSED').length;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenObservationModal={handleOpenObservationModal}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenCCTV={() => setIsCCTVOpen(true)}
        selectedPlant={selectedPlant}
        setSelectedPlant={setSelectedPlant}
        totalObservations={observations.length}
        openCapasCount={openCapasCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Simple 3-Step "How It Works" Banner */}
        {showGuide && (
          <div className="relative p-5 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-slate-900 border border-orange-500/30 overflow-hidden">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Dismiss Guide"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold text-orange-400 uppercase tracking-wider block mb-1">
                  💡 How SafObs Works in 3 Simple Steps
                </span>
                <h3 className="text-sm font-bold text-white">
                  Zero-Friction Hazard Reporting & Fast Plant Resolution
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 font-extrabold text-xs">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Report</span>
                    <span className="text-[11px] text-slate-400">Photo, voice, or text</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-xs">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">AI Auto-Fills</span>
                    <span className="text-[11px] text-slate-400">Dept, risk & suggested fix</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Verify & Fix</span>
                    <span className="text-[11px] text-slate-400">Assign task & close</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards KPI Banner */}
        <MetricCards analytics={analytics} />

        {/* Dynamic View Sections */}
        {isLoading && observations.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-2xl space-y-3">
            <RefreshCw className="h-8 w-8 text-orange-400 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">Connecting to SafObs Safety Hub...</h3>
            <p className="text-xs text-slate-500">Loading plant hazard feed</p>
          </div>
        ) : (
          <>
            {activeTab === 'observations' && (
              <ObservationFeed
                observations={observations}
                onSelectObservation={(obs) => setSelectedObsDetail(obs)}
                onOpenNewModal={handleOpenObservationModal}
              />
            )}

            {activeTab === 'capa' && (
              <CapaBoard
                capas={capas}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView analytics={analytics} />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-300">SafObs™</span>
            <span>— Simple AI Industrial Workplace Safety</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>OSHA 1910 Ready</span>
            <span>•</span>
            <span>ISO 45001 Standard</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">Phase 1 MVP</span>
          </div>
        </div>
      </footer>

      {/* Observation Ingest Wizard Modal */}
      <ObservationModal
        isOpen={isObsModalOpen}
        onClose={() => setIsObsModalOpen(false)}
        initialMode={obsModalMode}
        onObservationCreated={fetchAllData}
      />

      {/* Observation Detail Modal */}
      <ObservationDetailModal
        observation={selectedObsDetail}
        isOpen={!!selectedObsDetail}
        onClose={() => setSelectedObsDetail(null)}
        onRefresh={fetchAllData}
      />

      {/* AI Safety Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Real-time CCTV Stream Preview Modal (Phase 3) */}
      <CCTVPreviewModal
        isOpen={isCCTVOpen}
        onClose={() => setIsCCTVOpen(false)}
        onConvertToObservation={handleCCTVAlertToObservation}
      />

    </div>
  );
}
