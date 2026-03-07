'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface ScoreTrendChartProps {
  data: Array<{
    week: string;
    avg: number;
    deptAvg: number;
    atRisk: number;
  }>;
}

type TimeRange = 'weekly' | 'monthly' | 'quarterly';

export default function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

  return (
    <Card className="animate-fade-slide-up stagger-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Score Trends</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant={timeRange === 'weekly' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={timeRange === 'monthly' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </Button>
            <Button 
              variant={timeRange === 'quarterly' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('quarterly')}
            >
              Quarterly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e5e7eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#e5e7eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#d1d5db" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 22, 41, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(12px)',
              }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
              itemStyle={{ color: '#94a3b8', fontSize: 12 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="avg"
              stroke="#e5e7eb"
              strokeWidth={2}
              fill="url(#colorAvg)"
              name="Company Avg"
              dot={{ r: 4, fill: '#e5e7eb', strokeWidth: 2, stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="deptAvg"
              stroke="#d1d5db"
              strokeWidth={2}
              fill="url(#colorDept)"
              name="Dept Avg"
              dot={{ r: 4, fill: '#d1d5db', strokeWidth: 2, stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="atRisk"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              name="At Risk Count"
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
