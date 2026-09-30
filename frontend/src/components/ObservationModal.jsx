import React, { useState, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Mic, 
  FileText, 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Upload, 
  Play, 
  Square,
  ArrowRight,
  RefreshCw,
  MapPin,
  Flame,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_EXAMPLES = [
  {
    title: "🚒 Blocked Fire Extinguisher",
    sub: "Logistics Aisle 4",
    type: "IMAGE",
    text: "Type ABC fire extinguisher in Logistics Aisle 4 blocked by 3 stacked wooden pallets. Clearance reduced to 0 inches."
  },
  {
    title: "💧 Hydraulic Oil Puddle",
    sub: "Stamping Press Bay #12",
    type: "IMAGE",
    text: "Press #12 high-pressure hydraulic line dripping oil directly across the main worker walking path. Major slip hazard."
  },
  {
    title: "🪜 Missing Safety Guardrail",
    sub: "Paint Shop 18ft Catwalk",
    type: "PDF",
    text: "Inspection checklist scan: Paint Booth 2 elevated catwalk has a missing 21-inch mid-rail and toe-board at 18-ft height."
  },
  {
    title: "⚡ Exposed 240V Cable",
    sub: "Assembly Line 02 Station 7",
    type: "VOICE",
    text: "Voice memo: Overhead tool suspension cable has split outer insulation exposing copper wires near operator handle."
  }
];

export default function ObservationModal({ isOpen, onClose, initialMode = 'IMAGE', onObservationCreated }) {
  const [activeMode, setActiveMode] = useState(initialMode); // IMAGE, VOICE, PDF, MANUAL
  const [step, setStep] = useState(1); // 1: Input, 2: Analyzing, 3: Review
  
  // Input states
  const [selectedFile, setSelectedFile] = useState(null);
  const [manualText, setManualText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Extracted Result state
  const [extractedData, setExtractedData] = useState({
    unit_name: 'Plant 01 - Detroit Automotive Complex',
    department: 'Fabrication & Welding',
    location_details: 'Zone B - Station 4',
    observer_name: 'Vikram Sharma (Safety Lead)',
    hazard_category: 'Fire & Explosion Safety',
    risk_level: 'HIGH',
    severity_score: 8,
    title: '',
    description: '',
    recommended_capa: '',
    ai_confidence: 0.96,
    osha_reference: ''
  });

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode || 'IMAGE');
      setStep(1);
      setSelectedFile(null);
      setManualText('');
      setIsRecording(false);
      setRecordSeconds(0);
      setVoiceTranscript('');
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    setVoiceTranscript('');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setVoiceTranscript("Audio Note: This is Marcus in Assembly Line 02. The overhead balancer cord is damaged with exposed wires. Requesting urgent electrical maintenance before next shift.");
  };

  const runAnalysis = async (customText = null, modeOverride = null) => {
    setStep(2);
    const mode = modeOverride || activeMode;
    
    try {
      let result;
      if (mode === 'IMAGE') {
        if (selectedFile) {
          result = await api.analyzeImage(selectedFile, "Vikram Sharma (Safety Lead)");
        } else {
          result = await api.analyzeText(customText || manualText || "Blocked fire extinguisher and wooden pallets in Aisle 4", "Vikram Sharma (Safety Lead)");
        }
      } else if (mode === 'VOICE') {
        result = await api.analyzeVoice(null, voiceTranscript || customText || "Damaged wire cable in assembly line", "Marcus Vance (Shift Supervisor)");
      } else if (mode === 'PDF') {
        if (selectedFile) {
          result = await api.analyzeDocument(selectedFile, "Rajesh Patel (Safety Officer)");
        } else {
          result = await api.analyzeText(customText || "Scaffolding checklist: Missing guardrail and toe board at 18ft catwalk", "Rajesh Patel (Safety Officer)");
        }
      } else {
        result = await api.analyzeText(customText || manualText || "General floor hazard detected", "Vikram Sharma (Safety Lead)");
      }

      setExtractedData(result);
      setStep(3);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setStep(3);
    }
  };

  const handleApplyExample = (ex) => {
    if (ex.type === 'VOICE') {
      setVoiceTranscript(ex.text);
    } else {
      setManualText(ex.text);
    }
    runAnalysis(ex.text, ex.type);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        unit_name: extractedData.unit_name,
        department: extractedData.department,
        location_details: extractedData.location_details,
        observer_name: extractedData.observer_name,
        source_type: activeMode,
        hazard_category: extractedData.hazard_category,
        risk_level: extractedData.risk_level,
        severity_score: Number(extractedData.severity_score) || 5,
        title: extractedData.title,
        description: extractedData.description,
        recommended_capa: extractedData.recommended_capa,
        ai_confidence: extractedData.ai_confidence || 0.95,
        original_transcript_or_text: voiceTranscript || manualText || null
      };

      await api.createObservation(payload);
      setIsSaving(false);
      onObservationCreated();
      onClose();
    } catch (err) {
      console.error("Save observation failed:", err);
      setIsSaving(false);
      alert("Could not save observation. Ensure backend is running.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header with 3-Step Wizard Indicator */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Report a Safety Hazard</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 3: {step === 1 ? "Provide Hazard Info" : step === 2 ? "AI is Organizing Details..." : "Review & Assign Fix"}</p>
            </div>
          </div>

          {/* Simple Step Dots */}
          <div className="flex items-center space-x-2">
            <span className={`h-2.5 w-2.5 rounded-full ${step >= 1 ? 'bg-orange-500 ring-2 ring-orange-500/30' : 'bg-slate-700'}`} />
            <span className={`h-1.5 w-6 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-slate-800'}`} />
            <span className={`h-2.5 w-2.5 rounded-full ${step >= 3 ? 'bg-orange-500 ring-2 ring-orange-500/30' : 'bg-slate-700'}`} />
            <button 
              onClick={onClose}
              className="ml-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: INPUT SELECTION */}
          {step === 1 && (
            <div className="space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Choose how to report:
                </label>

                {/* 4 Big User-Friendly Option Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  <button
                    type="button"
                    onClick={() => setActiveMode('IMAGE')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      activeMode === 'IMAGE'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-glow-orange'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                      <Camera className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-white">Photo / Picture</span>
                    <span className="text-[10px] text-slate-400">AI spots the hazard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('VOICE')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      activeMode === 'VOICE'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Mic className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-white">Voice Note</span>
                    <span className="text-[10px] text-slate-400">Speak naturally</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('PDF')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      activeMode === 'PDF'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-white">Paper Checklist</span>
                    <span className="text-[10px] text-slate-400">Scan PDF or Form</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('MANUAL')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      activeMode === 'MANUAL'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <PenTool className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-white">Quick Text</span>
                    <span className="text-[10px] text-slate-400">Type what you saw</span>
                  </button>

                </div>
              </div>

              {/* Input Interactive Box */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5">
                
                {activeMode === 'IMAGE' && (
                  <div className="text-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="photo-input"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSelectedFile(e.target.files[0]);
                          setManualText(`Selected file: ${e.target.files[0].name}`);
                        }
                      }}
                    />
                    <label htmlFor="photo-input" className="cursor-pointer block py-4">
                      <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-400 mx-auto mb-2">
                        <Upload className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {selectedFile ? selectedFile.name : "Click here to upload a photo or screenshot"}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Works with smartphone camera photos, PNG, or JPG
                      </span>
                    </label>
                  </div>
                )}

                {activeMode === 'VOICE' && (
                  <div className="text-center py-2 space-y-3">
                    <div className="flex justify-center">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
                        isRecording ? 'bg-red-500/20 border-2 border-red-500 animate-pulse' : 'bg-amber-500/10 border border-amber-500/30'
                      }`}>
                        <Mic className={`h-7 w-7 ${isRecording ? 'text-red-400' : 'text-amber-400'}`} />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isRecording ? `Listening... (00:0${recordSeconds})` : "Click below and speak your observation"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Example: "I saw an oil leak under Press 12 in the Stamping bay."
                      </span>
                    </div>

                    <div className="flex justify-center pt-2">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={handleStartRecording}
                          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center space-x-2"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          <span>Start Speaking</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStopRecording}
                          className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs flex items-center space-x-2 animate-pulse"
                        >
                          <Square className="h-4 w-4 fill-current" />
                          <span>Done Speaking</span>
                        </button>
                      )}
                    </div>

                    {voiceTranscript && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs text-slate-300">
                        <strong className="text-amber-400 block mb-0.5">Transcribed Note:</strong>
                        {voiceTranscript}
                      </div>
                    )}
                  </div>
                )}

                {activeMode === 'PDF' && (
                  <div className="text-center py-4">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      id="pdf-input"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSelectedFile(e.target.files[0]);
                          setManualText(`Scanned Doc: ${e.target.files[0].name}`);
                        }
                      }}
                    />
                    <label htmlFor="pdf-input" className="cursor-pointer block">
                      <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {selectedFile ? selectedFile.name : "Click to select scanned checklist or audit PDF"}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        AI will automatically read handwritten & marked safety items
                      </span>
                    </label>
                  </div>
                )}

                {activeMode === 'MANUAL' && (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Type your observation in plain words:
                    </label>
                    <textarea
                      rows={3}
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="E.g. Pallets blocking fire exit in Logistics Aisle 3. Need them moved..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 placeholder-slate-600"
                    />
                  </div>
                )}

              </div>

              {/* Quick 1-Click Test Scenarios */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  💡 Or click a common scenario to try instantly:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_EXAMPLES.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyExample(ex)}
                      className="p-3 text-left rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 transition-all text-xs flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-slate-200 group-hover:text-orange-400 block">{ex.title}</span>
                        <span className="text-[11px] text-slate-500">{ex.sub}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => runAnalysis()}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center space-x-2 shadow-glow-orange"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Let AI Organize This</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: ANALYZING SPINNER */}
          {step === 2 && (
            <div className="py-14 text-center space-y-4">
              <div className="inline-block p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                <RefreshCw className="h-8 w-8 text-orange-400 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">SafObs AI is Reviewing Hazard Details</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Automatically detecting department, classifying severity level, checking OSHA standards, and drafting corrective action...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & ASSIGN */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Ready Banner */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>AI has auto-filled your safety report! Review and confirm:</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  96% Confidence
                </span>
              </div>

              {/* Clean Summary Card */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
                
                {/* Hazard Title & Severity */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    What is the hazard?
                  </label>
                  <input
                    type="text"
                    value={extractedData.title}
                    onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-orange-500"
                  />
                </div>

                {/* Where & Risk Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={extractedData.department}
                      onChange={(e) => setExtractedData({ ...extractedData, department: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Exact Location
                    </label>
                    <input
                      type="text"
                      value={extractedData.location_details}
                      onChange={(e) => setExtractedData({ ...extractedData, location_details: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Urgency / Risk Level
                    </label>
                    <select
                      value={extractedData.risk_level}
                      onChange={(e) => setExtractedData({ ...extractedData, risk_level: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-orange-400"
                    >
                      <option value="CRITICAL">🔴 Critical (Fix Right Away)</option>
                      <option value="HIGH">🟠 High Risk (Within 24h)</option>
                      <option value="MEDIUM">🟡 Moderate (Within 3 Days)</option>
                      <option value="LOW">🔵 Low / Routine</option>
                    </select>
                  </div>
                </div>

                {/* AI Recommended Fix (CAPA) */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1 flex items-center space-x-1.5">
                    <Wrench className="h-3.5 w-3.5 text-amber-400" />
                    <span>Recommended Action to Fix (CAPA):</span>
                  </label>
                  <textarea
                    rows={2}
                    value={extractedData.recommended_capa}
                    onChange={(e) => setExtractedData({ ...extractedData, recommended_capa: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:border-amber-500"
                  />
                </div>

              </div>

              {/* Step 3 Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ← Change Input
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isSaving ? "Saving..." : "Save Hazard & Auto-Assign Fix"}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
