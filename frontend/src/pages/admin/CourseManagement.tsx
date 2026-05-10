import { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Archive,
  Users,
  BarChart2,
  Star,
  X,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CourseStatus = 'Published' | 'Draft' | 'Archived';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  modules: number;
  enrolled: number;
  completionPct: number;
  avgScore: number;
  status: CourseStatus;
  difficulty: Difficulty;
  duration: string;
  required: boolean;
  xpReward: number;
  createdAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialCourses: Course[] = [
  { id: 1, title: 'Phishing Awareness Fundamentals', category: 'Phishing', description: 'Learn to identify and report phishing emails and social engineering attacks.', modules: 6, enrolled: 247, completionPct: 84, avgScore: 78, status: 'Published', difficulty: 'Beginner', duration: '45 min', required: true, xpReward: 200, createdAt: '2025-11-10' },
  { id: 2, title: 'Password Security & MFA', category: 'Access Control', description: 'Best practices for creating strong passwords and enabling multi-factor authentication.', modules: 4, enrolled: 247, completionPct: 91, avgScore: 82, status: 'Published', difficulty: 'Beginner', duration: '30 min', required: true, xpReward: 150, createdAt: '2025-10-05' },
  { id: 3, title: 'Advanced Threat Awareness', category: 'Threat Intelligence', description: 'Deep dive into APTs, ransomware, and advanced persistent threats affecting enterprises.', modules: 8, enrolled: 180, completionPct: 62, avgScore: 71, status: 'Published', difficulty: 'Advanced', duration: '90 min', required: false, xpReward: 350, createdAt: '2025-09-20' },
  { id: 4, title: 'Data Classification & Handling', category: 'Data Privacy', description: 'Understand how to classify, handle, and protect sensitive organizational data.', modules: 5, enrolled: 203, completionPct: 76, avgScore: 75, status: 'Published', difficulty: 'Intermediate', duration: '60 min', required: true, xpReward: 250, createdAt: '2025-08-14' },
  { id: 5, title: 'Social Engineering Defense', category: 'Phishing', description: 'Recognize and respond to vishing, smishing, and in-person social engineering attacks.', modules: 5, enrolled: 165, completionPct: 58, avgScore: 69, status: 'Published', difficulty: 'Intermediate', duration: '50 min', required: false, xpReward: 220, createdAt: '2025-12-01' },
  { id: 6, title: 'Secure Remote Work Practices', category: 'Endpoint Security', description: 'Protect company assets when working from home or remote locations.', modules: 4, enrolled: 230, completionPct: 88, avgScore: 84, status: 'Published', difficulty: 'Beginner', duration: '35 min', required: true, xpReward: 160, createdAt: '2025-07-22' },
  { id: 7, title: 'Incident Response Basics', category: 'Incident Response', description: 'Step-by-step guide on what to do when you suspect a security incident.', modules: 6, enrolled: 140, completionPct: 54, avgScore: 72, status: 'Published', difficulty: 'Intermediate', duration: '55 min', required: false, xpReward: 240, createdAt: '2026-01-08' },
  { id: 8, title: 'GDPR & Privacy Compliance', category: 'Compliance', description: 'Understand GDPR obligations, data subject rights, and privacy-by-design principles.', modules: 7, enrolled: 210, completionPct: 79, avgScore: 80, status: 'Published', difficulty: 'Intermediate', duration: '70 min', required: true, xpReward: 280, createdAt: '2025-06-15' },
  { id: 9, title: 'Cloud Security Essentials', category: 'Cloud Security', description: 'Security configurations and best practices for AWS, Azure, and GCP environments.', modules: 9, enrolled: 98, completionPct: 43, avgScore: 66, status: 'Published', difficulty: 'Advanced', duration: '100 min', required: false, xpReward: 400, createdAt: '2026-02-19' },
  { id: 10, title: 'Zero Trust Architecture', category: 'Network Security', description: 'Introduction to zero-trust principles and implementation strategies.', modules: 7, enrolled: 85, completionPct: 38, avgScore: 64, status: 'Draft', difficulty: 'Advanced', duration: '85 min', required: false, xpReward: 380, createdAt: '2026-04-01' },
  { id: 11, title: 'Secure Coding for Developers', category: 'Application Security', description: 'OWASP Top 10, input validation, secure SDLC practices for engineering teams.', modules: 10, enrolled: 52, completionPct: 71, avgScore: 77, status: 'Draft', difficulty: 'Advanced', duration: '120 min', required: false, xpReward: 450, createdAt: '2026-03-28' },
  { id: 12, title: 'Security Policy Acknowledgment 2024', category: 'Compliance', description: 'Annual security policy review and digital acknowledgment.', modules: 2, enrolled: 247, completionPct: 95, avgScore: 90, status: 'Archived', difficulty: 'Beginner', duration: '15 min', required: true, xpReward: 50, createdAt: '2024-01-15' },
];

const categories = ['All', 'Phishing', 'Access Control', 'Threat Intelligence', 'Data Privacy', 'Endpoint Security', 'Incident Response', 'Compliance', 'Cloud Security', 'Network Security', 'Application Security'];
const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const tabOptions: (CourseStatus | 'All')[] = ['All', 'Published', 'Draft', 'Archived'];

// ─── Helper ───────────────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: Difficulty }) {
  const styles = {
    Beginner: 'bg-green-50 text-green-600',
    Intermediate: 'bg-yellow-50 text-yellow-600',
    Advanced: 'bg-red-50 text-red-600',
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[level]}`}>{level}</span>;
}

function StatusChip({ status }: { status: CourseStatus }) {
  const styles: Record<CourseStatus, string> = {
    Published: 'bg-green-50 text-green-600',
    Draft: 'bg-yellow-50 text-yellow-600',
    Archived: 'bg-gray-100 text-gray-500',
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
}

function CompletionBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-orange-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Course Modal ─────────────────────────────────────────────────────────────

interface CourseModalProps {
  onClose: () => void;
  onSave: (data: Partial<Course>) => void;
  initial?: Course | null;
}

function CourseModal({ onClose, onSave, initial }: CourseModalProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    category: initial?.category ?? 'Phishing',
    difficulty: initial?.difficulty ?? 'Beginner',
    duration: initial?.duration ?? '30 min',
    required: initial?.required ?? false,
    xpReward: initial?.xpReward ?? 100,
  });

  const set = (k: string, v: string | boolean | number) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Course Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Phishing Awareness Fundamentals"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="Brief description of what employees will learn..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {categories.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => set('difficulty', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {difficulties.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => set('duration', e.target.value)}
              placeholder="e.g. 45 min"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">XP Reward</label>
            <input
              type="number"
              value={form.xpReward}
              onChange={(e) => set('xpReward', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.required}
            onChange={(e) => set('required', e.target.checked)}
            className="accent-orange-500 w-4 h-4"
          />
          <span className="text-sm text-gray-700">Mark as required training for all users</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
            {initial ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Assign Modal ────────────────────────────────────────────────────────

function BulkAssignModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const depts = ['Engineering', 'Marketing', 'Finance', 'HR', 'Sales'];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (d: string) => setSelected((p) => { const n = new Set(p); n.has(d) ? n.delete(d) : n.add(d); return n; });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Assign to Department</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-sm text-gray-500">Assign <span className="font-semibold text-gray-800">{course.title}</span> to departments:</p>
        <div className="space-y-2">
          {depts.map((d) => (
            <label key={d} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input type="checkbox" checked={selected.has(d)} onChange={() => toggle(d)} className="accent-orange-500 w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">{d}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
            Assign ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [activeTab, setActiveTab] = useState<CourseStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [assignCourse, setAssignCourse] = useState<Course | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (activeTab !== 'All' && c.status !== activeTab) return false;
      if (filterCat !== 'All' && c.category !== filterCat) return false;
      if (filterDiff !== 'All' && c.difficulty !== filterDiff) return false;
      const q = search.toLowerCase();
      if (q && !c.title.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [courses, activeTab, filterCat, filterDiff, search]);

  const stats = useMemo(() => {
    const published = courses.filter((c) => c.status === 'Published');
    const mostPopular = [...published].sort((a, b) => b.enrolled - a.enrolled)[0];
    const lowestCompletion = [...published].sort((a, b) => a.completionPct - b.completionPct)[0];
    return { mostPopular, lowestCompletion };
  }, [courses]);

  const handleCreate = (data: Partial<Course>) => {
    const newCourse: Course = {
      id: Date.now(),
      title: data.title ?? 'New Course',
      description: data.description ?? '',
      category: data.category ?? 'Phishing',
      difficulty: (data.difficulty as Difficulty) ?? 'Beginner',
      duration: data.duration ?? '30 min',
      required: data.required ?? false,
      xpReward: data.xpReward ?? 100,
      modules: 0,
      enrolled: 0,
      completionPct: 0,
      avgScore: 0,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses((prev) => [newCourse, ...prev]);
    setCreateOpen(false);
  };

  const handleEdit = (data: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === editCourse?.id ? { ...c, ...data } : c)));
    setEditCourse(null);
  };

  const handleArchive = (id: number) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Archived' as CourseStatus } : c)));
  };

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage security training content</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={15} />
          Create Course
        </button>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-green-50 rounded-xl">
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Most Popular Course</p>
            <p className="font-bold text-gray-800 text-sm">{stats.mostPopular?.title}</p>
            <p className="text-xs text-gray-400">{stats.mostPopular?.enrolled} enrolled · {stats.mostPopular?.completionPct}% completion</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-red-50 rounded-xl">
            <TrendingDown size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Lowest Completion Rate</p>
            <p className="font-bold text-gray-800 text-sm">{stats.lowestCompletion?.title}</p>
            <p className="text-xs text-gray-400">{stats.lowestCompletion?.enrolled} enrolled · {stats.lowestCompletion?.completionPct}% completion</p>
          </div>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100">
          {tabOptions.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                {tab === 'All' ? courses.length : courses.filter((c) => c.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 p-4 items-center border-b border-gray-50">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            {categories.map((c) => <option key={c} value={c}>Category: {c}</option>)}
          </select>
          <select
            value={filterDiff}
            onChange={(e) => setFilterDiff(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="All">Difficulty: All</option>
            {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 pl-4 pr-4 font-semibold">Title</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Category</th>
                <th className="py-3 pr-4 font-semibold hidden sm:table-cell">Modules</th>
                <th className="py-3 pr-4 font-semibold">Enrolled</th>
                <th className="py-3 pr-4 font-semibold min-w-32">Completion</th>
                <th className="py-3 pr-4 font-semibold hidden lg:table-cell">Avg Score</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <>
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                  >
                    <td className="py-3 pl-4 pr-4">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-orange-50 rounded-lg mt-0.5 flex-shrink-0">
                          <BookOpen size={13} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <DifficultyBadge level={c.difficulty} />
                            {c.required && (
                              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold">Required</span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Clock size={10} />{c.duration}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{c.category}</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 hidden sm:table-cell">{c.modules}</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Users size={12} className="text-gray-400" />
                        {c.enrolled}
                      </span>
                    </td>
                    <td className="py-3 pr-4 min-w-32">
                      <CompletionBar pct={c.completionPct} />
                    </td>
                    <td className="py-3 pr-4 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        {c.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 pr-4"><StatusChip status={c.status} /></td>
                    <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setAssignCourse(c)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Assign to Department"
                        >
                          <Users size={14} />
                        </button>
                        <button
                          onClick={() => setEditCourse(c)}
                          className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleArchive(c.id)}
                          className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        <ChevronDown
                          size={14}
                          className={`text-gray-300 transition-transform ${expandedRow === c.id ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </td>
                  </tr>
                  {expandedRow === c.id && (
                    <tr key={`exp-${c.id}`} className="bg-orange-50/30">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="flex flex-wrap gap-6">
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-gray-600 max-w-md">{c.description}</p>
                          </div>
                          <div className="flex gap-6">
                            <div>
                              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">XP Reward</p>
                              <p className="text-sm font-bold text-orange-500 flex items-center gap-1"><Zap size={13} />{c.xpReward} XP</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Created</p>
                              <p className="text-sm text-gray-600">{c.createdAt}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Avg Score</p>
                              <p className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                <BarChart2 size={13} className="text-gray-400" />
                                {c.avgScore}%
                              </p>
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
                    <CheckCircle size={24} className="mx-auto mb-2 text-gray-200" />
                    No courses match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && <CourseModal onClose={() => setCreateOpen(false)} onSave={handleCreate} />}
      {editCourse && <CourseModal onClose={() => setEditCourse(null)} onSave={handleEdit} initial={editCourse} />}
      {assignCourse && <BulkAssignModal course={assignCourse} onClose={() => setAssignCourse(null)} />}
    </div>
  );
}
