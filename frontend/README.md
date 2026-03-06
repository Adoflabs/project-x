# Employee Intelligence Platform - Frontend

Modern, dark glassmorphism admin dashboard for employee performance and risk management.

## 🎨 Design System

### Color Palette
- **Background**: Deep space navy (#0a0e1a, #0f1629, #0d1120)
- **Accent**: Electric blue (#3b82f6), Cyan (#06b6d4), Purple (#8b5cf6)
- **Semantic**: Success (#10b981), Warning (#f59e0b), Danger (#ef4444)
- **Text**: Primary (#f1f5f9), Secondary (#94a3b8), Muted (#475569)

### Glass Card Pattern
All cards use glassmorphism with:
- Background: `rgba(255, 255, 255, 0.03)`
- Border: `rgba(255, 255, 255, 0.07)`
- Backdrop filter: `blur(16px) saturate(180%)`
- Neon glow shadows on hover

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── employees/         # Employee scorecard table
│   │   ├── config/            # Formula builder
│   │   ├── risk/              # Flight risk alerts
│   │   ├── pay-fairness/      # Pay fairness scatter plot
│   │   ├── forms/             # Manager rating forms
│   │   ├── feedback/          # Peer feedback
│   │   ├── docs/              # Audit log
│   │   └── notifications/     # Notifications
│   ├── components/
│   │   ├── layout/            # Sidebar, Header
│   │   ├── ui/                # ScoreBadge, TrendIndicator, RiskPill
│   │   ├── dashboard/         # KPICard, Charts
│   │   └── employees/         # EmployeeTable
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── mock-data.ts       # Mock data generators
│   ├── stores/                # Zustand state management
│   └── types/                 # TypeScript interfaces
```

## 🎯 Key Features

### Dashboard
- 4 animated KPI cards with count-up animations
- Score trend area chart (8-week view)
- Score distribution pie chart
- Recent activity timeline
- Top performers leaderboard

### Employees
- Searchable, filterable table
- Score badges with color coding
- Trend indicators (↑↓)
- Risk level pills
- Employee detail drawer

### Flight Risk
- Alert cards with severity levels
- Configurable thresholds (sliders)
- Keyword detection
- Pulse animations on high-risk alerts

### Pay Fairness
- Interactive scatter plot (Recharts)
- Quadrant analysis (Stars, Underpaid, Overpaid, Underperformers)
- Real-time threshold adjustments
- Department color coding

### Scorecard Config
- Drag-drop formula builder
- Weight sliders with auto-validation
- Team override approval workflow
- Formula preview

### Manager Forms
- Bulk rating interface
- Progress tracking
- Keyword detection for risk flags
- Keyboard navigation

### Peer Feedback
- Anonymous submission
- Star ratings
- Progress indicators

### Audit Log
- Timeline view with diffs
- Blockchain verification status
- Search and filters

## 🔌 API Integration

The frontend is designed to integrate with the backend API. Update the API base URL:

```typescript
// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
```

Set environment variable:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

## 🎨 Styling

- **Framework**: Tailwind CSS v4 (CSS-based config)
- **Animations**: Framer Motion + CSS keyframes
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Geist (body), Geist Mono (data)

## 📱 Responsive Design

- **Mobile (<768px)**: Bottom tab bar, stacked cards
- **Tablet (768-1024px)**: Icon-only sidebar, 2-column grid
- **Desktop (1024+)**: Full sidebar, multi-column layouts
- **Wide (>1440px)**: Max-width container centered

## 🔐 Role-Based UI

The UI adapts based on user role:
- **Owner**: Full access
- **Manager**: Team-only views, read-only config
- **HR**: All employees, no salary data
- **Employee**: Own data only

## 🚧 Next Steps

1. Connect to real backend API (replace mock data)
2. Add authentication flow
3. Implement WebSocket for real-time notifications
4. Add PDF export functionality
5. Implement drag-drop for formula builder
6. Add more chart types and visualizations

## 📦 Dependencies

- **Next.js 16**: React framework
- **React 19**: UI library
- **Recharts**: Charts
- **Zustand**: State management
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **@dnd-kit**: Drag and drop (ready to use)

## 🎯 Performance

- Server-side rendering with Next.js
- Optimized images with next/image
- Code splitting by route
- Lazy loading for heavy components
- Memoized chart data

## 📄 License

MIT
