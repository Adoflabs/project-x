# Component Library Documentation

Complete reference for all UI components in the Employee Intelligence Platform.

## 🎨 Design Tokens

### Colors
```css
--color-bg-base: #0a0e1a          /* Main background */
--color-bg-layer2: #0f1629        /* Card backgrounds */
--color-bg-sidebar: #0d1120       /* Sidebar background */

--color-accent-blue: #3b82f6      /* Primary actions */
--color-accent-cyan: #06b6d4      /* Secondary accent */
--color-accent-purple: #8b5cf6    /* Tertiary accent */

--color-success: #10b981          /* Success states */
--color-warning: #f59e0b          /* Warning states */
--color-danger: #ef4444           /* Error/danger states */

--color-text-primary: #f1f5f9     /* Main text */
--color-text-secondary: #94a3b8   /* Secondary text */
--color-text-muted: #475569       /* Muted text */
```

### Spacing Scale
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

### Border Radius
```
sm: 8px
md: 12px
lg: 16px
full: 9999px
```

## 📦 Core Components

### ScoreBadge

Displays employee scores with color-coded styling.

**Location:** `src/components/ui/ScoreBadge.tsx`

**Props:**
```typescript
interface ScoreBadgeProps {
  score: number;           // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;     // Show "/100" suffix
}
```

**Usage:**
```tsx
<ScoreBadge score={82} size="md" showLabel={true} />
```

**Color Logic:**
- `score >= 80`: Green (success)
- `score >= 60`: Amber (warning)
- `score < 60`: Red (danger)

**Variants:**
- `sm`: 12px text, 8px padding
- `md`: 14px text, 12px padding (default)
- `lg`: 16px text, 16px padding

---

### TrendIndicator

Shows score change with arrow and color.

**Location:** `src/components/ui/TrendIndicator.tsx`

**Props:**
```typescript
interface TrendIndicatorProps {
  value: number;           // Positive or negative change
  size?: 'sm' | 'md';
}
```

**Usage:**
```tsx
<TrendIndicator value={4.6} size="md" />
<TrendIndicator value={-2.3} size="sm" />
```

**Display:**
- Positive: Green ↑ arrow
- Negative: Red ↓ arrow
- Zero: Gray — dash

---

### RiskPill

Displays risk level with icon and color.

**Location:** `src/components/ui/RiskPill.tsx`

**Props:**
```typescript
interface RiskPillProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}
```

**Usage:**
```tsx
<RiskPill level="high" size="md" />
```

**Variants:**
- `low`: 🟢 Green
- `medium`: 🟡 Amber
- `high`: 🔴 Red

---

### KPICard

Animated metric card with optional trend and progress bar.

**Location:** `src/components/dashboard/KPICard.tsx`

**Props:**
```typescript
interface KPICardProps {
  title: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  progress?: number;       // 0-100 for progress bar
  delay?: number;          // Animation delay in ms
}
```

**Usage:**
```tsx
<KPICard
  title="Total Score Average"
  value={74.2}
  trend={4.6}
  trendLabel="vs last period"
  icon={TrendingUp}
  progress={74.2}
  delay={0}
/>
```

**Features:**
- Count-up animation (0 → value)
- Staggered entrance animation
- Optional progress bar
- Trend indicator

---

### ScoreTrendChart

Area chart showing score trends over time.

**Location:** `src/components/dashboard/ScoreTrendChart.tsx`

**Props:**
```typescript
interface ScoreTrendChartProps {
  data: Array<{
    week: string;
    avg: number;
    deptAvg: number;
    atRisk: number;
  }>;
}
```

**Usage:**
```tsx
<ScoreTrendChart data={scoreTrends} />
```

**Features:**
- 3 data series (company avg, dept avg, at-risk count)
- Filled area gradients
- Interactive tooltip
- Responsive sizing

---

### ScoreDistributionChart

Donut chart showing score distribution.

**Location:** `src/components/dashboard/ScoreDistributionChart.tsx`

**Props:**
```typescript
interface ScoreDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalEmployees?: number;
}
```

**Usage:**
```tsx
<ScoreDistributionChart
  data={[
    { name: 'Excellent (80-100)', value: 42, color: '#10b981' },
    { name: 'Good (60-79)', value: 35, color: '#3b82f6' },
    { name: 'Needs Attention (<60)', value: 23, color: '#ef4444' },
  ]}
  totalEmployees={6184}
/>
```

**Features:**
- Center label with total count
- Legend with percentages
- Interactive hover states

---

### EmployeeTable

Searchable, sortable employee data table.

**Location:** `src/components/employees/EmployeeTable.tsx`

**Props:**
```typescript
interface EmployeeTableProps {
  employees: Employee[];
  onRowClick?: (employee: Employee) => void;
}
```

**Usage:**
```tsx
<EmployeeTable
  employees={employeeList}
  onRowClick={(emp) => setSelected(emp)}
/>
```

**Features:**
- Search by name, role, department
- Filter and column controls
- Sortable columns
- Row hover effects
- Pagination
- Action menu per row

**Columns:**
- Employee (avatar + name)
- Role / Department
- Score (badge)
- Trend (indicator)
- Risk Level (pill)
- Updated (date)
- Actions (menu)

---

## 🎭 Layout Components

### Sidebar

Main navigation sidebar with collapsible state.

**Location:** `src/components/layout/Sidebar.tsx`

**Features:**
- Collapsible (240px ↔ 64px)
- Active state highlighting
- Badge support for notifications
- Mobile bottom bar variant
- Smooth transitions

**Navigation Items:**
- Dashboard
- Employees
- Scorecard Config
- Flight Risk
- Pay Fairness
- Forms
- Peer Feedback
- Documentation
- Notifications (with badge)
- Profile
- Settings
- Support

---

### Header

Top header bar with search and user menu.

**Location:** `src/components/layout/Header.tsx`

**Features:**
- Breadcrumb navigation
- Global search bar
- Date display
- Notification bell (with indicator)
- User avatar dropdown
- Mobile hamburger menu

---

## 🎨 Utility Classes

### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px) saturate(180%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

### Hover Effect
```css
.glass-card-hover:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

### Neon Glow
```css
.neon-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
              0 0 40px rgba(6, 182, 212, 0.1);
}
```

---

## 🎬 Animations

### Fade Slide Up
```css
.animate-fade-slide-up {
  animation: fadeSlideUp 0.5s ease-out both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Stagger Delays
```css
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 200ms; }
.stagger-4 { animation-delay: 300ms; }
.stagger-5 { animation-delay: 400ms; }
.stagger-6 { animation-delay: 500ms; }
```

### Pulse Animations
```css
.animate-pulse-danger {
  animation: pulseGlow 2s ease infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.7);
  }
}
```

---

## 🎯 Form Components

### Input Field
```tsx
<input
  type="text"
  className="w-full px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/40 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.4)] transition-all"
  placeholder="Search..."
/>
```

### Select Dropdown
```tsx
<select className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary outline-none focus:border-accent-blue/40">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Range Slider
```tsx
<input
  type="range"
  min="0"
  max="100"
  className="w-full"
/>
```

Styled in `globals.css`:
```css
input[type="range"] {
  -webkit-appearance: none;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}
```

### Textarea
```tsx
<textarea
  rows={4}
  className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/40 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.4)] transition-all resize-none"
  placeholder="Enter notes..."
/>
```

---

## 🔘 Button Variants

### Primary Button
```tsx
<button className="px-4 py-2 rounded-lg bg-accent-blue hover:bg-accent-blue/90 text-white font-medium transition-colors">
  Primary Action
</button>
```

### Secondary Button
```tsx
<button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary transition-colors">
  Secondary Action
</button>
```

### Success Button
```tsx
<button className="px-4 py-2 rounded-lg bg-success hover:bg-success/90 text-white font-medium transition-colors">
  Approve
</button>
```

### Danger Button
```tsx
<button className="px-4 py-2 rounded-lg bg-danger hover:bg-danger/90 text-white font-medium transition-colors">
  Delete
</button>
```

### Icon Button
```tsx
<button className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-text-secondary transition-colors">
  <Icon className="w-4 h-4" />
</button>
```

---

## 📊 Chart Components

All charts use **Recharts** library.

### Common Chart Props
```typescript
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
    <XAxis stroke="#94a3b8" fontSize={12} />
    <YAxis stroke="#94a3b8" fontSize={12} />
    <Tooltip
      contentStyle={{
        background: 'rgba(15, 22, 41, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        backdropFilter: 'blur(12px)',
      }}
    />
  </AreaChart>
</ResponsiveContainer>
```

### Chart Color Palette
```typescript
const chartColors = {
  blue: '#3b82f6',
  cyan: '#06b6d4',
  purple: '#8b5cf6',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
};
```

---

## 🎨 Status Indicators

### Loading Skeleton
```tsx
<div className="skeleton h-8 w-full" />
```

### Empty State
```tsx
<div className="glass-card p-12 text-center">
  <Icon className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
  <h3 className="text-lg font-semibold text-text-primary mb-2">No data</h3>
  <p className="text-sm text-text-muted">Nothing to display yet</p>
</div>
```

### Error State
```tsx
<div className="glass-card p-6 bg-danger/10 border-danger/20">
  <div className="flex items-start gap-3">
    <span className="text-xl">⚠️</span>
    <div>
      <div className="text-sm font-medium text-danger mb-1">Error</div>
      <div className="text-xs text-text-secondary">Something went wrong</div>
    </div>
  </div>
</div>
```

---

## 🎭 Modal/Drawer Pattern

### Side Drawer
```tsx
{showDrawer && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
    onClick={() => setShowDrawer(false)}
  >
    <div
      className="w-full max-w-2xl h-full bg-bg-layer2 border-l border-white/[0.06] p-6 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drawer content */}
    </div>
  </div>
)}
```

### Center Modal
```tsx
{showModal && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setShowModal(false)}
  >
    <div
      className="glass-card p-6 max-w-md w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal content */}
    </div>
  </div>
)}
```

---

## 📱 Responsive Patterns

### Grid Layouts
```tsx
{/* 1 col mobile, 2 col tablet, 4 col desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Flex Layouts
```tsx
{/* Stack on mobile, row on desktop */}
<div className="flex flex-col lg:flex-row gap-4">
  <div className="flex-1">Left</div>
  <div className="flex-1">Right</div>
</div>
```

### Hide/Show by Breakpoint
```tsx
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile only</div>
```

---

## 🎯 Best Practices

### 1. Always Use Glass Cards
```tsx
// ✅ Good
<div className="glass-card p-6">Content</div>

// ❌ Bad
<div className="bg-white p-6">Content</div>
```

### 2. Consistent Spacing
```tsx
// ✅ Good - Use spacing scale
<div className="space-y-6">
  <div className="mb-4">...</div>
</div>

// ❌ Bad - Random values
<div style={{ marginBottom: '17px' }}>...</div>
```

### 3. Semantic Colors
```tsx
// ✅ Good
<span className="text-success">Active</span>
<span className="text-danger">Error</span>

// ❌ Bad
<span className="text-green-500">Active</span>
<span className="text-red-500">Error</span>
```

### 4. Accessible Interactions
```tsx
// ✅ Good
<button
  onClick={handleClick}
  className="..."
  aria-label="Close dialog"
>
  <X className="w-4 h-4" />
</button>

// ❌ Bad
<div onClick={handleClick}>
  <X className="w-4 h-4" />
</div>
```

### 5. Loading States
```tsx
// ✅ Good
{loading ? <Skeleton /> : <Content data={data} />}

// ❌ Bad
{data && <Content data={data} />}
```

---

## 🔧 Customization

### Extending Colors
Add to `globals.css`:
```css
@theme {
  --color-custom-pink: #ec4899;
}
```

Use in components:
```tsx
<div className="text-[var(--color-custom-pink)]">Pink text</div>
```

### Custom Animations
Add to `globals.css`:
```css
@keyframes customBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-custom-bounce {
  animation: customBounce 1s ease infinite;
}
```

---

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🎨 Figma Design System

(Link to Figma file if available)

---

## 🆘 Component Support

For component-related issues:
1. Check this documentation
2. Review component source code
3. Check browser DevTools for styling issues
4. Create an issue on GitHub with:
   - Component name
   - Expected behavior
   - Actual behavior
   - Screenshot
