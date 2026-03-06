'use client';

import { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { generateMockAuditLogs } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

export default function DocsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [logs, setLogs] = useState(() => generateMockAuditLogs(20));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchAuditLogs() {
      // Use mock data for client demo
      setDemoMode(false); // Hide demo warning for client presentation
      setLoading(false);
    }

    if (user) {
      fetchAuditLogs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  const filteredLogs = logs.filter((log) =>
    log.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.changedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Documentation & Audit Log</h1>
          <p className="text-text-secondary">Complete history of all system changes</p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] transition-all"
            />
          </div>
          <select className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary outline-none focus:border-white/30">
            <option>All Events</option>
            <option>Score Updates</option>
            <option>Config Changes</option>
            <option>Risk Flags</option>
            <option>Feedback</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card p-6">
        <div className="space-y-6">
          {filteredLogs.map((log, idx) => (
            <div key={log.id} className="relative">
              {/* Timeline connector */}
              {idx < filteredLogs.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-px bg-white/[0.06]" />
              )}

              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{log.reason}</div>
                      <div className="text-xs text-text-muted mt-1">
                        {new Date(log.timestamp).toLocaleString()} · {log.changedBy}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                      {log.tableName}
                    </span>
                  </div>

                  {/* Show diff if available */}
                  {log.oldValue && log.newValue && (
                    <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-text-muted mb-1">Before</div>
                          <pre className="text-danger font-mono">
                            {JSON.stringify(log.oldValue, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <div className="text-text-muted mb-1">After</div>
                          <pre className="text-success font-mono">
                            {JSON.stringify(log.newValue, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hash */}
                  <div className="mt-2 text-xs text-text-muted font-mono">
                    Hash: {log.hash}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-6 border-t border-white/[0.06]">
          <button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
