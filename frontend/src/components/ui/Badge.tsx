import React from 'react';
import { Lock } from 'lucide-react';
import type { Badge as BadgeType } from '../../types';

interface BadgeProps {
  badge: BadgeType;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const SIZE_MAP = {
  sm: { wrapper: 'w-14 h-14', icon: 'text-2xl', name: 'text-xs', lock: 14 },
  md: { wrapper: 'w-20 h-20', icon: 'text-4xl', name: 'text-sm', lock: 18 },
  lg: { wrapper: 'w-24 h-24', icon: 'text-5xl', name: 'text-base', lock: 22 },
};

export default function Badge({ badge, earned = true, size = 'md', showDescription = false }: BadgeProps) {
  const s = SIZE_MAP[size];

  return (
    <div className={`flex flex-col items-center gap-1.5 ${!earned ? 'opacity-40 grayscale' : ''}`}>
      <div className={`${s.wrapper} rounded-2xl flex items-center justify-center relative ${earned ? 'bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 shadow-md' : 'bg-gray-100 border-2 border-gray-200'}`}>
        {earned ? (
          <span className={s.icon}>{badge.icon}</span>
        ) : (
          <Lock size={s.lock} className="text-gray-400" />
        )}
        {earned && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">✓</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className={`${s.name} font-semibold text-gray-800 leading-tight`}>{badge.name}</p>
        {showDescription && (
          <p className="text-xs text-gray-500 mt-0.5 max-w-[100px] text-center leading-tight">{badge.description}</p>
        )}
        {badge.earnedAt && earned && (
          <p className="text-xs text-gray-400 mt-0.5">{new Date(badge.earnedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
