'use client';

import { Badge } from './badge';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreBadge({ score, size = 'md', showLabel = true }: ScoreBadgeProps) {
  const getVariant = () => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Badge variant={getVariant() as any} className={`inline-flex items-center gap-1.5 font-mono font-bold ${sizeClasses[size]}`}>
      {score}
      {showLabel && <span className="text-[0.7em] opacity-70">/100</span>}
    </Badge>
  );
}
