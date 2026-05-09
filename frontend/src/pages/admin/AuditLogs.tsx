import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
  Eye,
  X,
  Activity,
  LogIn,
  LogOut,
  BookOpen,
  FileText,
  UserPlus,
  UserX,
  Key,
  Fish,
  Megaphone,
  CheckSquare,
  Settings,
  Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type LogStatus = 'Success' | 'Failed' | 'Warning';
type ActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'COURSE_COMPLETE'
  | 'QUIZ_SUBMIT'
  | 'ADMIN_ACTION'
  | 'DATA_EXPORT'
  | 'POLICY_ACK'
  | 'PHISH_CLICK'
  | 'PHISH_REPORT'
  | 'PERMISSION_CHANGE'
  | 'USER_CREATE'
  | 'USER_DELETE';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  userAvatar: string;
  userRole: string;
  action: ActionType;
  resource: string;
  ipAddress: string;
  status: LogStatus;
  details: string;
  requestId: string;
  userAgent: string;
  location: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialLogs: AuditLog[] = [
  { id: 1, timestamp: '2026-05-08 14:32:11', user: 'Admin', userAvatar: 'AD', userRole: 'Admin', action: 'ADMIN_ACTION', resource: 'Campaign: Q2 CEO Spear', ipAddress: '192.168.1.100', status: 'Success', details: 'Launched phishing simulation campaign targeting Finance department (85 users)', requestId: 'req_8Kd92nX1', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 2, timestamp: '2026-05-08 14:18:44', user: 'Jordan Lee', userAvatar: 'JL', userRole: 'Employee', action: 'PHISH_CLICK', resource: 'Campaign: Q2 CEO Spear', ipAddress: '10.0.2.45', status: 'Warning', details: 'Employee clicked phishing simulation link. Template: CEO Wire Transfer. Time to click: 3 minutes after delivery.', requestId: 'req_Px7Lm4Qr', userAgent: 'Chrome 124 / Windows 11', location: 'Chicago, US' },
  { id: 3, timestamp: '2026-05-08 13:51:22', user: 'Sam Rivera', userAvatar: 'SR', userRole: 'Employee', action: 'COURSE_COMPLETE', resource: 'Course: Advanced Threat Awareness', ipAddress: '10.0.1.88', status: 'Success', details: 'Completed course with final quiz score of 87%. XP awarded: +350. Badge unlocked: Threat Hunter.', requestId: 'req_Nm3Kp9Wv', userAgent: 'Firefox 122 / Ubuntu', location: 'Austin, US' },
  { id: 4, timestamp: '2026-05-08 13:45:09', user: 'Casey Kim', userAvatar: 'CK', userRole: 'Employee', action: 'POLICY_ACK', resource: 'Security Policy v3.2', ipAddress: '10.0.3.14', status: 'Success', details: 'Acknowledged and digitally signed Security Policy version 3.2. Policy effective 2026-04-01.', requestId: 'req_Jt5Ry2Zx', userAgent: 'Safari 17 / iOS 17', location: 'Boston, US' },
  { id: 5, timestamp: '2026-05-08 13:02:31', user: 'Alex Morgan', userAvatar: 'AM', userRole: 'Employee', action: 'QUIZ_SUBMIT', resource: 'Quiz: Phishing Recognition', ipAddress: '10.0.2.67', status: 'Warning', details: 'Quiz submitted with score 62% (below passing threshold of 75%). Remedial content unlocked. Retry available in 24h.', requestId: 'req_Hq8Wd6Mn', userAgent: 'Chrome 124 / macOS', location: 'Los Angeles, US' },
  { id: 6, timestamp: '2026-05-08 11:44:58', user: 'Admin', userAvatar: 'AD', userRole: 'Admin', action: 'DATA_EXPORT', resource: 'Compliance Report Q1 2026', ipAddress: '192.168.1.100', status: 'Success', details: 'Exported full compliance report in PDF format. Report includes 247 user records and 5 department summaries.', requestId: 'req_Cn2Lk7Pq', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 7, timestamp: '2026-05-08 10:33:17', user: 'Taylor Brooks', userAvatar: 'TB', userRole: 'Employee', action: 'LOGIN', resource: 'CyberShield LMS', ipAddress: '203.0.113.42', status: 'Warning', details: 'Login from new device and unrecognized IP address. MFA challenge passed. Notified user via email.', requestId: 'req_Gv4Bs1Oj', userAgent: 'Chrome 124 / macOS (new device)', location: 'Seattle, US' },
  { id: 8, timestamp: '2026-05-08 09:55:44', user: 'Morgan Chen', userAvatar: 'MC', userRole: 'Manager', action: 'PHISH_REPORT', resource: 'Campaign: Q2 CEO Spear', ipAddress: '10.0.4.22', status: 'Success', details: 'Employee correctly identified and reported phishing simulation email to security team via report button.', requestId: 'req_Dk6Nh3Uw', userAgent: 'Outlook Desktop / Windows 11', location: 'Denver, US' },
  { id: 9, timestamp: '2026-05-08 08:21:05', user: 'Admin', userAvatar: 'AD', userRole: 'Admin', action: 'USER_CREATE', resource: 'Bulk Import — 12 users', ipAddress: '192.168.1.100', status: 'Success', details: 'CSV bulk import completed. 12 users created, 0 failed. Welcome emails sent. Default role: Employee.', requestId: 'req_Ep9Tf5Av', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 10, timestamp: '2026-05-08 07:18:39', user: 'Riley Scott', userAvatar: 'RS', userRole: 'Employee', action: 'LOGIN', resource: 'CyberShield LMS', ipAddress: '198.51.100.7', status: 'Failed', details: 'Login attempt failed. Incorrect password entered 3 times. Account temporarily locked for 15 minutes. Security alert sent.', requestId: 'req_Iq1Xm8Cb', userAgent: 'Chrome 124 / Windows 11', location: 'Miami, US' },
  { id: 11, timestamp: '2026-05-07 17:44:12', user: 'Dana Mitchell', userAvatar: 'DM', userRole: 'Admin', action: 'PERMISSION_CHANGE', resource: 'User: Morgan Chen', ipAddress: '192.168.1.101', status: 'Success', details: 'User role changed from Employee to Manager. Department: HR. Authorized by: Dana Mitchell (Admin).', requestId: 'req_Lo3Vf2Sr', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 12, timestamp: '2026-05-07 16:30:55', user: 'Jamie Foster', userAvatar: 'JF', userRole: 'Employee', action: 'QUIZ_SUBMIT', resource: 'Quiz: Password Security', ipAddress: '10.0.1.55', status: 'Success', details: 'Quiz submitted with score 88% (passed). XP awarded: +75. Topic: Password Security & MFA.', requestId: 'req_Mu7Zt4Yx', userAgent: 'Safari 17 / macOS', location: 'Phoenix, US' },
  { id: 13, timestamp: '2026-05-07 15:22:18', user: 'Admin', userAvatar: 'AD', userRole: 'Admin', action: 'ADMIN_ACTION', resource: 'Training Assignment', ipAddress: '192.168.1.100', status: 'Success', details: 'Bulk assigned "Phishing Awareness Fundamentals" course to Sales department (38 users). Priority: High.', requestId: 'req_Nk5Qr9Pd', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 14, timestamp: '2026-05-07 14:11:33', user: 'Drew Patel', userAvatar: 'DP', userRole: 'Employee', action: 'COURSE_COMPLETE', resource: 'Course: Password Security & MFA', ipAddress: '10.0.2.91', status: 'Success', details: 'Completed course with score 82%. MFA enabled by user after course completion. XP awarded: +150.', requestId: 'req_Wr2Jh6Kb', userAgent: 'Chrome 124 / Windows 11', location: 'San Francisco, US' },
  { id: 15, timestamp: '2026-05-07 11:08:44', user: 'Admin', userAvatar: 'AD', userRole: 'Admin', action: 'USER_DELETE', resource: 'User: Former Employee #247', ipAddress: '192.168.1.100', status: 'Success', details: 'User account deactivated and data anonymized following offboarding procedure. All active sessions terminated.', requestId: 'req_Fb8Nc1Ty', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 16, timestamp: '2026-05-07 09:55:01', user: 'Avery Wilson', userAvatar: 'AW', userRole: 'Employee', action: 'LOGIN', resource: 'CyberShield LMS', ipAddress: '10.0.1.33', status: 'Success', details: 'Successful login. MFA verified via authenticator app. Session token issued.', requestId: 'req_Hd4Mk7Lz', userAgent: 'Chrome 124 / macOS', location: 'Portland, US' },
  { id: 17, timestamp: '2026-05-07 08:30:22', user: 'Blake Turner', userAvatar: 'BT', userRole: 'Employee', action: 'LOGOUT', resource: 'CyberShield LMS', ipAddress: '10.0.4.17', status: 'Success', details: 'User logged out. Session duration: 47 minutes. All session tokens invalidated.', requestId: 'req_Vc9Tp2Ox', userAgent: 'Firefox 122 / Windows 11', location: 'Nashville, US' },
  { id: 18, timestamp: '2026-05-06 16:44:09', user: 'Dana Mitchell', userAvatar: 'DM', userRole: 'Admin', action: 'DATA_EXPORT', resource: 'User Report — All Users', ipAddress: '192.168.1.101', status: 'Success', details: 'Exported full user database in CSV format. 247 records included. Reason: Monthly audit.', requestId: 'req_Se6Bw3Nq', userAgent: 'Chrome 124 / macOS', location: 'New York, US' },
  { id: 19, timestamp: '2026-05-06 14:22:37', user: 'Quinn Adams', userAvatar: 'QA', userRole: 'Employee', action: 'PHISH_CLICK', resource: 'Campaign: QR Code Lobby Drop', ipAddress: '192.0.2.88', status: 'Warning', details: 'Employee scanned QR code from physical lobby placement and accessed phishing URL from personal mobile device.', requestId: 'req_Ot1Wm5Rf', userAgent: 'Chrome Mobile / Android 14', location: 'On-site' },
  { id: 20, timestamp: '2026-05-06 10:15:55', user: 'Cameron Ross', userAvatar: 'CR', userRole: 'Manager', action: 'POLICY_ACK', resource: 'Acceptable Use Policy v2.1', ipAddress: '10.0.3.76', status: 'Success', details: 'Acknowledged Acceptable Use Policy. Digital signature captured. Policy version: 2.1, effective 2026-03-15.', requestId: 'req_Pa7Gd8Qj', userAgent: 'Safari 17 / macOS', location: 'Boston, US' },
];

const actionTypes: ActionType[] = [
  'LOGIN', 'LOGOUT', 'COURSE_COMPLETE', 'QUIZ_SUBMIT', 'ADMIN_ACTION',
  'DATA_EXPORT', 'POLICY_ACK', 'PHISH_CLICK', 'PHISH_REPORT',
  'PERMISSION_CHANGE', 'USER_CREATE', 'USER_DELETE',
];

const suspiciousAlerts = [
  { id: 1, message: 'Riley Scott — 3 failed login attempts from 198.51.100.7', severity: 'High', time: '7:18 AM' },
  { id: 2, message: 'Taylor Brooks — Login from unrecognized device (Chrome/macOS, Seattle)', severity: 'Medium', time: '10:33 AM' },
  { id: 3, message: 'Quinn Adams — Phishing QR scanned from off-network mobile device', severity: 'Medium', time: 'Yesterday' },
];

// ─── Action Config ────────────────────────────────────────────────────────────

const actionConfig: Record<ActionType, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  LOGIN: { label: 'LOGIN', bg: 'bg-blue-50', text: 'text-blue-600', icon: <LogIn size={11} /> },
  LOGOUT: { label: 'LOGOUT', bg: 'bg-gray-100', text: 'text-gray-500', icon: <LogOut size={11} /> },
  COURSE_COMPLETE: { label: 'COURSE', bg: 'bg-green-50', text: 'text-green-600', icon: <BookOpen size={11} /> },
  QUIZ_SUBMIT: { label: 'QUIZ', bg: 'bg-teal-50', text: 'text-teal-600', icon: <CheckSquare size={11} /> },
  ADMIN_ACTION: { label: 'ADMIN', bg: 'bg-purple-50', text: 'text-purple-600', icon: <Settings size={11} /> },
  DATA_EXPORT: { label: 'EXPORT', bg: 'bg-orange-50', text: 'text-orange-600', icon: <Download size={11} /> },
  POLICY_ACK: { label: 'POLICY', bg: 'bg-indigo-50', text: 'text-indigo-600', icon: <FileText size={11} /> },
  PHISH_CLICK: { label: 'PHISH CLICK', bg: 'bg-red-50', text: 'text-red-600', icon: <Fish size={11} /> },
  PHISH_REPORT: { label: 'PHISH REPORT', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <Megaphone size={11} /> },
  PERMISSION_CHANGE: { label: 'PERMISSION', bg: 'bg-yellow-50', text: 'text-yellow-600', icon: <Key size={11} /> },
  USER_CREATE: { label: 'USER CREATE', bg: 'bg-cyan-50', text: 'text-cyan-600', icon: <UserPlus size={11} /> },
  USER_DELETE: { label: 'USER DELETE', bg: 'bg-rose-50', text: 'text-rose-600', icon: <UserX size={11} /> },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ActionChip({ action }: { action: ActionType }) {
  const cfg = actionConfig[action];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function StatusChip({ status }: { status: LogStatus }) {
  const styles: Record<LogStatus, string> = {
    Success: 'bg-green-50 text-green-600',
    Failed: 'bg-red-50 text-red-600',
    Warning: 'bg-yellow-50 text-yellow-600',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>
  );
}

function AvatarCircle({ initials, role }: { initials: string; role: string }) {
  const color = role === 'Admin' ? 'bg-purple-400' : role === 'Manager' ? 'bg-blue-400' : 'bg-orange-400';
  return (
    <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<ActionType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<LogStatus | 'All'>('All');
  const [filterUser, setFilterUser] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-05-06');
  const [dateTo, setDateTo] = useState('2026-05-08');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return initialLogs.filter((l) => {
      if (filterAction !== 'All' && l.action !== filterAction) return false;
      if (filterStatus !== 'All' && l.status !== filterStatus) return false;
      if (filterUser && !l.user.toLowerCase().includes(filterUser.toLowerCase())) return false;
      const q = search.toLowerCase();
      if (q && !l.resource.toLowerCase().includes(q) && !l.user.toLowerCase().includes(q) && !l.details.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterAction, filterStatus, filterUser]);

  const stats = useMemo(() => ({
    total: filtered.length,
    failed: filtered.filter((l) => l.status === 'Failed').length,
    adminActions: filtered.filter((l) => l.action === 'ADMIN_ACTION').length,
    exports: filtered.filter((l) => l.action === 'DATA_EXPORT').length,
  }), [filtered]);

  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-400 mt-0.5">Complete audit trail of all platform activity</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Download size={14} />
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Activity size={16} />, label: 'Total Events', value: stats.total, color: 'text-gray-700 bg-gray-50' },
          { icon: <X size={16} />, label: 'Failed Logins', value: stats.failed, color: 'text-red-500 bg-red-50' },
          { icon: <Shield size={16} />, label: 'Admin Actions', value: stats.adminActions, color: 'text-purple-500 bg-purple-50' },
          { icon: <Download size={16} />, label: 'Data Exports', value: stats.exports, color: 'text-orange-500 bg-orange-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <span className={`p-2 rounded-lg ${s.color}`}>{s.icon}</span>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suspicious Activity Alerts */}
      {suspiciousAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} className="text-red-500" />
            <span className="text-sm font-semibold text-red-700">Suspicious Activity Detected</span>
          </div>
          {suspiciousAlerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.severity === 'High' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                <span className="text-sm text-red-700">{a.message}</span>
              </div>
              <span className="text-xs text-red-400 whitespace-nowrap ml-2">{a.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by user..."
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 w-40"
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value as ActionType | 'All')}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="All">Action: All</option>
            {actionTypes.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LogStatus | 'All')}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="All">Status: All</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Warning">Warning</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 pl-4 pr-2 font-semibold w-8"></th>
                <th className="py-3 pr-4 font-semibold">Timestamp</th>
                <th className="py-3 pr-4 font-semibold">User</th>
                <th className="py-3 pr-4 font-semibold">Action</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Resource</th>
                <th className="py-3 pr-4 font-semibold hidden lg:table-cell">IP Address</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((log) => (
                <>
                  <tr
                    key={log.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      log.status === 'Failed' ? 'bg-red-50/30' : log.status === 'Warning' ? 'bg-yellow-50/20' : ''
                    }`}
                    onClick={() => toggleExpand(log.id)}
                  >
                    <td className="py-3 pl-4 pr-2">
                      <span className={`w-1.5 h-1.5 rounded-full block ${
                        log.status === 'Success' ? 'bg-green-400' : log.status === 'Failed' ? 'bg-red-500' : 'bg-yellow-400'
                      }`} />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-gray-600 text-xs font-mono whitespace-nowrap flex items-center gap-1">
                        <Clock size={10} className="text-gray-300" />
                        {log.timestamp}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <AvatarCircle initials={log.userAvatar} role={log.userRole} />
                        <span className="font-medium text-gray-800 whitespace-nowrap">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <ActionChip action={log.action} />
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs hidden md:table-cell max-w-xs truncate">
                      {log.resource}
                    </td>
                    <td className="py-3 pr-4 hidden lg:table-cell">
                      <span className="font-mono text-xs text-gray-500">{log.ipAddress}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusChip status={log.status} />
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button className="p-1.5 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                        {expandedId === log.id ? <ChevronUp size={14} /> : <Eye size={14} />}
                      </button>
                    </td>
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`exp-${log.id}`}>
                      <td colSpan={8} className="bg-gray-50 border-l-4 border-orange-400 px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Event Details</p>
                            <p className="text-sm text-gray-700">{log.details}</p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">Request ID</p>
                              <p className="text-sm font-mono text-gray-600">{log.requestId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">User Agent</p>
                              <p className="text-sm text-gray-600">{log.userAgent}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">Location</p>
                              <p className="text-sm text-gray-600">{log.location}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">IP Address</p>
                              <p className="text-sm font-mono text-gray-600">{log.ipAddress}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">User Role</p>
                              <p className="text-sm text-gray-600">{log.userRole}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Activity size={24} className="mx-auto mb-2 text-gray-200" />
                    No logs match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Retention Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Shield size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-700">Log Retention Policy</p>
          <p className="text-xs text-blue-500 mt-0.5">
            Audit logs are retained for <strong>365 days</strong> in accordance with ISO 27001 A.12.4 and SOC 2 CC7.2 requirements. Logs older than 365 days are archived to cold storage and available upon request. Log integrity is verified daily via SHA-256 hash chaining.
          </p>
        </div>
      </div>
    </div>
  );
}
