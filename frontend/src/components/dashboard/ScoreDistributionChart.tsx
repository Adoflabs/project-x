'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ScoreDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalEmployees?: number;
}

export default function ScoreDistributionChart({ data, totalEmployees = 100 }: ScoreDistributionChartProps) {
  const isPercentage = totalEmployees === 100 || data.reduce((sum, item) => sum + item.value, 0) === 100;
  const displayTotal = isPercentage ? '100%' : totalEmployees.toLocaleString();
  const displayLabel = isPercentage ? 'Distribution' : 'Total Scored';

  return (
    <Card className="animate-fade-slide-up stagger-3">
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 22, 41, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(12px)',
                }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl font-bold font-mono text-text-primary">{displayTotal}</div>
              <div className="text-sm text-text-muted mt-1">{displayLabel}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-text-secondary">{item.name}</span>
              </div>
              <span className="font-mono font-semibold text-text-primary">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
