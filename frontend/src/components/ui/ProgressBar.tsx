import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;        // 0-100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'orange' | 'green' | 'blue' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const COLOR_MAP = {
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const SIZE_MAP = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  color = 'orange',
  size = 'md',
  animated = true,
  className = '',
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(pct), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(pct);
    }
  }, [pct, animated]);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercent && (
            <span className="text-sm font-semibold text-gray-600 ml-auto">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${SIZE_MAP[size]}`}>
        <div
          className={`${SIZE_MAP[size]} ${COLOR_MAP[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}
