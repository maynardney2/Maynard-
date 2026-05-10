import { useState } from 'react';
import {
  Fish,
  Plus,
  Mail,
  MessageSquare,
  QrCode,
  Users,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Eye,
  Target,
  Megaphone,
  Clock,
  BarChart2,
  BookOpen,
  Shield,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignStatus = 'Active' | 'Completed' | 'Scheduled';
type CampaignType = 'Email' | 'SMS' | 'QR';

interface Campaign {
  id: number;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  sent: number;
  target: number;
  clicked: number;
  reported: number;
  notPhished: number;
  date: string;
  template: string;
  department: string;
}

interface Template {
  id: number;
  name: string;
  type: CampaignType;
  category: string;
  difficulty: string;
  preview: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Q2 CEO Wire Transfer', type: 'Email', status: 'Active', sent: 85, target: 85, clicked: 19, reported: 32, notPhished: 34, date: '2026-05-01', template: 'CEO Impersonation', department: 'Finance' },
  { id: 2, name: 'IT Password Expiry', type: 'Email', status: 'Active', sent: 120, target: 200, clicked: 11, reported: 54, notPhished: 55, date: '2026-05-03', template: 'IT Helpdesk', department: 'All' },
  { id: 3, name: 'DocuSign Invoice Fake', type: 'Email', status: 'Completed', sent: 210, target: 210, clicked: 38, reported: 116, notPhished: 56, date: '2026-04-15', template: 'DocuSign Lure', department: 'Finance' },
  { id: 4, name: 'Q1 LinkedIn Spear Phish', type: 'Email', status: 'Completed', sent: 247, target: 247, clicked: 35, reported: 153, notPhished: 59, date: '2026-03-22', template: 'LinkedIn Notification', department: 'All' },
  { id: 5, name: 'QR Code Lobby Drop', type: 'QR', status: 'Completed', sent: 120, target: 120, clicked: 8, reported: 52, notPhished: 60, date: '2026-02-10', template: 'QR Redirect', department: 'Engineering' },
  { id: 6, name: 'CEO Wire Transfer SMS', type: 'SMS', status: 'Completed', sent: 85, target: 85, clicked: 19, reported: 32, notPhished: 34, date: '2026-01-18', template: 'SMS Urgency', department: 'Sales' },
  { id: 7, name: 'June All-Staff Awareness', type: 'Email', status: 'Scheduled', sent: 0, target: 247, clicked: 0, reported: 0, notPhished: 0, date: '2026-06-01', template: 'Fake HR Announcement', department: 'All' },
];

const templates: Template[] = [
  { id: 1, name: 'CEO Impersonation', type: 'Email', category: 'Spear Phish', difficulty: 'Hard', preview: 'Urgent wire transfer request from CFO impersonation asking for immediate action.' },
  { id: 2, name: 'IT Helpdesk Alert', type: 'Email', category: 'Credential Harvest', difficulty: 'Medium', preview: 'Your password expires in 24 hours. Click here to update your credentials immediately.' },
  { id: 3, name: 'DocuSign Lure', type: 'Email', category: 'Document Lure', difficulty: 'Medium', preview: 'You have a document pending signature. Action required by end of business today.' },
  { id: 4, name: 'LinkedIn Notification', type: 'Email', category: 'Social Media', difficulty: 'Easy', preview: "Someone viewed your profile! See who's been looking at your professional information." },
  { id: 5, name: 'Package Delivery', type: 'Email', category: 'Consumer Lure', difficulty: 'Easy', preview: 'Your package could not be delivered. Reschedule delivery by clicking the link below.' },
  { id: 6, name: 'Microsoft 365 Login', type: 'Email', category: 'Credential Harvest', difficulty: 'Hard', preview: 'Your Microsoft 365 session has expired. Sign in again to continue accessing your files.' },
  { id: 7, name: 'HR Benefits Update', type: 'Email', category: 'Internal Impersonation', difficulty: 'Medium', preview: 'Action required: Update your benefits enrollment before the open enrollment period ends.' },
  { id: 8, name: 'QR Code Free Gift', type: 'QR', category: 'QR Phishing', difficulty: 'Medium', preview: 'Scan to claim your employee appreciation gift card from company rewards program.' },
  { id: 9, name: 'SMS Urgency', type: 'SMS', category: 'Smishing', difficulty: 'Hard', preview: 'ALERT: Your account has been locked. Verify identity within 2 hours to avoid suspension.' },
  { id: 10, name: 'Fake HR Announcement', type: 'Email', category: 'Internal Impersonation', difficulty: 'Easy', preview: 'Important company announcement regarding upcoming policy changes and required actions.' },
];

const clickTrend = [
  { month: 'Nov', rate: 18 },
  { month: 'Dec', rate: 16 },
  { month: 'Jan', rate: 15 },
  { month: 'Feb', rate: 14 },
  { month: 'Mar', rate: 14 },
  { month: 'Apr', rate: 12 },
];

const deptVulnerability = [
  { dept: 'Sales', clickRate: 22 },
  { dept: 'Finance', clickRate: 18 },
  { dept: 'Marketing', clickRate: 15 },
  { dept: 'Engineering', clickRate: 8 },
  { dept: 'HR', clickRate: 6 },
];

const perUserResults = [
  { name: 'Jordan Lee', dept: 'Sales', clicked: true, reported: false, timeToClick: '3 min' },
  { name: 'Alex Morgan', dept: 'Marketing', clicked: true, reported: false, timeToClick: '8 min' },
  { name: 'Taylor Brooks', dept: 'Sales', clicked: true, reported: false, timeToClick: '1 min' },
  { name: 'Sam Rivera', dept: 'Engineering', clicked: false, reported: true, timeToClick: '-' },
  { name: 'Casey Kim', dept: 'Finance', clicked: false, reported: true, timeToClick: '-' },
  { name: 'Morgan Chen', dept: 'HR', clicked: false, reported: true, timeToClick: '-' },
];

const educationalResources = [
  { id: 1, title: 'How to Identify Phishing Emails', type: 'Article', duration: '5 min read' },
  { id: 2, title: 'Phishing Awareness — Quick Course', type: 'Course', duration: '15 min' },
  { id: 3, title: 'Reporting Security Incidents', type: 'Video', duration: '3 min watch' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: CampaignType }) {
  if (type === 'SMS') return <MessageSquare size={14} className="text-purple-500" />;
  if (type === 'QR') return <QrCode size={14} className="text-teal-500" />;
  return <Mail size={14} className="text-blue-500" />;
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const styles: Record<CampaignStatus, string> = {
    Active: 'bg-green-50 text-green-600',
    Completed: 'bg-gray-100 text-gray-500',
    Scheduled: 'bg-blue-50 text-blue-600',
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
}

function ProgressBar({ value, total, color = 'bg-orange-500' }: { value: number; total: number; color?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Campaign Wizard ──────────────────────────────────────────────────────────

const STEP_LABELS = ['Campaign', 'Targets', 'Schedule', 'Review'];

function CampaignWizard({ onClose, onLaunch }: { onClose: () => void; onLaunch: (c: Partial<Campaign>) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    type: 'Email' as CampaignType,
    templateId: 1,
    targetMode: 'all',
    departments: new Set<string>(),
    scheduleMode: 'now',
    scheduledDate: '',
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const selectedTemplate = templates.find((t) => t.id === form.templateId);
  const depts = ['Engineering', 'Marketing', 'Finance', 'HR', 'Sales'];

  const steps = [
    // Step 0: Campaign details
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Campaign Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Q3 Credential Harvest Test"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Campaign Type</label>
        <div className="flex gap-3">
          {(['Email', 'SMS', 'QR'] as CampaignType[]).map((t) => (
            <button
              key={t}
              onClick={() => set('type', t)}
              className={`flex-1 flex flex-col items-center gap-1.5 border-2 rounded-xl py-3 transition-colors text-sm font-semibold ${
                form.type === t ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <TypeIcon type={t} />
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Select Template</label>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {templates.filter((t) => t.type === form.type).map((t) => (
            <button
              key={t.id}
              onClick={() => set('templateId', t.id)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${
                form.templateId === t.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-gray-800 text-sm">{t.name}</span>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  t.difficulty === 'Hard' ? 'bg-red-50 text-red-500' : t.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                }`}>{t.difficulty}</span>
              </div>
              <p className="text-xs text-gray-400">{t.preview}</p>
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 1: Targets
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Target Selection</label>
        {[
          { value: 'all', label: 'All Users (247 employees)', icon: <Users size={15} /> },
          { value: 'department', label: 'By Department', icon: <Target size={15} /> },
          { value: 'custom', label: 'Custom Selection', icon: <BarChart2 size={15} /> },
        ].map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => set('targetMode', value)}
            className={`w-full mb-2 flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-sm font-semibold ${
              form.targetMode === value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-600 hover:border-gray-200'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
      {form.targetMode === 'department' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">Select departments:</p>
          {depts.map((d) => (
            <label key={d} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form.departments.has(d)}
                onChange={() => {
                  const next = new Set(form.departments);
                  next.has(d) ? next.delete(d) : next.add(d);
                  set('departments', next);
                }}
                className="accent-orange-500 w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">{d}</span>
            </label>
          ))}
        </div>
      )}
    </div>,

    // Step 2: Schedule
    <div className="space-y-4">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Send Timing</label>
      {[
        { value: 'now', label: 'Send Immediately', icon: <Megaphone size={15} /> },
        { value: 'schedule', label: 'Schedule for Later', icon: <Calendar size={15} /> },
      ].map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => set('scheduleMode', value)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-sm font-semibold ${
            form.scheduleMode === value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-600 hover:border-gray-200'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
      {form.scheduleMode === 'schedule' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Schedule Date & Time</label>
          <input
            type="datetime-local"
            value={form.scheduledDate}
            onChange={(e) => set('scheduledDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      )}
    </div>,

    // Step 3: Review
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Campaign Summary</p>
        {[
          { label: 'Name', value: form.name || '(not set)' },
          { label: 'Type', value: form.type },
          { label: 'Template', value: selectedTemplate?.name ?? '(none)' },
          { label: 'Targets', value: form.targetMode === 'all' ? 'All 247 users' : form.targetMode === 'department' ? `${form.departments.size} dept(s)` : 'Custom selection' },
          { label: 'Schedule', value: form.scheduleMode === 'now' ? 'Send Immediately' : form.scheduledDate || 'TBD' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
        <AlertTriangle size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-700">
          This simulation will send realistic phishing emails to real employees. Ensure this campaign has been approved by your security team.
        </p>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Launch New Campaign</h2>
            <p className="text-xs text-gray-400">Step {step + 1} of 4 — {STEP_LABELS[step]}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-50">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? 'bg-orange-500 text-white' : i === step ? 'bg-orange-100 text-orange-600 border-2 border-orange-400' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <CheckCircle size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-orange-600' : 'text-gray-400'}`}>{label}</span>
              {i < STEP_LABELS.length - 1 && <div className="flex-1 h-px bg-gray-100" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">{steps[step]}</div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={() => step === 0 ? onClose() : setStep((s) => s - 1)}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={14} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => {
              if (step < 3) {
                setStep((s) => s + 1);
              } else {
                onLaunch({ name: form.name, type: form.type, status: form.scheduleMode === 'now' ? 'Active' : 'Scheduled' });
                onClose();
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
          >
            {step < 3 ? <>Next <ChevronRight size={14} /></> : '🚀 Launch Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drill-down Modal ─────────────────────────────────────────────────────────

function CampaignDrilldown({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{campaign.name}</h2>
            <p className="text-xs text-gray-400">Per-user results — {campaign.date}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 pl-4 pr-4 font-semibold">Employee</th>
                <th className="py-3 pr-4 font-semibold">Department</th>
                <th className="py-3 pr-4 font-semibold">Clicked</th>
                <th className="py-3 pr-4 font-semibold">Reported</th>
                <th className="py-3 pr-4 font-semibold">Time to Click</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {perUserResults.map((r) => (
                <tr key={r.name} className="hover:bg-gray-50">
                  <td className="py-3 pl-4 pr-4 font-semibold text-gray-800">{r.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{r.dept}</td>
                  <td className="py-3 pr-4">
                    {r.clicked
                      ? <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Clicked</span>
                      : <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Safe</span>}
                  </td>
                  <td className="py-3 pr-4">
                    {r.reported
                      ? <CheckCircle size={14} className="text-green-500" />
                      : <X size={14} className="text-gray-300" />}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{r.timeToClick}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PhishingSimulation() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [drilldown, setDrilldown] = useState<Campaign | null>(null);

  const active = campaigns.filter((c) => c.status === 'Active');
  const history = campaigns.filter((c) => c.status !== 'Active');

  const handleLaunch = (data: Partial<Campaign>) => {
    setCampaigns((prev) => [
      {
        id: Date.now(),
        name: data.name ?? 'New Campaign',
        type: data.type ?? 'Email',
        status: data.status ?? 'Active',
        sent: data.status === 'Active' ? 0 : 0,
        target: 247,
        clicked: 0,
        reported: 0,
        notPhished: 0,
        date: new Date().toISOString().split('T')[0],
        template: 'TBD',
        department: 'All',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phishing Simulations</h1>
          <p className="text-sm text-gray-400 mt-0.5">Design, launch, and analyze phishing awareness campaigns</p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={15} />
          Launch New Campaign
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Target size={18} />, label: 'Total Campaigns', value: campaigns.length, color: 'text-gray-700' },
          { icon: <Fish size={18} />, label: 'Overall Click Rate', value: '12%', color: 'text-red-500' },
          { icon: <Shield size={18} />, label: 'Report Rate', value: '58%', color: 'text-green-600' },
          { icon: <TrendingDown size={18} />, label: 'YoY Improvement', value: '-6%', color: 'text-orange-500' },
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

      {/* Active Campaigns */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Active Campaigns
        </h2>
        {active.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            <Fish size={32} className="mx-auto mb-2 text-gray-200" />
            No active campaigns. Launch one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TypeIcon type={c.type} />
                      <span className="text-xs text-gray-400">{c.type}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <button onClick={() => setDrilldown(c)} className="text-xs text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">
                    <Eye size={12} />
                    Details
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Sent Progress</span>
                      <span>{c.sent} / {c.target}</span>
                    </div>
                    <ProgressBar value={c.sent} total={c.target} color="bg-blue-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Clicked</span>
                      <span>{c.clicked} employees</span>
                    </div>
                    <ProgressBar value={c.clicked} total={c.sent} color="bg-red-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Reported</span>
                      <span>{c.reported} employees</span>
                    </div>
                    <ProgressBar value={c.reported} total={c.sent} color="bg-green-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-green-500" />
            Click Rate Trend (6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={clickTrend} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="%" />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Click Rate']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="rate" stroke="#F97316" strokeWidth={3} dot={{ fill: '#F97316', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-400" />
            Most Vulnerable Departments
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptVulnerability} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="%" />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 12, fill: '#9CA3AF' }} width={80} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Click Rate']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="clickRate" fill="#F97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign History Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Campaign History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 pl-4 pr-4 font-semibold">Campaign</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Date</th>
                <th className="py-3 pr-4 font-semibold">Sent</th>
                <th className="py-3 pr-4 font-semibold">Click Rate</th>
                <th className="py-3 pr-4 font-semibold">Report Rate</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((c) => {
                const clickRate = c.sent > 0 ? Math.round((c.clicked / c.sent) * 100) : 0;
                const reportRate = c.sent > 0 ? Math.round((c.reported / c.sent) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-4 pr-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon type={c.type} />
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 hidden md:table-cell">
                      <span className="flex items-center gap-1"><Clock size={11} />{c.date}</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{c.sent}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-semibold text-sm ${clickRate <= 10 ? 'text-green-600' : clickRate <= 15 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {clickRate}%
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-sm text-green-600">{reportRate}%</span>
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                    <td className="py-3 pr-4">
                      <button onClick={() => setDrilldown(c)} className="text-xs text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-1">
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <BookOpen size={16} className="text-orange-500" />
          Educational Resources
        </h2>
        <p className="text-xs text-gray-400 mb-4">Send to employees who clicked during simulations</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {educationalResources.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  r.type === 'Course' ? 'bg-blue-50 text-blue-600' : r.type === 'Video' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                }`}>{r.type}</span>
                <span className="text-xs text-gray-400">{r.duration}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{r.title}</p>
            </div>
          ))}
        </div>
      </div>

      {wizardOpen && <CampaignWizard onClose={() => setWizardOpen(false)} onLaunch={handleLaunch} />}
      {drilldown && <CampaignDrilldown campaign={drilldown} onClose={() => setDrilldown(null)} />}
    </div>
  );
}
