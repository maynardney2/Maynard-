import React, { useState } from 'react';
import { Trophy, Medal, Users, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LEADERBOARD_DATA, DEPARTMENTS } from '../data/curriculum';
import type { LeaderboardEntry } from '../types';

type TimeFilter = 'week' | 'month' | 'all';
type ViewTab = 'individual' | 'department';

const STREAK_DATA: Record<string, number> = {
  'usr-010': 45, 'usr-011': 32, 'usr-012': 28, 'usr-001': 14, 'usr-013': 21,
  'usr-014': 17, 'usr-003': 9, 'usr-015': 12, 'usr-016': 6, 'usr-002': 7,
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const DEPT_OPTIONS = ['All Departments', 'IT Security', 'Customer Support', 'Operations', 'Finance', 'HR', 'Sales'];

const AVATAR_COLORS = [
  'from-purple-400 to-purple-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
  'from-teal-400 to-teal-600',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
  'from-yellow-400 to-yellow-600',
  'from-cyan-400 to-cyan-600',
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [viewTab, setViewTab] = useState<ViewTab>('individual');

  const filteredData = LEADERBOARD_DATA.filter(e =>
    deptFilter === 'All Departments' || e.user.department === deptFilter
  );

  const top3 = filteredData.slice(0, 3);
  const rest = filteredData.slice(3);

  const currentUserRank = LEADERBOARD_DATA.find(e => e.user.id === user?.id);

  const getScoreMultiplier = () => {
    if (timeFilter === 'week') return 0.15;
    if (timeFilter === 'month') return 0.6;
    return 1;
  };

  const adjustedScore = (score: number) => Math.round(score * getScoreMultiplier());

  const getRankChange = (rank: number) => {
    const changes = [0, 1, -1, 2, 0, -2, 1, 0, 3, -1];
    return changes[rank - 1] ?? 0;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy size={36} className="text-yellow-300" />
            <div>
              <h1 className="text-2xl font-bold">Security Champions</h1>
              <p className="text-orange-100 text-sm">Top performers in cybersecurity awareness</p>
            </div>
          </div>
          {currentUserRank && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <p className="text-white text-2xl font-bold">#{currentUserRank.rank}</p>
              <p className="text-orange-200 text-xs">Your Rank</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewTab('individual')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewTab === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Individual
            </button>
            <button
              onClick={() => setViewTab('department')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewTab === 'department' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Department
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'all'] as TimeFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${timeFilter === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Department filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {viewTab === 'individual' ? (
        <>
          {/* Podium - Top 3 */}
          {top3.length >= 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-center font-semibold text-gray-700 mb-6 text-sm uppercase tracking-wide">Top 3 Champions</h3>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd place */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[1]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {getInitials(top3[1].user.name)}
                  </div>
                  <Medal size={20} className="text-gray-400" />
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm">{top3[1].user.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">{top3[1].user.department}</p>
                    <p className="text-orange-500 font-bold text-sm">{adjustedScore(top3[1].score)}</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-t-xl" style={{ height: '80px' }}>
                    <div className="w-full h-full bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                  </div>
                </div>

                {/* 1st place */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className={`w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br ${AVATAR_COLORS[0]} flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-yellow-400`}>
                      {getInitials(top3[0].user.name)}
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                  </div>
                  <Trophy size={20} className="text-yellow-500" />
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{top3[0].user.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">{top3[0].user.department}</p>
                    <p className="text-orange-500 font-bold">{adjustedScore(top3[0].score)}</p>
                  </div>
                  <div className="w-24 rounded-t-xl" style={{ height: '110px' }}>
                    <div className="w-full h-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-xl flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">1</span>
                    </div>
                  </div>
                </div>

                {/* 3rd place */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[2]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {getInitials(top3[2].user.name)}
                  </div>
                  <Medal size={20} className="text-orange-600" />
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm">{top3[2].user.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">{top3[2].user.department}</p>
                    <p className="text-orange-500 font-bold text-sm">{adjustedScore(top3[2].score)}</p>
                  </div>
                  <div className="w-24 bg-orange-200 rounded-t-xl" style={{ height: '60px' }}>
                    <div className="w-full h-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full rankings table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Full Rankings</h3>
              <span className="text-sm text-gray-500">{filteredData.length} participants</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Employee</div>
              <div className="col-span-2 hidden sm:block">Department</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-1 text-center hidden md:block">Courses</div>
              <div className="col-span-1 text-center hidden md:block">Badges</div>
              <div className="col-span-1 text-center">Streak</div>
            </div>

            {filteredData.map((entry, i) => {
              const isCurrentUser = entry.user.id === user?.id;
              const change = getRankChange(entry.rank);
              const colorIdx = i % AVATAR_COLORS.length;

              return (
                <div
                  key={entry.user.id}
                  className={`grid grid-cols-12 gap-2 px-6 py-3.5 border-b border-gray-50 items-center transition-colors ${
                    isCurrentUser
                      ? 'bg-orange-50 border-orange-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    <span className={`text-sm font-bold ${entry.rank <= 3 ? 'text-yellow-500' : 'text-gray-500'}`}>
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {getInitials(entry.user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrentUser ? 'text-orange-700' : 'text-gray-900'}`}>
                        {entry.user.name}
                        {isCurrentUser && <span className="ml-1.5 text-xs text-orange-500 font-normal">(You)</span>}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{entry.user.department}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-sm">{adjustedScore(entry.score)}</span>
                      {change !== 0 && (
                        <span className={`flex items-center text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {Math.abs(change)}
                        </span>
                      )}
                      {change === 0 && <Minus size={10} className="text-gray-400" />}
                    </div>
                  </div>
                  <div className="col-span-1 text-center hidden md:block">
                    <span className="text-sm text-gray-700">{entry.completedCourses}</span>
                  </div>
                  <div className="col-span-1 text-center hidden md:block">
                    <span className="text-sm text-gray-700">{entry.badges}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-medium text-orange-500">🔥 {STREAK_DATA[entry.user.id] ?? 1}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Department Rankings */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Users size={18} className="text-orange-500" />
            <h3 className="font-semibold text-gray-900">Department Rankings</h3>
          </div>
          <div className="p-6 space-y-4">
            {DEPARTMENTS.sort((a, b) => b.complianceScore - a.complianceScore).map((dept, i) => (
              <div key={dept.id} className="flex items-center gap-4">
                <span className={`text-lg font-bold w-8 ${i < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{dept.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{dept.employeeCount} employees</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{dept.completionRate}% completed</span>
                      <span className={`font-bold ${dept.complianceScore >= 90 ? 'text-green-600' : dept.complianceScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {dept.complianceScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${dept.complianceScore >= 90 ? 'bg-green-500' : dept.complianceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${dept.complianceScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
