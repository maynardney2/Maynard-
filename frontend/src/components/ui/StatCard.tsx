import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: number;        // positive = up, negative = down
  changeLabel?: string;
  iconBg?: 'orange' | 'green' | 'blue' | 'red' | 'purple';
  className?: string;
}

const ICON_BG_MAP = {
  orange: 'bg-orange-100 text-orange-600',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
};

export default function StatCard({
  icon,
  title,
  value,
  change,
  changeLabel,
  iconBg = 'orange',
  className = '',
}: StatCardProps) {
  const hasChange = change !== undefined;
  const isPositive = (change ?? 0) > 0;
  const isNeutral = change === 0;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${ICON_BG_MAP[iconBg]}`}>
          {icon}
        </div>
        {hasChange && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              isNeutral
                ? 'bg-gray-100 text-gray-500'
                : isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isNeutral ? (
              <Minus size={10} />
            ) : isPositive ? (
              <TrendingUp size={10} />
            ) : (
              <TrendingDown size={10} />
            )}
            {Math.abs(change ?? 0)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}
