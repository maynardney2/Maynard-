import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Upload,
  Edit2,
  UserX,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Shield,
  Mail,
  Building2,
  Calendar,
  AlertTriangle,
  Download,
  CheckSquare,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: 'Admin' | 'Manager' | 'Employee';
  securityScore: number;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  riskLevel: 'Low' | 'Medium' | 'High';
  avatar: string;
  joinDate: string;
  completedCourses: number;
  phishingClicks: number;
  mfaEnabled: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialUsers: User[] = [
  { id: 1, name: 'Jordan Lee', email: 'jordan.lee@company.com', department: 'Sales', role: 'Employee', securityScore: 28, lastLogin: '2026-05-07', status: 'Active', riskLevel: 'High', avatar: 'JL', joinDate: '2023-03-15', completedCourses: 2, phishingClicks: 3, mfaEnabled: false },
  { id: 2, name: 'Alex Morgan', email: 'alex.morgan@company.com', department: 'Marketing', role: 'Employee', securityScore: 34, lastLogin: '2026-05-06', status: 'Active', riskLevel: 'High', avatar: 'AM', joinDate: '2022-11-01', completedCourses: 3, phishingClicks: 2, mfaEnabled: false },
  { id: 3, name: 'Sam Rivera', email: 'sam.rivera@company.com', department: 'Engineering', role: 'Employee', securityScore: 41, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'High', avatar: 'SR', joinDate: '2024-01-10', completedCourses: 5, phishingClicks: 2, mfaEnabled: true },
  { id: 4, name: 'Casey Kim', email: 'casey.kim@company.com', department: 'Finance', role: 'Employee', securityScore: 43, lastLogin: '2026-05-05', status: 'Active', riskLevel: 'High', avatar: 'CK', joinDate: '2023-06-20', completedCourses: 4, phishingClicks: 0, mfaEnabled: false },
  { id: 5, name: 'Taylor Brooks', email: 'taylor.brooks@company.com', department: 'Sales', role: 'Employee', securityScore: 44, lastLogin: '2026-05-07', status: 'Active', riskLevel: 'High', avatar: 'TB', joinDate: '2022-08-14', completedCourses: 4, phishingClicks: 2, mfaEnabled: true },
  { id: 6, name: 'Morgan Chen', email: 'morgan.chen@company.com', department: 'HR', role: 'Manager', securityScore: 62, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Medium', avatar: 'MC', joinDate: '2021-09-05', completedCourses: 7, phishingClicks: 0, mfaEnabled: true },
  { id: 7, name: 'Riley Scott', email: 'riley.scott@company.com', department: 'Marketing', role: 'Employee', securityScore: 65, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Medium', avatar: 'RS', joinDate: '2023-01-17', completedCourses: 6, phishingClicks: 1, mfaEnabled: true },
  { id: 8, name: 'Jamie Foster', email: 'jamie.foster@company.com', department: 'Finance', role: 'Employee', securityScore: 67, lastLogin: '2026-05-06', status: 'Active', riskLevel: 'Medium', avatar: 'JF', joinDate: '2022-05-30', completedCourses: 6, phishingClicks: 0, mfaEnabled: false },
  { id: 9, name: 'Drew Patel', email: 'drew.patel@company.com', department: 'Sales', role: 'Employee', securityScore: 71, lastLogin: '2026-05-07', status: 'Active', riskLevel: 'Medium', avatar: 'DP', joinDate: '2023-11-03', completedCourses: 7, phishingClicks: 1, mfaEnabled: true },
  { id: 10, name: 'Quinn Adams', email: 'quinn.adams@company.com', department: 'Engineering', role: 'Employee', securityScore: 75, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Medium', avatar: 'QA', joinDate: '2021-04-22', completedCourses: 9, phishingClicks: 1, mfaEnabled: true },
  { id: 11, name: 'Avery Wilson', email: 'avery.wilson@company.com', department: 'Engineering', role: 'Employee', securityScore: 82, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Low', avatar: 'AW', joinDate: '2020-07-11', completedCourses: 11, phishingClicks: 0, mfaEnabled: true },
  { id: 12, name: 'Blake Turner', email: 'blake.turner@company.com', department: 'HR', role: 'Employee', securityScore: 84, lastLogin: '2026-05-07', status: 'Active', riskLevel: 'Low', avatar: 'BT', joinDate: '2021-12-08', completedCourses: 12, phishingClicks: 0, mfaEnabled: true },
  { id: 13, name: 'Cameron Ross', email: 'cameron.ross@company.com', department: 'Finance', role: 'Manager', securityScore: 88, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Low', avatar: 'CR', joinDate: '2019-03-25', completedCourses: 14, phishingClicks: 0, mfaEnabled: true },
  { id: 14, name: 'Dana Mitchell', email: 'dana.mitchell@company.com', department: 'Engineering', role: 'Admin', securityScore: 94, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Low', avatar: 'DM', joinDate: '2018-06-01', completedCourses: 16, phishingClicks: 0, mfaEnabled: true },
  { id: 15, name: 'Elliott Barnes', email: 'elliott.barnes@company.com', department: 'Marketing', role: 'Employee', securityScore: 56, lastLogin: '2026-04-30', status: 'Inactive', riskLevel: 'Medium', avatar: 'EB', joinDate: '2022-02-18', completedCourses: 5, phishingClicks: 1, mfaEnabled: false },
  { id: 16, name: 'Finley Cooper', email: 'finley.cooper@company.com', department: 'Sales', role: 'Employee', securityScore: 48, lastLogin: '2026-04-15', status: 'Inactive', riskLevel: 'High', avatar: 'FC', joinDate: '2023-08-09', completedCourses: 3, phishingClicks: 2, mfaEnabled: false },
  { id: 17, name: 'Gray Nelson', email: 'gray.nelson@company.com', department: 'HR', role: 'Manager', securityScore: 91, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Low', avatar: 'GN', joinDate: '2017-11-14', completedCourses: 18, phishingClicks: 0, mfaEnabled: true },
  { id: 18, name: 'Harper Stone', email: 'harper.stone@company.com', department: 'Finance', role: 'Employee', securityScore: 78, lastLogin: '2026-05-07', status: 'Active', riskLevel: 'Medium', avatar: 'HS', joinDate: '2022-09-27', completedCourses: 8, phishingClicks: 1, mfaEnabled: true },
  { id: 19, name: 'Indigo Clark', email: 'indigo.clark@company.com', department: 'Engineering', role: 'Employee', securityScore: 86, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Low', avatar: 'IC', joinDate: '2020-05-19', completedCourses: 13, phishingClicks: 0, mfaEnabled: true },
  { id: 20, name: 'Jesse Wright', email: 'jesse.wright@company.com', department: 'Marketing', role: 'Employee', securityScore: 61, lastLogin: '2026-05-06', status: 'Active', riskLevel: 'Medium', avatar: 'JW', joinDate: '2023-07-04', completedCourses: 6, phishingClicks: 1, mfaEnabled: true },
  { id: 21, name: 'Kendall Hayes', email: 'kendall.hayes@company.com', department: 'Sales', role: 'Employee', securityScore: 73, lastLogin: '2026-05-07', status: 'Active', riskLevel: 'Medium', avatar: 'KH', joinDate: '2024-02-12', completedCourses: 7, phishingClicks: 0, mfaEnabled: true },
  { id: 22, name: 'Lane Flores', email: 'lane.flores@company.com', department: 'HR', role: 'Employee', securityScore: 89, lastLogin: '2026-05-08', status: 'Active', riskLevel: 'Low', avatar: 'LF', joinDate: '2021-01-30', completedCourses: 14, phishingClicks: 0, mfaEnabled: true },
];

const departments = ['All', 'Engineering', 'Marketing', 'Finance', 'HR', 'Sales'];
const roles = ['All', 'Admin', 'Manager', 'Employee'];
const statuses = ['All', 'Active', 'Inactive'];
const riskLevels = ['All', 'Low', 'Medium', 'High'];

// ─── Helper Components ────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-green-100 text-green-700'
      : score >= 60
      ? 'bg-orange-100 text-orange-600'
      : 'bg-red-100 text-red-600';
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>{score}</span>
  );
}

function StatusChip({ status }: { status: 'Active' | 'Inactive' }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        status === 'Active'
          ? 'bg-green-50 text-green-600'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      {status}
    </span>
  );
}

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const colors = {
    Low: 'bg-green-50 text-green-600',
    Medium: 'bg-yellow-50 text-yellow-600',
    High: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[level]}`}>
      {level}
    </span>
  );
}

function AvatarCircle({ initials }: { initials: string }) {
  const colors = ['bg-orange-400', 'bg-blue-400', 'bg-purple-400', 'bg-teal-400', 'bg-pink-400'];
  const idx = initials.charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

interface UserModalProps {
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  initial?: User | null;
}

function UserModal({ onClose, onSave, initial }: UserModalProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    department: initial?.department ?? 'Engineering',
    role: initial?.role ?? 'Employee',
    sendWelcome: true,
  });

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {[
          { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
          { label: 'Email Address', key: 'email', type: 'email', placeholder: 'jane@company.com' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              {label}
            </label>
            <input
              type={type}
              value={(form as Record<string, string>)[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Department
            </label>
            <select
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {departments.filter((d) => d !== 'All').map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {roles.filter((r) => r !== 'All').map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {!initial && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.sendWelcome}
              onChange={(e) => set('sendWelcome', e.target.checked)}
              className="accent-orange-500 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Send welcome email with login instructions</span>
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
          >
            {initial ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

function UserDetailPanel({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-40 flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">User Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-white text-xl font-bold">
            {user.avatar}
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <StatusChip status={user.status} />
            <RiskBadge level={user.riskLevel} />
          </div>
        </div>

        {[
          { icon: <Building2 size={14} />, label: 'Department', value: user.department },
          { icon: <Shield size={14} />, label: 'Role', value: user.role },
          { icon: <Calendar size={14} />, label: 'Joined', value: user.joinDate },
          { icon: <Calendar size={14} />, label: 'Last Login', value: user.lastLogin },
          { icon: <Mail size={14} />, label: 'Email', value: user.email },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-gray-400">{icon}</span>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-medium text-gray-800">{value}</p>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Security Profile</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Security Score</span>
            <ScoreBadge score={user.securityScore} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Courses Completed</span>
            <span className="text-sm font-bold text-gray-800">{user.completedCourses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Phishing Clicks</span>
            <span className={`text-sm font-bold ${user.phishingClicks > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {user.phishingClicks}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">MFA Enabled</span>
            {user.mfaEnabled ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <X size={16} className="text-red-500" />
            )}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
          Assign Training
        </button>
        <button className="w-full border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-semibold hover:bg-gray-50 transition-colors">
          Send Password Reset
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (filterRole !== 'All' && u.role !== filterRole) return false;
      if (filterDept !== 'All' && u.department !== filterDept) return false;
      if (filterStatus !== 'All' && u.status !== filterStatus) return false;
      if (filterRisk !== 'All' && u.riskLevel !== filterRisk) return false;
      return true;
    });
  }, [users, search, filterRole, filterDept, filterStatus, filterRisk]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    inactive: users.filter((u) => u.status === 'Inactive').length,
    admin: users.filter((u) => u.role === 'Admin').length,
  }), [users]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((u) => u.id)));
    }
  };

  const handleAdd = (data: Partial<User>) => {
    const newUser: User = {
      id: Date.now(),
      name: data.name ?? '',
      email: data.email ?? '',
      department: data.department ?? 'Engineering',
      role: (data.role as User['role']) ?? 'Employee',
      securityScore: 50,
      lastLogin: 'Never',
      status: 'Active',
      riskLevel: 'Medium',
      avatar: (data.name ?? 'U').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
      joinDate: new Date().toISOString().split('T')[0],
      completedCourses: 0,
      phishingClicks: 0,
      mfaEnabled: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    setAddOpen(false);
  };

  const handleEdit = (data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editUser?.id ? { ...u, ...data } : u))
    );
    setEditUser(null);
  };

  const handleDeactivate = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all platform users and their access</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Upload size={15} />
            Import CSV
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={15} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Users size={18} />, label: 'Total Users', value: counts.total, color: 'text-gray-700' },
          { icon: <Check size={18} />, label: 'Active', value: counts.active, color: 'text-green-600' },
          { icon: <UserX size={18} />, label: 'Inactive', value: counts.inactive, color: 'text-gray-400' },
          { icon: <Shield size={18} />, label: 'Admins', value: counts.admin, color: 'text-orange-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <span className={`p-2 bg-gray-50 rounded-lg ${s.color}`}>{s.icon}</span>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        {[
          { label: 'Role', value: filterRole, opts: roles, setter: setFilterRole },
          { label: 'Department', value: filterDept, opts: departments, setter: setFilterDept },
          { label: 'Status', value: filterStatus, opts: statuses, setter: setFilterStatus },
          { label: 'Risk', value: filterRisk, opts: riskLevels, setter: setFilterRisk },
        ].map(({ label, value, opts, setter }) => (
          <select
            key={label}
            value={value}
            onChange={(e) => { setter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            {opts.map((o) => (
              <option key={o} value={o}>{label}: {o}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-orange-700">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            {[
              { icon: <CheckSquare size={14} />, label: 'Assign Training' },
              { icon: <Download size={14} />, label: 'Export Selected' },
              { icon: <UserX size={14} />, label: 'Deactivate Selected' },
            ].map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-1.5 bg-white border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors"
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paged.length && paged.length > 0}
                    onChange={toggleAll}
                    className="accent-orange-500 w-4 h-4"
                  />
                </th>
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Department</th>
                <th className="py-3 pr-4 font-semibold hidden sm:table-cell">Role</th>
                <th className="py-3 pr-4 font-semibold">Score</th>
                <th className="py-3 pr-4 font-semibold hidden lg:table-cell">Last Login</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setDetailUser(u)}
                >
                  <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="accent-orange-500 w-4 h-4"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <AvatarCircle initials={u.avatar} />
                      <div>
                        <p className="font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 hidden md:table-cell">{u.department}</td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.role === 'Admin' ? 'bg-purple-50 text-purple-600' : u.role === 'Manager' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <ScoreBadge score={u.securityScore} />
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs hidden lg:table-cell">{u.lastLogin}</td>
                  <td className="py-3 pr-4">
                    <StatusChip status={u.status} />
                  </td>
                  <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditUser(u)}
                        className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeactivate(u.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deactivate"
                      >
                        <UserX size={14} />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <KeyRound size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <AlertTriangle size={24} className="mx-auto mb-2 text-gray-300" />
                    No users match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  n === page ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {addOpen && <UserModal onClose={() => setAddOpen(false)} onSave={handleAdd} />}
      {editUser && <UserModal onClose={() => setEditUser(null)} onSave={handleEdit} initial={editUser} />}
      {detailUser && <UserDetailPanel user={detailUser} onClose={() => setDetailUser(null)} />}
    </div>
  );
}
