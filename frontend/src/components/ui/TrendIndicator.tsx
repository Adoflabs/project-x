import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  size?: 'sm' | 'md';
}

export default function TrendIndicator({ value, size = 'md' }: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  if (isNeutral) {
    return (
      <span className={`inline-flex items-center gap-1 ${textSize} text-text-muted`}>
        <Minus className={iconSize} />
        <span>0.0</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${textSize} font-medium ${
        isPositive ? 'text-success' : 'text-danger'
      }`}
    >
      {isPositive ? (
        <TrendingUp className={iconSize} />
      ) : (
        <TrendingDown className={iconSize} />
      )}
      <span>
        {isPositive ? '+' : ''}
        {value.toFixed(1)}
      </span>
    </span>
  );
}
