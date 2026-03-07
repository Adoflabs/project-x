'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, Calendar, ChevronDown, LogOut, User } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/stores';
import { api } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const { setSidebarMobileOpen, sidebarExpanded } = useUIStore();
  const { user, logout } = useAuthStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleLogout = () => {
    api.clearToken();
    logout();
    router.push('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 border-b border-white/[0.1] backdrop-blur-xl"
      style={{ 
        background: 'rgba(10, 14, 26, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Hamburger + Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.04] text-text-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Dashboard</span>
            <span className="text-text-muted">/</span>
            <span className="text-text-primary">Overview</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search employees, scores..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 bg-white/[0.05] text-text-primary placeholder:text-text-muted outline-none ${
                searchFocused
                  ? 'border-accent-blue/40 shadow-[0_0_0_2px_rgba(59,130,246,0.4)]'
                  : 'border-white/[0.1] hover:border-white/[0.15]'
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right: Date + Notifications + Avatar */}
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>{today}</span>
          </div>

          {/* Notifications */}
          <button 
            onClick={() => router.push('/notifications')}
            className="relative p-2 rounded-lg hover:bg-white/[0.04] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* Avatar + Dropdown */}
          <div className="relative z-50">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm font-bold text-white">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-50 shadow-2xl">
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-2">
                    <div className="text-sm font-medium text-text-primary">{user?.email}</div>
                    <div className="text-xs text-text-muted mt-1 capitalize">{user?.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] text-text-secondary text-sm transition-colors cursor-pointer text-left"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] text-danger text-sm transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
