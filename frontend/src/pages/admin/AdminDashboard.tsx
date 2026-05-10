import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Fish,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  BookOpen,
  Crosshair,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const departmentCompletion = [
  { dept: 'Engineering', completion: 91 },
  { dept: 'Marketing', completion: 74 },
  { dept: 'Finance', completion: 88 },
  { dept: 'HR', completion: 95 },
  { dept: 'Sales', completion: 63 },
];

const securityTrend = [
  { month: 'Nov', score: 65 },
  { month: 'Dec', score: 68 },
  { month: 'Jan', score: 70 },
  { month: 'Feb', score: 71 },
  { month: 'Mar', score: 73 },
  { month: 'Apr', score: 73 },
];

const phishingCampaigns = [
  { id: 1, name: 'Q1 LinkedIn Spear Phish', type: 'Email', sent: 247, clickPct: 14, reportedPct: 62 },
  { id: 2, name: 'IT Password Reset Lure', type: 'Email', sent: 247, clickPct: 9, reportedPct: 71 },
  { id: 3, name: 'DocuSign Invoice Fake', type: 'Email', sent: 210, clickPct: 18, reportedPct: 55 },
  { id: 4, name: 'QR Code Lobby Drop', type: 'QR', sent: 120, clickPct: 7, reportedPct: 43 },
  { id: 5, name: 'CEO Wire Transfer SMS', type: 'SMS', sent: 85, clickPct: 22, reportedPct: 38 },
];

const riskUsers = [
  { id: 1, name: 'Jordan Lee', dept: 'Sales', score: 28, factors: ['Clicked 3 phish', 'Overdue training'] },
  { id: 2, name: 'Alex Morgan', dept: 'Marketing', score: 34, factors: ['Weak password', 'No MFA'] },
  { id: 3, name: 'Sam Rivera', dept: 'Engineering', score: 41, factors: ['Clicked 2 phish'] },
  { id: 4, name: 'Casey Kim', dept: 'Finance', score: 43, factors: ['Overdue training', 'No MFA'] },
  { id: 5, name: 'Taylor Brooks', dept: 'Sales', score: 44, factors: ['Clicked 2 phish', 'Weak password'] },
  { id: 6, name: 'Morgan Chen', dept: 'HR', score: 47, factors: ['Overdue training'] },
  { id: 7, name: 'Riley Scott', dept: 'Marketing', score: 51, factors: ['Clicked 1 phish'] },
  { id: 8, name: 'Jamie Foster', dept: 'Finance', score: 52, factors: ['No MFA'] },
  { id: 9, name: 'Drew Patel', dept: 'Sales', score: 53, factors: ['Overdue training'] },
  { id: 10, name: 'Quinn Adams', dept: 'Engineering', score: 54, factors: ['Weak password'] },
];

const recentActivity = [
  { id: 1, user: 'Admin', action: 'Launched phishing campaign "Q2 CEO Spear"', time: '2 min ago', type: 'admin' },
  { id: 2, user: 'Jordan Lee', action: 'Clicked phishing simulation link', time: '14 min ago', type: 'alert' },
  { id: 3, user: 'Sam Rivera', action: 'Completed "Advanced Threat Awareness" course', time: '31 min ago', type: 'success' },
  { id: 4, user: 'Casey Kim', action: 'Acknowledged Security Policy v3.2', time: '45 min ago', type: 'success' },
  { id: 5, user: 'Alex Morgan', action: 'Failed quiz: Phishing Recognition (62%)', time: '1 hr ago', type: 'warning' },
  { id: 6, user: 'Admin', action: 'Exported compliance report — Q1 2026', time: '2 hr ago', type: 'admin' },
  { id: 7, user: 'Taylor Brooks', action: 'Reset password via self-service', time: '3 hr ago', type: 'info' },
  { id: 8, user: 'Morgan Chen', action: 'Reported suspicious email to SOC', time: '4 hr ago', type: 'success' },
  { id: 9, user: 'Admin', action: 'Created 12 new user accounts (CSV import)', time: '5 hr ago', type: 'admin' },
  { id: 10, user: 'Riley Scott', action: 'Logged in from new device (Chrome / macOS)', time: '6 hr ago', type: 'warning' },
];

const complianceFrameworks = [
  { name: 'ISO 27001', progress: 87, color: '#F97316' },
  { name: 'SOC 2', progress: 79, color: '#F97316' },
  { name: 'PCI-DSS', progress: 92, color: '#F97316' },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function KPICard({
  icon,
  label,
  value,
  sub,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <span className="p-2 bg-orange-50 rounded-lg text-orange-500">{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}
        >
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      </div>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function CircleGauge({ name, progress }: { name: string; progress: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#F97316"
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="-mt-14 flex items-center justify-center h-[72px] w-[72px]">
        <span className="text-sm font-bold text-gray-800 rotate-0">{progress}%</span>
      </div>
      <span className="text-xs text-gray-500 font-medium">{name}</span>
    </div>
  );
}

const activityTypeStyle: Record<string, { bg: string; dot: string }> = {
  admin: { bg: 'bg-blue-50', dot: 'bg-blue-400' },
  alert: { bg: 'bg-red-50', dot: 'bg-red-500' },
  success: { bg: 'bg-green-50', dot: 'bg-green-500' },
  warning: { bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
  info: { bg: 'bg-gray-50', dot: 'bg-gray-400' },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <FileText size={16} />
          Generate Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={<Users size={20} />}
          label="Total Users"
          value="247"
          sub="12 added this month"
          trend="+5.1%"
          trendUp
        />
        <KPICard
          icon={<ShieldCheck size={20} />}
          label="Compliance Rate"
          value="84%"
          sub="Target: 95% by Q3"
          trend="+2.3%"
          trendUp
        />
        <KPICard
          icon={<Fish size={20} />}
          label="Phishing Click Rate"
          value="12%"
          sub="Industry avg: 18%"
          trend="-3.0%"
          trendUp={false}
        />
        <KPICard
          icon={<Star size={20} />}
          label="Avg Security Score"
          value="73/100"
          sub="Top dept: HR (91)"
          trend="+1.4%"
          trendUp
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Training Completion by Department
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentCompletion} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="dept" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="%" />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Completion']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="completion" fill="#F97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Security Score Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={securityTrend} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} domain={[60, 80]} />
              <Tooltip
                formatter={(v: number) => [v, 'Avg Score']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ fill: '#F97316', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Phishing Campaign Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Phishing Campaign Summary</h2>
          <button className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pr-4 font-semibold">Campaign Name</th>
                <th className="pb-3 pr-4 font-semibold">Type</th>
                <th className="pb-3 pr-4 font-semibold">Sent</th>
                <th className="pb-3 pr-4 font-semibold">Clicked %</th>
                <th className="pb-3 font-semibold">Reported %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {phishingCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-800">{c.name}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{c.sent}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-semibold ${
                        c.clickPct <= 10 ? 'text-green-600' : c.clickPct <= 15 ? 'text-yellow-500' : 'text-red-500'
                      }`}
                    >
                      {c.clickPct}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-green-600 font-semibold">{c.reportedPct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Risk Users + Activity + Compliance + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Risk Users */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              High-Risk Employees
            </h2>
            <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-semibold">
              10 flagged
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-2 pr-4 font-semibold">Name</th>
                  <th className="pb-2 pr-4 font-semibold">Dept</th>
                  <th className="pb-2 pr-4 font-semibold">Score</th>
                  <th className="pb-2 pr-4 font-semibold">Risk Factors</th>
                  <th className="pb-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {riskUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{u.name}</td>
                    <td className="py-2.5 pr-4 text-gray-500">{u.dept}</td>
                    <td className="py-2.5 pr-4">
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                        {u.score}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {u.factors.map((f) => (
                          <span key={f} className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <button className="text-xs text-orange-500 hover:text-orange-600 font-semibold whitespace-nowrap">
                        Assign Training
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: activity + compliance + actions */}
        <div className="flex flex-col gap-4">
          {/* Compliance Circles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Compliance Status</h2>
            <div className="flex justify-around">
              {complianceFrameworks.map((f) => (
                <CircleGauge key={f.name} name={f.name} progress={f.progress} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <UserPlus size={15} />, label: 'Add User' },
                { icon: <BookOpen size={15} />, label: 'Assign Training' },
                { icon: <Crosshair size={15} />, label: 'Launch Phishing' },
                { icon: <FileText size={15} />, label: 'Generate Report' },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Recent Activity</h2>
          <button className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600">
            View All Logs <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {recentActivity.map((item) => {
            const style = activityTypeStyle[item.type] || activityTypeStyle.info;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${style.bg}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 text-sm">{item.user}</span>
                  <span className="text-gray-500 text-sm"> — {item.action}</span>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                  <Clock size={11} />
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
