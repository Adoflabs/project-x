'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, ClipboardList, MessageSquare } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ScoreTrendChart from '@/components/dashboard/ScoreTrendChart';
import ScoreDistributionChart from '@/components/dashboard/ScoreDistributionChart';
import { api } from '@/lib/api';
import { generateMockDashboard } from '@/lib/mock-data';
import { useAuthStore } from '@/stores';
import type { DashboardData } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      // Use mock data for client demo
      setDashboard(generateMockDashboard());
      setLoading(false);
      setUseMockData(false); // Hide demo warning for client presentation
    }

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-danger mb-4">Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Data Warning */}
      {useMockData && (
        <div className="glass-card p-4 bg-warning/10 border-warning/20">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-warning mb-1">Demo Mode</div>
              <div className="text-xs text-text-secondary">
                {error || 'Using mock data for demonstration. Connect to backend API for real data.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => window.location.href = '/employees'} className="cursor-pointer">
          <KPICard
            title="Total Score Average"
            value={dashboard.averageScore}
            trend={4.6}
            icon={TrendingUp}
            progress={dashboard.averageScore}
            delay={0}
          />
        </div>
        <div onClick={() => window.location.href = '/risk'} className="cursor-pointer">
          <KPICard
            title="Employees at Risk"
            value={dashboard.employeesAtRisk}
            trend={-2}
            trendLabel="from last week"
            icon={Users}
            delay={100}
          />
        </div>
        <div onClick={() => window.location.href = '/forms'} className="cursor-pointer">
          <KPICard
            title="Pending Ratings"
            value={dashboard.pendingRatings}
            icon={ClipboardList}
            delay={200}
          />
        </div>
        <div onClick={() => window.location.href = '/feedback'} className="cursor-pointer">
          <KPICard
            title="Feedback Due"
            value={dashboard.feedbackDue}
            icon={MessageSquare}
            delay={300}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreTrendChart data={dashboard.scoreTrends || []} />
        </div>
        <div>
          <ScoreDistributionChart data={dashboard.scoreDistribution || []} />
        </div>
      </div>

      {/* Activity & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6 animate-fade-slide-up stagger-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {dashboard.recentActivity?.slice(0, 5).map((log) => (
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="w-2 h-2 rounded-full bg-white/30 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-secondary">{log.reason}</div>
                  <div className="text-xs text-text-muted mt-1">
                    {log.changedBy} · {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )) || <p className="text-sm text-text-muted">No recent activity</p>}
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass-card p-6 animate-fade-slide-up stagger-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            Top Performers
          </h3>
          <div className="space-y-3">
            {dashboard.topPerformers?.map((performer, idx) => (
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{performer.name}</div>
                    <div className="text-xs text-text-muted">{performer.department}</div>
                  </div>
                </div>
                <div className="text-lg font-mono font-bold text-success">{performer.score}</div>
              </div>
            )) || <p className="text-sm text-text-muted">No top performers</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
