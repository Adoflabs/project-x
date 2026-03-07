'use client';

import { Mail, Shield, Building2, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '@/stores';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const initials = user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Profile</h1>
        <p className="text-text-secondary">View your account and workspace details.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-text-primary">{user?.email || 'Unknown user'}</h2>
            <p className="text-sm text-text-muted capitalize">{user?.role || 'member'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Account</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-text-primary">
              <Mail className="w-4 h-4 text-text-muted" />
              <span>{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-primary">
              <Shield className="w-4 h-4 text-text-muted" />
              <span className="capitalize">Role: {user?.role || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-primary">
              <Building2 className="w-4 h-4 text-text-muted" />
              <span>Company ID: {user?.companyId || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Status</h3>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-text-primary">
            <BadgeCheck className="w-4 h-4" />
            Active session
          </div>
          <p className="text-sm text-text-muted">
            Your profile is managed by your organization admin. Contact support for account updates.
          </p>
        </div>
      </div>
    </div>
  );
}
