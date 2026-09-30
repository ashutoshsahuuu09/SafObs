import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Maximize2, 
  Layers, 
  Flame, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const CAMERAS = [
  {
    id: "CAM-01",
    name: "Production Line 03 — Assembly Area",
    location: "Zone B - Station 4",
    status: "ONLINE",
    fps: 30,
    latency: "14ms",
    alert: {
      active: true,
      title: "🔴 HIGH-RISK ALERT: Restricted-Zone Entry",
      location: "Overhead Crane Swing Radius",
      detection: "Worker entered designated yellow exclusion zone without spotter.",
      time: "14:32:18",
      risk: "HIGH",
      confidence: "96.4%"
    }
  },
  {
    id: "CAM-02",
    name: "Stamping Press Cell #12",
    location: "Heavy Fabrication Bay",
    status: "ONLINE",
    fps: 30,
    latency: "18ms",
    alert: {
      active: true,
      title: "🟠 PPE ALERT: Missing Safety Vest",
      location: "Main Forklift Aisle",
      detection: "Personnel detected in high-traffic vehicle zone without Class 2 Hi-Vis vest.",
      time: "14:30:05",
      risk: "MEDIUM",
      confidence: "98.1%"
    }
  },
  {
    id: "CAM-03",
    name: "Logistics Dock Bay 03",
    location: "Outdoor Staging Area",
    status: "ONLINE",
    fps: 30,
    latency: "21ms",
    alert: null
  }
];

export default function CCTVPreviewModal({ isOpen, onClose, onConvertToObservation }) {
  const [selectedCam, setSelectedCam] = useState(CAMERAS[0]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState('STREAM');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">SafObs Real-Time CCTV Vision MVP</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Phase 3 Architecture Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">RTSP Stream Ingest • YOLOv8 Edge Inference • Virtual Zone Geometry</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Stream Simulation (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            
            {/* Camera Viewport */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              
              {/* Top Stream Overlay */}
              <div className="flex items-center justify-between z-10 text-xs font-mono">
                <div className="flex items-center space-x-2 bg-black/70 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold">{selectedCam.id}</span>
                  <span className="text-slate-500">|</span>
                  <span>{selectedCam.name}</span>
                </div>

                <div className="flex items-center space-x-2 bg-black/70 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                  <span>{currentTime}</span>
                  <span className="text-emerald-400 font-bold">{selectedCam.fps} FPS</span>
                  <span className="text-cyan-400 font-bold">{selectedCam.latency}</span>
                </div>
              </div>

              {/* Synthetic Visual Representation with Bounding Boxes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                
                {/* Background grid pattern simulating CCTV scene */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Restricted Polygon Zone (Visual) */}
                <div className="absolute right-12 bottom-8 w-64 h-48 border-2 border-dashed border-red-500/80 bg-red-500/10 rounded-xl flex items-start p-2">
                  <span className="text-[10px] font-mono font-bold text-red-400 bg-black/80 px-1.5 py-0.5 rounded border border-red-500/40">
                    RESTRICTED ZONE: CRANE RADIUS #02
                  </span>
                </div>

                {/* Person Bounding Box with Detection Anomaly */}
                <div className="absolute right-24 bottom-14 w-32 h-40 border-2 border-red-500 rounded-lg bg-red-500/10 flex flex-col justify-between p-1.5 animate-pulse-subtle">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-white bg-red-600 px-1 py-0.2 rounded block w-fit">
                      NO HELMET [94.8%]
                    </span>
                    <span className="text-[9px] font-mono font-bold text-white bg-amber-600 px-1 py-0.2 rounded block w-fit">
                      ZONE BREACH
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-white/90 bg-black/80 px-1 rounded">
                    Person_ID: 8421
                  </div>
                </div>

                {/* Compliant Person Bounding Box */}
                <div className="absolute left-20 bottom-12 w-28 h-36 border-2 border-emerald-500 rounded-lg bg-emerald-500/5 flex flex-col justify-between p-1.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-white bg-emerald-600 px-1 py-0.2 rounded block w-fit">
                      HELMET ✓ [98.2%]
                    </span>
                    <span className="text-[9px] font-mono font-bold text-white bg-emerald-600 px-1 py-0.2 rounded block w-fit">
                      VEST ✓ [97.1%]
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-white/90 bg-black/80 px-1 rounded">
                    Person_ID: 8419
                  </div>
                </div>

              </div>

              {/* Bottom Stream Status */}
              <div className="flex items-center justify-between z-10 text-[11px] text-slate-400">
                <div className="bg-black/70 backdrop-blur px-2 py-0.5 rounded border border-slate-800">
                  <span>Engine: <strong>YOLOv8x-Safety + DeepSORT Tracker</strong></span>
                </div>
                <div className="bg-black/70 backdrop-blur px-2 py-0.5 rounded border border-slate-800 text-cyan-300">
                  <span>Vision Edge Worker: <strong>ONLINE</strong></span>
                </div>
              </div>

            </div>

            {/* Camera Select Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {CAMERAS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCam(c)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedCam.id === c.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block truncate">{c.id}: {c.name.split('—')[0]}</span>
                  <span className="text-[10px] text-slate-500">{c.location}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Right Live Alert & Action Panel */}
          <div className="space-y-4">
            
            <div className="glass-panel p-4 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Camera Intelligence
              </span>

              {selectedCam.alert ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                      <Flame className="h-4 w-4" />
                      <span>{selectedCam.alert.title}</span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedCam.alert.detection}
                    </p>

                    <div className="pt-2 border-t border-red-500/20 text-[10px] text-slate-400 grid grid-cols-2 gap-1 font-mono">
                      <span>Time: <strong className="text-slate-200">{selectedCam.alert.time}</strong></span>
                      <span>Confidence: <strong className="text-emerald-400">{selectedCam.alert.confidence}</strong></span>
                      <span>Zone: <strong className="text-slate-200">{selectedCam.alert.location}</strong></span>
                      <span>Risk: <strong className="text-red-400">{selectedCam.alert.risk}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        onConvertToObservation({
                          title: selectedCam.alert.title,
                          description: `Real-time CCTV Detection on ${selectedCam.name}: ${selectedCam.alert.detection}`,
                          department: "Heavy Press & Stamping Bay",
                          hazard_category: "Restricted Zone Breach",
                          risk_level: selectedCam.alert.risk,
                          location_details: selectedCam.alert.location,
                          source_type: "CCTV"
                        });
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-glow-orange transition-all"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span>Convert Alert to Incident & Assign CAPA</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                  <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <span className="font-bold text-slate-200 block">All Safety Rules Nominal</span>
                  <span className="text-[11px] text-slate-500">Zero active PPE violations or zone breaches</span>
                </div>
              )}
            </div>

            {/* Architecture Stack info */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-cyan-400 block text-[11px]">Phase 3 Target Architecture:</span>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li>RTSP H.264 Stream Pipeline</li>
                <li>YOLOv8 Edge Real-time inference</li>
                <li>Virtual Polygon Hazard Boundaries</li>
                <li>Sub-second Automated Escalation</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
