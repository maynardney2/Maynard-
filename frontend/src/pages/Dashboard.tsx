import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Flame,
  AlertTriangle,
  Clock,
  ChevronRight,
  Trophy,
  Lightbulb,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Bell,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { COURSES, LEADERBOARD_DATA, PHISHING_CAMPAIGNS, SECURITY_TIPS } from '../data/curriculum';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';

const MOCK_PROGRESS_CHART = [
  { week: 'Jan W1', score: 45 },
  { week: 'Jan W2', score: 52 },
  { week: 'Jan W3', score: 58 },
  { week: 'Feb W1', score: 61 },
  { week: 'Feb W2', score: 67 },
  { week: 'Mar W1', score: 70 },
  { week: 'Mar W2', score: 72 },
  { week: 'Apr W1', score: 75 },
];

const MOCK_ACTIVITY = [
  { id: 1, action: 'Completed', target: 'Phishing Awareness & Defense', time: '2 hours ago', icon: <CheckCircle size={16} className="text-green-500" /> },
  { id: 2, action: 'Earned badge', target: '"First Steps"', time: '2 hours ago', icon: <Trophy size={16} className="text-yellow-500" /> },
  { id: 3, action: 'Started', target: 'Password Security & MFA', time: 'Yesterday', icon: <PlayCircle size={16} className="text-blue-500" /> },
  { id: 4, action: 'Reported phishing', target: 'Suspicious email from "IT Helpdesk"', time: '2 days ago', icon: <AlertTriangle size={16} className="text-orange-500" /> },
  { id: 5, action: 'Logged in', target: 'CyberShield LMS', time: '3 days ago', icon: <Shield size={16} className="text-purple-500" /> },
];

function getHour() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Work';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const todayTip = useMemo(() => SECURITY_TIPS[Math.floor(Math.random() * SECURITY_TIPS.length)], []);
  const requiredCourses = COURSES.filter(c => c.isRequired);
  const inProgressCourses = COURSES.filter(c => user?.completedCourses.includes(c.id) ? false : true).slice(0, 3);
  const completedCount = user?.completedCourses.length ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold mb-1">
              Good {getHour()}, {user?.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-orange-100 text-sm">
              Your security score is{' '}
              <span className={`font-bold text-lg ${getScoreColor(user?.securityScore ?? 0)}`}>
                {user?.securityScore}/100
              </span>
              {' '}— {getScoreLabel(user?.securityScore ?? 0)}
            </p>
            <p className="text-orange-200 text-xs mt-1">
              {COURSES.length - completedCount > 0
                ? `${COURSES.length - completedCount} courses remaining in your learning path`
                : 'All courses completed! You are a Security Champion.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <p className="text-white text-3xl font-bold">{user?.securityScore}</p>
              <p className="text-orange-200 text-xs">Security Score</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
              <p className="text-white text-3xl font-bold">{completedCount}</p>
              <p className="text-orange-200 text-xs">Courses Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Shield size={22} />}
          title="Security Score"
          value={`${user?.securityScore ?? 0}/100`}
          change={5}
          changeLabel="vs last month"
          iconBg="orange"
        />
        <StatCard
          icon={<BookOpen size={22} />}
          title="Courses Completed"
          value={`${completedCount}/${COURSES.length}`}
          change={2}
          changeLabel="this month"
          iconBg="blue"
        />
        <StatCard
          icon={<Flame size={22} />}
          title="Active Streak"
          value="7 days"
          change={0}
          changeLabel="keep it up!"
          iconBg="orange"
        />
        <StatCard
          icon={<AlertTriangle size={22} />}
          title="Phishing Reported"
          value="3"
          change={50}
          changeLabel="vs last month"
          iconBg="green"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Learning Path */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-500" />
                My Learning Path
              </h3>
              <button
                onClick={() => navigate('/courses')}
                className="text-sm text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {inProgressCourses.map((course, i) => {
                const isCompleted = user?.completedCourses.includes(course.id);
                const progress = isCompleted ? 100 : i === 0 ? 65 : i === 1 ? 30 : 0;
                return (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {course.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-gray-900 text-sm truncate">{course.title}</p>
                        {course.isRequired && (
                          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">Required</span>
                        )}
                      </div>
                      <ProgressBar value={progress} size="sm" showPercent={true} animated />
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Required Training */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                Required Training
              </h3>
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full">
                {requiredCourses.filter(c => !user?.completedCourses.includes(c.id)).length} pending
              </span>
            </div>
            <div className="space-y-3">
              {requiredCourses.map((course, i) => {
                const isCompleted = user?.completedCourses.includes(course.id);
                const deadlines = ['Due in 2 days', 'Due in 5 days', 'Overdue by 1 day'];
                const deadlineColors = ['text-red-600 bg-red-50', 'text-yellow-600 bg-yellow-50', 'text-red-700 bg-red-100'];
                return (
                  <div key={course.id} className={`flex items-center gap-3 p-3 rounded-xl border ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isCompleted ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Clock size={16} className="text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.duration} min • {course.modules.length} modules</p>
                    </div>
                    {isCompleted ? (
                      <span className="text-xs text-green-600 font-semibold">Completed ✓</span>
                    ) : (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deadlineColors[i % 3]}`}>
                        {deadlines[i % 3]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-orange-500" />
                Security Score Over Time
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MOCK_PROGRESS_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`${v}/100`, 'Security Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#F97316"
                  strokeWidth={2.5}
                  dot={{ fill: '#F97316', r: 4 }}
                  activeDot={{ r: 6, fill: '#F97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Security Tip */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} />
              <h3 className="font-semibold text-sm">Security Tip of the Day</h3>
            </div>
            <p className="text-orange-100 text-sm leading-relaxed">{todayTip}</p>
          </div>

          {/* Department Leaderboard mini */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                Top Performers
              </h3>
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-sm text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                Full list <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {LEADERBOARD_DATA.slice(0, 5).map((entry) => {
                const isCurrentUser = entry.user.id === user?.id;
                return (
                  <div
                    key={entry.user.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg ${isCurrentUser ? 'bg-orange-50 border border-orange-200' : ''}`}
                  >
                    <span className={`text-sm font-bold w-6 text-center ${entry.rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {entry.user.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-orange-700' : 'text-gray-900'}`}>{entry.user.name}</p>
                      <p className="text-xs text-gray-500">{entry.user.department}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{entry.score}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Bell size={18} className="text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">
                      <span className="font-medium">{item.action}</span> {item.target}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Campaigns */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-orange-500" />
              Active Campaigns
            </h3>
            <div className="space-y-3">
              {PHISHING_CAMPAIGNS.filter(c => c.status === 'running').map((c) => (
                <div key={c.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-orange-800">{c.name}</p>
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Live</span>
                  </div>
                  <p className="text-xs text-orange-600">
                    {c.type.toUpperCase()} • {c.totalSent} recipients
                  </p>
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center pt-1">
                Stay vigilant — phishing simulations are active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
