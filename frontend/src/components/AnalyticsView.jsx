import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Activity, 
  AlertOctagon, 
  Download 
} from 'lucide-react';

const HAZARD_COLORS = [
  '#FF6B00', // Orange
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#8B5CF6'  // Purple
];

export default function AnalyticsView({ analytics }) {
  const data = analytics || {
    hazard_breakdown: [
      { hazard: "Fire & Explosion Safety", count: 4 },
      { hazard: "Chemical & Hazardous Material", count: 3 },
      { hazard: "Working at Height", count: 3 },
      { hazard: "Electrical & LOTO", count: 2 },
      { hazard: "PPE Non-Compliance", count: 2 }
    ],
    department_risk_matrix: [
      { department: "Heavy Press & Stamping Bay", total: 4, critical: 2, high: 1, open: 3, avg_severity: 8.5 },
      { department: "Fabrication & Welding", total: 3, critical: 1, high: 2, open: 2, avg_severity: 7.8 },
      { department: "Paint Shop & Finishing", total: 3, critical: 1, high: 1, open: 2, avg_severity: 7.0 },
      { department: "Logistics & Staging Dock", total: 2, critical: 0, high: 1, open: 1, avg_severity: 5.5 }
    ],
    recent_trend: [
      { date: "Sep 24", observations: 2, resolved: 1 },
      { date: "Sep 25", observations: 4, resolved: 3 },
      { date: "Sep 26", observations: 3, resolved: 2 },
      { date: "Sep 27", observations: 5, resolved: 4 },
      { date: "Sep 28", observations: 6, resolved: 5 },
      { date: "Sep 29", observations: 4, resolved: 4 },
      { date: "Sep 30", observations: 7, resolved: 6 }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Plant Safety Intelligence & Compliance Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">Leading indicators, hazard distributions, and department risk matrices</p>
        </div>

        <button
          onClick={() => alert("Downloading PDF Executive EHS Compliance Brief...")}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Export EHS Report</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hazard Pareto Breakdown Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Hazard Category Distribution
              </h3>
              <p className="text-[11px] text-slate-500">Top recurring violation types</p>
            </div>
            <span className="text-xs font-mono font-bold text-orange-400">Pareto Analysis</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hazard_breakdown} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="hazard" type="category" stroke="#94a3b8" fontSize={10} width={130} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {data.hazard_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={HAZARD_COLORS[index % HAZARD_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Trend Area Chart */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                7-Day Inflow vs Remediation
              </h3>
              <p className="text-[11px] text-slate-500">Observation logged rate vs closed CAPAs</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> MTTR 18.4h
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.recent_trend} margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="obsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="resGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="observations" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#obsGradient)" name="Logged" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#resGradient)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Department Risk Matrix Table */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Department Risk Matrix & Hazard Heatmap
            </h3>
            <p className="text-[11px] text-slate-500">Cross-department risk concentration index</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Units: 4</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Department / Unit</th>
                <th className="py-3 px-3">Total Observations</th>
                <th className="py-3 px-3">Critical Hazards</th>
                <th className="py-3 px-3">High Hazards</th>
                <th className="py-3 px-3">Open CAPAs</th>
                <th className="py-3 px-3">Avg Severity Index</th>
                <th className="py-3 px-3">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.department_risk_matrix.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{dept.department}</td>
                  <td className="py-3.5 px-3 font-mono">{dept.total}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold font-mono">
                      {dept.critical}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">
                      {dept.high}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">{dept.open}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-orange-400">{dept.avg_severity} / 10</td>
                  <td className="py-3.5 px-3">
                    {dept.critical > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        HIGH ATTENTION
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        NOMINAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
