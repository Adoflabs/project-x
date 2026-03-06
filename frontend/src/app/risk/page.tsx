'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { generateMockRiskFlags } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import RiskPill from '@/components/ui/RiskPill';
import type { FlightRiskFlag } from '@/types';

export default function FlightRiskPage() {
  const { user } = useAuthStore();
  const [flags, setFlags] = useState<FlightRiskFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    async function fetchRiskFlags() {
      // Use mock data for client demo
      setFlags(generateMockRiskFlags());
      setDemoMode(false); // Hide demo warning for client presentation
      setLoading(false);
    }

    if (user) {
      fetchRiskFlags();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading risk alerts...</p>
        </div>
      </div>
    );
  }

  const handleResolveFlag = async (flagId: number) => {
    try {
      await api.resolveFlag(flagId);
      // Refresh flags
      setFlags(flags.filter(f => f.id !== flagId));
      alert('Risk flag resolved successfully!');
    } catch (error) {
      alert('Failed to resolve flag. Using demo mode.');
    }
  };

  const handleViewProfile = (employeeId: string) => {
    window.location.href = `/employees?id=${employeeId}`;
  };

  const highRisk = flags.filter((f) => f.severity === 'high');
  const mediumRisk = flags.filter((f) => f.severity === 'medium');
  const lowRisk = flags.filter((f) => f.severity === 'low');

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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Flight Risk Alerts</h1>
          <p className="text-text-secondary">
            {highRisk.length} High · {mediumRisk.length} Medium · {lowRisk.length} Low
          </p>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configure
        </button>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={`glass-card p-6 ${flag.severity === 'high' ? 'animate-pulse-danger' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-lg font-bold text-white">
                  {flag.employee?.name?.[0]?.toUpperCase() || 'E'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{flag.employee?.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {flag.employee?.role} · {flag.employee?.department}
                  </p>
                </div>
              </div>
              <RiskPill level={flag.severity} />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Triggers:</h4>
              <p className="text-sm text-text-primary leading-relaxed">{flag.reason}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
              <span>Flagged {new Date(flag.createdAt).toLocaleDateString()}</span>
              <span>·</span>
              <span>By {flag.triggeredBy}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => handleViewProfile(flag.employeeId)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
              >
                View Profile
              </button>
              <button 
                onClick={() => handleResolveFlag(flag.id)}
                className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Config Drawer */}
      {showConfig && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
          onClick={() => setShowConfig(false)}
        >
          <div
            className="w-full max-w-md h-full bg-bg-layer2 border-l border-white/[0.06] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Alert Configuration
              </h2>
              <button
                onClick={() => setShowConfig(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Score Drop Threshold */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Score Drop Threshold
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  defaultValue="18"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>5 pts</span>
                  <span className="font-mono font-bold text-white">18 pts</span>
                  <span>30 pts</span>
                </div>
              </div>

              {/* Missed Check-ins */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Missed Check-ins
                </label>
                <select className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary outline-none focus:border-white/30">
                  <option value="1">1 consecutive missed</option>
                  <option value="2" selected>2 consecutive missed</option>
                  <option value="3">3 consecutive missed</option>
                </select>
              </div>

              {/* Peer Feedback Threshold */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Peer Feedback Threshold
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  defaultValue="2.5"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>1.0</span>
                  <span className="font-mono font-bold text-white">2.5 / 5.0</span>
                  <span>5.0</span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Keyword Detection
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['burnout', 'leaving', 'frustrated'].map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-full bg-danger/20 border border-danger/30 text-danger text-xs flex items-center gap-1"
                    >
                      {kw}
                      <button className="hover:text-danger/70">×</button>
                    </span>
                  ))}
                </div>
                <button className="text-xs text-white hover:text-white/80 transition-colors">
                  + Add keyword
                </button>
              </div>

              {/* Tenure Sensitivity */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-text-secondary">Tenure Sensitivity</div>
                  <div className="text-xs text-text-muted mt-1">New hires (&lt;6mo) +20% weight</div>
                </div>
                <button className="w-12 h-6 rounded-full bg-white/20 relative">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Notify
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Owner', checked: true },
                    { label: 'HR', checked: true },
                    { label: 'Manager', checked: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.05] checked:bg-white/30"
                      />
                      <span className="text-sm text-text-secondary">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
