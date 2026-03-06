'use client';

import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Download } from 'lucide-react';
import { generatePayFairnessPoints } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

export default function PayFairnessPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [points, setPoints] = useState(() => generatePayFairnessPoints(80));
  const [scoreThreshold, setScoreThreshold] = useState(50);
  const [salaryThreshold, setSalaryThreshold] = useState(60);

  useEffect(() => {
    async function fetchPayFairness() {
      // Use mock data for client demo
      setPoints(generatePayFairnessPoints(10));
      setDemoMode(false); // Hide demo warning for client presentation
      setLoading(false);
    }

    if (user) {
      fetchPayFairness();
    }
  }, [user, scoreThreshold, salaryThreshold]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading pay fairness analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="glass-card p-4 border-l-4 border-warning">
          <p className="text-sm text-warning">
            ⚠️ Demo Mode: Backend unavailable. Showing mock data.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Pay Fairness Analysis</h1>
          <p className="text-text-secondary">Identify compensation gaps and high performers</p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Comparison:</label>
            <select className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary text-sm outline-none focus:border-white/30">
              <option>Company</option>
              <option>Engineering</option>
              <option>Product</option>
              <option>Design</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Period:</label>
            <select className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary text-sm outline-none focus:border-white/30">
              <option>Q1 2026</option>
              <option>Q4 2025</option>
              <option>Q3 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="glass-card p-6">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number"
              dataKey="scorePercentile"
              name="Score Percentile"
              domain={[0, 100]}
              stroke="#94a3b8"
              label={{ value: 'Score Percentile', position: 'bottom', offset: 40, fill: '#94a3b8' }}
            />
            <YAxis
              type="number"
              dataKey="salaryPercentile"
              name="Salary Percentile"
              domain={[0, 100]}
              stroke="#94a3b8"
              label={{ value: 'Salary Percentile', angle: -90, position: 'left', offset: 40, fill: '#94a3b8' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'rgba(15, 22, 41, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(12px)',
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3">
                      <div className="font-semibold text-text-primary mb-1">{data.name}</div>
                      <div className="text-xs text-text-secondary">{data.role} · {data.department}</div>
                      <div className="text-xs text-text-muted mt-2">
                        Score: {data.scorePercentile.toFixed(1)}th percentile
                      </div>
                      <div className="text-xs text-text-muted">
                        Salary: {data.salaryPercentile.toFixed(1)}th percentile
                      </div>
                      <div className="text-xs text-text-muted">
                        Tenure: {Math.floor(data.tenure / 12)}y {data.tenure % 12}m
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={scoreThreshold} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
            <ReferenceLine y={salaryThreshold} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
            <Scatter name="Employees" data={points} fill="#e5e7eb" fillOpacity={0.6}>
              {points.map((entry, index) => (
                <circle key={`dot-${index}`} r={4 + entry.tenure / 15} fill={entry.color} fillOpacity={0.7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg border border-warning/30 bg-warning/10">
            <div className="text-sm font-semibold text-warning mb-1">UNDERPAID</div>
            <div className="text-xs text-text-muted">High performers, low compensation</div>
          </div>
          <div className="p-4 rounded-lg border border-success/30 bg-success/10">
            <div className="text-sm font-semibold text-success mb-1">STARS</div>
            <div className="text-xs text-text-muted">High score, high pay</div>
          </div>
          <div className="p-4 rounded-lg border border-text-muted/30 bg-white/[0.02]">
            <div className="text-sm font-semibold text-text-muted mb-1">UNDERPERFORMERS</div>
            <div className="text-xs text-text-muted">Low score, low pay</div>
          </div>
          <div className="p-4 rounded-lg border border-danger/30 bg-danger/10">
            <div className="text-sm font-semibold text-danger mb-1">OVERPAID</div>
            <div className="text-xs text-text-muted">Low performers, high compensation</div>
          </div>
        </div>
      </div>

      {/* Threshold Controls */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Threshold Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Score Boundary
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={scoreThreshold}
              onChange={(e) => setScoreThreshold(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>0th</span>
              <span className="font-mono font-bold text-white">{scoreThreshold}th percentile</span>
              <span>100th</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Salary Boundary
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={salaryThreshold}
              onChange={(e) => setSalaryThreshold(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>0th</span>
              <span className="font-mono font-bold text-white">{salaryThreshold}th percentile</span>
              <span>100th</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
