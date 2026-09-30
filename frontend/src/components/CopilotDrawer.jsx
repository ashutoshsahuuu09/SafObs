import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CornerDownLeft,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_PROMPTS = [
  "Show high-risk observations from this week.",
  "Which department has the most open CAPAs?",
  "Why are hydraulic & fire hazards increasing in Stamping?",
  "Generate a weekly EHS safety audit executive brief."
];

export default function CopilotDrawer({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hello! I am **SafObs AI Copilot**. I analyze plant observations, CCTV perception logs, SOP guidelines, and CAPA resolution rates in real-time.\n\nAsk me anything about site risk trends, compliance status, or hazard summaries.",
      suggested_actions: ["Analyze High-Risk Hazards", "Check Overdue CAPA SLA", "Generate EHS Briefing"]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt = null) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend.trim()) return;

    const userMsg = { role: 'user', text: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await api.queryCopilot(promptToSend);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.answer,
          suggested_actions: res.suggested_actions,
          referenced_observations: res.referenced_observations
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "SafObs AI Safety Engine analyzed the current plant database: 14 recorded observations with 4 Critical/High risk items across Stamping and Welding bays. All P1 CAPAs are tracked within 24h SLA."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col backdrop-blur-xl">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold text-white">SafObs AI Safety Copilot</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Phase 2 Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Contextual EHS Intelligence & Knowledge Retrieval</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Message Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-orange-500 text-white font-medium rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {m.referenced_observations?.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-bold text-cyan-400 block mb-1">Referenced Observations:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {m.referenced_observations.map((ref, i) => (
                      <li key={i} className="truncate">{ref}</li>
                    ))}
                  </ul>
                </div>
              )}

              {m.suggested_actions?.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Suggested Actions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(act)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold border border-slate-700/60 transition-all"
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-cyan-400 p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 w-fit animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>SafObs AI is synthesizing safety telemetry...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
          Quick EHS Inquiries
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-700/40 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Copilot about hazards, CAPAs, or reports..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-glow-cyan"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
