'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores';
import {
  LayoutDashboard, Users, AlertTriangle, DollarSign,
  ClipboardList, MessageSquare, FileText, Bell, User, HelpCircle,
  ChevronLeft, ChevronRight, Settings,
} from 'lucide-react';

const mainNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'employees', label: 'Employees', icon: Users, href: '/employees' },
  { id: 'risk', label: 'Flight Risk', icon: AlertTriangle, href: '/risk' },
  { id: 'pay', label: 'Pay Fairness', icon: DollarSign, href: '/pay-fairness' },
  { id: 'forms', label: 'Forms', icon: ClipboardList, href: '/forms' },
  { id: 'feedback', label: 'Peer Feedback', icon: MessageSquare, href: '/feedback' },
  { id: 'docs', label: 'Documentation', icon: FileText, href: '/docs' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications', badge: 3 },
];

const bottomNav = [
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'support', label: 'Support', icon: HelpCircle, href: '/support' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarExpanded, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 border-r border-white/[0.1] transition-all duration-300 ease-in-out backdrop-blur-xl"
        style={{
          width: sidebarExpanded ? 240 : 64,
          background: 'rgba(13, 17, 32, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-5 h-5" fill="currentColor">
              <text x="50" y="75" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#0a0e1a">V</text>
            </svg>
          </div>
          {sidebarExpanded && (
            <span className="font-display text-lg font-bold tracking-tight text-text-primary whitespace-nowrap">
              Veridion
            </span>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 px-2">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group
                      ${isActive
                        ? 'nav-active text-text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                      }
                    `}
                    title={!sidebarExpanded ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'nav-icon' : ''}`} />
                    {sidebarExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-danger text-white text-xs font-bold px-1.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-white/[0.06]" />

        {/* Bottom nav */}
        <div className="py-4 px-2 space-y-1">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${isActive
                    ? 'nav-active text-text-primary'
                    : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarExpanded && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="mx-2 mb-4 p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-text-secondary transition-colors flex items-center justify-center"
        >
          {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.1] backdrop-blur-xl" style={{ 
        background: 'rgba(13, 17, 32, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}>
        <div className="flex items-center justify-around py-2 px-1">
          {mainNav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs transition-colors ${
                  isActive ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate max-w-[56px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
