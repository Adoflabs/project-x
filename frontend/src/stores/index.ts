import { create } from 'zustand';
import type { AppUser, FormulaConfig, RiskThresholds, DashboardWidget } from '@/types';

// ──── Auth Store ────
interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  setUser: (user: AppUser) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  initAuth: () => {
    // Auto-login in development mode with mock user
    if (process.env.NODE_ENV === 'development') {
      const mockUser: AppUser = {
        id: 'dev-user-1',
        email: 'dev@veridion.com',
        name: 'Dev User',
        role: 'owner',
        companyId: 'dev-company-1',
        companyName: 'Veridion Demo',
      };
      set({ user: mockUser, isAuthenticated: true });
    }
  },
}));

// ──── UI Store ────
interface UIState {
  sidebarExpanded: boolean;
  sidebarMobileOpen: boolean;
  activeNav: string;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setActiveNav: (nav: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  activeNav: 'dashboard',
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setActiveNav: (nav) => set({ activeNav: nav }),
}));

// ──── Config Store ────
interface ConfigState {
  formula: FormulaConfig | null;
  riskThresholds: RiskThresholds;
  setFormula: (f: FormulaConfig) => void;
  setRiskThresholds: (t: Partial<RiskThresholds>) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  formula: null,
  riskThresholds: {
    scoreDropThreshold: 18,
    missedCheckinsThreshold: 2,
    peerFeedbackThreshold: 2.5,
    keywords: ['burnout', 'leaving', 'frustrated'],
    tenureSensitivity: true,
    notifyOwner: true,
    notifyHr: true,
    notifyManager: false,
  },
  setFormula: (formula) => set({ formula }),
  setRiskThresholds: (t) =>
    set((s) => ({ riskThresholds: { ...s.riskThresholds, ...t } })),
}));

// ──── Dashboard Layout Store ────
interface DashboardLayoutState {
  widgets: DashboardWidget[];
  editMode: boolean;
  sundayMode: boolean;
  setWidgets: (w: DashboardWidget[]) => void;
  setEditMode: (v: boolean) => void;
  setSundayMode: (v: boolean) => void;
}

export const useDashboardStore = create<DashboardLayoutState>((set) => ({
  widgets: [
    { id: '1', type: 'alert-summary', title: 'Alert Summary', cols: 4, order: 0 },
    { id: '2', type: 'score-trend', title: 'Score Trends', cols: 8, order: 1 },
    { id: '3', type: 'pay-fairness', title: 'Pay Fairness', cols: 6, order: 2 },
    { id: '4', type: 'team-comparison', title: 'Team Comparison', cols: 6, order: 3 },
    { id: '5', type: 'activity-feed', title: 'Recent Activity', cols: 4, order: 4 },
    { id: '6', type: 'pending-actions', title: 'Pending Actions', cols: 4, order: 5 },
    { id: '7', type: 'top-performers', title: 'Top Performers', cols: 4, order: 6 },
    { id: '8', type: 'at-risk-watch', title: 'At-Risk Watch', cols: 4, order: 7 },
  ],
  editMode: false,
  sundayMode: false,
  setWidgets: (widgets) => set({ widgets }),
  setEditMode: (editMode) => set({ editMode }),
  setSundayMode: (sundayMode) => set({ sundayMode }),
}));
