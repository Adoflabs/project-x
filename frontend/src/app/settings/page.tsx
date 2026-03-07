'use client';

import { useState } from 'react';
import { Bell, Moon, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [strictSession, setStrictSession] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setSaving(false);
    alert('Settings saved successfully.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-text-secondary">Personalize notifications and security preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>

        <div className="flex items-center justify-between gap-3 border border-white/[0.08] rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Email Alerts
            </div>
            <p className="text-xs text-text-muted mt-1">Receive immediate alerts for high-risk employee changes.</p>
          </div>
          <button
            onClick={() => setEmailAlerts((v) => !v)}
            className={`w-12 h-7 rounded-full relative transition-colors ${emailAlerts ? 'bg-white/30' : 'bg-white/10'}`}
            aria-label="Toggle email alerts"
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 border border-white/[0.08] rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Weekly Digest
            </div>
            <p className="text-xs text-text-muted mt-1">Get a Monday summary of score and risk trends.</p>
          </div>
          <button
            onClick={() => setWeeklyDigest((v) => !v)}
            className={`w-12 h-7 rounded-full relative transition-colors ${weeklyDigest ? 'bg-white/30' : 'bg-white/10'}`}
            aria-label="Toggle weekly digest"
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${weeklyDigest ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Security</h2>

        <div className="flex items-center justify-between gap-3 border border-white/[0.08] rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Strict Session Mode
            </div>
            <p className="text-xs text-text-muted mt-1">Require re-authentication after 30 minutes of inactivity.</p>
          </div>
          <button
            onClick={() => setStrictSession((v) => !v)}
            className={`w-12 h-7 rounded-full relative transition-colors ${strictSession ? 'bg-white/30' : 'bg-white/10'}`}
            aria-label="Toggle strict session mode"
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${strictSession ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
