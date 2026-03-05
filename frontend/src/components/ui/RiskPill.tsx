'use client';

import { Badge } from './badge';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskPillProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}

export default function RiskPill({ level, size = 'md' }: RiskPillProps) {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  const icons = {
    low: CheckCircle,
    medium: AlertTriangle,
    high: AlertCircle,
  };

  const variants = {
    low: 'success',
    medium: 'warning',
    high: 'destructive',
  };

  const Icon = icons[level];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <Badge variant={variants[level] as any} className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}>
      <Icon className="w-3 h-3" />
      <span>{labels[level]}</span>
    </Badge>
  );
}
