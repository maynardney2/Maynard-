import { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Users,
  Lock,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Circle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const complianceTrend = [
  { month: 'Jun', score: 71 },
  { month: 'Jul', score: 73 },
  { month: 'Aug', score: 74 },
  { month: 'Sep', score: 75 },
  { month: 'Oct', score: 76 },
  { month: 'Nov', score: 78 },
  { month: 'Dec', score: 79 },
  { month: 'Jan', score: 80 },
  { month: 'Feb', score: 81 },
  { month: 'Mar', score: 82 },
  { month: 'Apr', score: 84 },
  { month: 'May', score: 84 },
];

const deptCompliance = [
  { dept: 'HR', training: 95, phishing: 6, policy: 98, mfa: 100 },
  { dept: 'Engineering', training: 91, phishing: 8, policy: 94, mfa: 96 },
  { dept: 'Finance', training: 88, phishing: 18, policy: 92, mfa: 88 },
  { dept: 'Marketing', training: 74, phishing: 15, policy: 82, mfa: 76 },
  { dept: 'Sales', training: 63, phishing: 22, policy: 74, mfa: 68 },
];

const attentionEmployees = [
  { name: 'Jordan Lee', dept: 'Sales', issues: ['Overdue: 3 courses', 'Clicked 3 phish', 'No MFA', 'Policy unsigned'] },
  { name: 'Alex Morgan', dept: 'Marketing', issues: ['Overdue: 2 courses', 'No MFA'] },
  { name: 'Sam Rivera', dept: 'Engineering', issues: ['Overdue: 1 course', 'Clicked 2 phish'] },
  { name: 'Casey Kim', dept: 'Finance', issues: ['Overdue: 2 courses', 'Policy unsigned'] },
  { name: 'Finley Cooper', dept: 'Sales', issues: ['Inactive 23 days', 'Overdue: 4 courses'] },
];

const iso27001Controls = [
  { id: 'A.5', name: 'Info Security Policies', status: 'Compliant', score: 92 },
  { id: 'A.6', name: 'Organization of Info Sec', status: 'Compliant', score: 88 },
  { id: 'A.7', name: 'Human Resource Security', status: 'Partial', score: 74 },
  { id: 'A.8', name: 'Asset Management', status: 'Compliant', score: 85 },
  { id: 'A.9', name: 'Access Control', status: 'Partial', score: 71 },
  { id: 'A.12', name: 'Operations Security', status: 'Compliant', score: 90 },
  { id: 'A.16', name: 'Incident Management', status: 'Non-Compliant', score: 58 },
  { id: 'A.18', name: 'Compliance', status: 'Partial', score: 77 },
];

const soc2Criteria = [
  { name: 'Security', score: 87, status: 'Met' },
  { name: 'Availability', score: 92, status: 'Met' },
  { name: 'Processing Integrity', score: 79, status: 'Met' },
  { name: 'Confidentiality', score: 84, status: 'Met' },
  { name: 'Privacy', score: 76, status: 'Met' },
];

const pciRequirements = [
  { req: '1', name: 'Install Firewalls', status: 'Pass', score: 95 },
  { req: '2', name: 'No Vendor Defaults', status: 'Pass', score: 90 },
  { req: '3', name: 'Protect Cardholder Data', status: 'Pass', score: 88 },
  { req: '6', name: 'Secure Systems/Apps', status: 'Partial', score: 72 },
  { req: '8', name: 'Unique User IDs', status: 'Pass', score: 94 },
  { req: '12', name: 'Info Security Policy', status: 'Partial', score: 78 },
];

const radarData = [
  { subject: 'Training', value: 84 },
  { subject: 'Phishing', value: 88 },
  { subject: 'Policy Ack', value: 91 },
  { subject: 'MFA', value: 82 },
  { subject: 'Access Ctrl', value: 71 },
  { subject: 'Incidents', value: 58 },
];

const riskMatrix: { label: string; likelihood: 'Low' | 'Medium' | 'High'; impact: 'Low' | 'Medium' | 'High' }[] = [
  { label: 'Phishing Success', likelihood: 'High', impact: 'High' },
  { label: 'Password Reuse', likelihood: 'High', impact: 'Medium' },
  { label: 'Ransomware', likelihood: 'Medium', impact: 'High' },
  { label: 'Insider Threat', likelihood: 'Low', impact: 'High' },
  { label: 'MFA Bypass', likelihood: 'Medium', impact: 'Medium' },
  { label: 'Data Exfil', likelihood: 'Low', impact: 'High' },
  { label: 'Policy Non-Compliance', likelihood: 'Medium', impact: 'Low' },
  { label: 'Unpatched Systems', likelihood: 'High', impact: 'Medium' },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function CircleGauge({ score, size = 120 }: { score: number; size?: number }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? '#22C55E' : score >= 70 ? '#F97316' : '#EF4444';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-gray-900">{score}%</span>
        <span className="text-xs text-gray-400">Overall</span>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  target,
  met,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  target: string;
  met: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-orange-50 rounded-lg text-orange-500">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        {met ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : (
          <AlertTriangle size={16} className="text-red-400" />
        )}
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-black text-gray-900">{value}%</span>
        <span className="text-xs text-gray-400">Target: {target}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${met ? 'bg-green-500' : 'bg-orange-400'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Compliant: 'bg-green-500',
    Partial: 'bg-yellow-400',
    'Non-Compliant': 'bg-red-500',
    Pass: 'bg-green-500',
    Met: 'bg-green-500',
    Fail: 'bg-red-500',
  };
  return <span className={`w-2 h-2 rounded-full inline-block ${colors[status] ?? 'bg-gray-400'}`} />;
}

function RiskCell({ likelihood, impact }: { likelihood: string; impact: string }) {
  const score = (likelihood === 'High' ? 3 : likelihood === 'Medium' ? 2 : 1) *
    (impact === 'High' ? 3 : impact === 'Medium' ? 2 : 1);
  const colors =
    score >= 6 ? 'bg-red-100 border-red-200 text-red-700' :
    score >= 3 ? 'bg-yellow-100 border-yellow-200 text-yellow-700' :
    'bg-green-100 border-green-200 text-green-700';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors}`}>
      {score >= 6 ? 'Critical' : score >= 3 ? 'Medium' : 'Low'}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComplianceReport() {
  const [period, setPeriod] = useState('quarterly');
  const [expandedSection, setExpandedSection] = useState<string | null>('iso');

  const toggleSection = (id: string) =>
    setExpandedSection((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Report</h1>
          <p className="text-sm text-gray-400 mt-0.5">Security & regulatory compliance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          <div className="flex gap-2">
            {[
              { icon: <FileText size={14} />, label: 'PDF' },
              { icon: <FileSpreadsheet size={14} />, label: 'Excel' },
              { icon: <Download size={14} />, label: 'CSV' },
            ].map((b) => (
              <button
                key={b.label}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                {b.icon}
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Row: Gauge + Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-3 xl:col-span-1">
          <CircleGauge score={84} />
          <p className="text-sm font-semibold text-gray-600 text-center">
            Overall Compliance Score
          </p>
          <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">
            Q2 2026 — Quarterly
          </span>
        </div>

        <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={<Users size={16} />} label="Training Completion" value={84} target="95%" met={false} />
          <MetricCard icon={<ShieldCheck size={16} />} label="Phishing Awareness" value={88} target=">90% safe" met={false} />
          <MetricCard icon={<FileText size={16} />} label="Policy Acknowledgment" value={91} target="100%" met={false} />
          <MetricCard icon={<Smartphone size={16} />} label="MFA Adoption Rate" value={82} target="100%" met={false} />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-500" />
            12-Month Compliance Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={complianceTrend} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[65, 90]} unit="%" />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Compliance']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="score" stroke="#F97316" strokeWidth={3} dot={{ fill: '#F97316', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Compliance Radar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#F3F4F6" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Radar name="Score" dataKey="value" stroke="#F97316" fill="#F97316" fillOpacity={0.2} />
              <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Department Compliance Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 pl-4 pr-6 font-semibold">Department</th>
                <th className="py-3 pr-6 font-semibold">Training</th>
                <th className="py-3 pr-6 font-semibold">Phishing Safe</th>
                <th className="py-3 pr-6 font-semibold">Policy Ack</th>
                <th className="py-3 pr-6 font-semibold">MFA</th>
                <th className="py-3 pr-6 font-semibold">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deptCompliance.map((d) => {
                const overall = Math.round((d.training + d.phishing + d.policy + d.mfa) / 4);
                const phishingSafe = 100 - d.phishing;
                return (
                  <tr key={d.dept} className="hover:bg-gray-50">
                    <td className="py-3 pl-4 pr-6 font-semibold text-gray-800">{d.dept}</td>
                    {[d.training, phishingSafe, d.policy, d.mfa].map((v, i) => (
                      <td key={i} className="py-3 pr-6">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${v >= 90 ? 'bg-green-500' : v >= 75 ? 'bg-orange-400' : 'bg-red-400'}`}
                              style={{ width: `${v}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${v >= 90 ? 'text-green-600' : v >= 75 ? 'text-orange-500' : 'text-red-500'}`}>
                            {v}%
                          </span>
                        </div>
                      </td>
                    ))}
                    <td className="py-3 pr-6">
                      <span className={`text-sm font-black ${overall >= 85 ? 'text-green-600' : overall >= 70 ? 'text-orange-500' : 'text-red-500'}`}>
                        {overall}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Assessment Matrix */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Risk Assessment Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pr-6 font-semibold">Risk Item</th>
                <th className="pb-3 pr-6 font-semibold">Likelihood</th>
                <th className="pb-3 pr-6 font-semibold">Impact</th>
                <th className="pb-3 font-semibold">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {riskMatrix.map((r) => (
                <tr key={r.label} className="hover:bg-gray-50">
                  <td className="py-3 pr-6 font-medium text-gray-800">{r.label}</td>
                  <td className="py-3 pr-6">
                    <span className={`text-xs font-semibold ${r.likelihood === 'High' ? 'text-red-500' : r.likelihood === 'Medium' ? 'text-yellow-500' : 'text-green-600'}`}>
                      {r.likelihood}
                    </span>
                  </td>
                  <td className="py-3 pr-6">
                    <span className={`text-xs font-semibold ${r.impact === 'High' ? 'text-red-500' : r.impact === 'Medium' ? 'text-yellow-500' : 'text-green-600'}`}>
                      {r.impact}
                    </span>
                  </td>
                  <td className="py-3">
                    <RiskCell likelihood={r.likelihood} impact={r.impact} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Requiring Attention */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          Employees Requiring Attention
        </h2>
        <div className="space-y-3">
          {attentionEmployees.map((e) => (
            <div key={e.name} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">
                  {e.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.dept}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                {e.issues.map((issue) => (
                  <span key={issue} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{issue}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ISO 27001 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('iso')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />
              <span className="font-semibold text-gray-800">ISO 27001 Controls</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">87%</span>
            </div>
            {expandedSection === 'iso' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {expandedSection === 'iso' && (
            <div className="border-t border-gray-100">
              {iso27001Controls.map((ctrl) => (
                <div key={ctrl.id} className="flex items-center justify-between px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <StatusDot status={ctrl.status} />
                    <span className="text-xs text-gray-400 font-mono">{ctrl.id}</span>
                    <span className="text-sm text-gray-700">{ctrl.name}</span>
                  </div>
                  <span className={`text-xs font-semibold ${ctrl.score >= 85 ? 'text-green-600' : ctrl.score >= 70 ? 'text-orange-500' : 'text-red-500'}`}>
                    {ctrl.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SOC 2 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('soc2')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-purple-600" />
              <span className="font-semibold text-gray-800">SOC 2 Trust Criteria</span>
              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">79%</span>
            </div>
            {expandedSection === 'soc2' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {expandedSection === 'soc2' && (
            <div className="border-t border-gray-100">
              {soc2Criteria.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <StatusDot status={c.status} />
                    <span className="text-sm text-gray-700">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-purple-600">{c.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PCI-DSS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('pci')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Circle size={16} className="text-green-600" />
              <span className="font-semibold text-gray-800">PCI-DSS Requirements</span>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold">92%</span>
            </div>
            {expandedSection === 'pci' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {expandedSection === 'pci' && (
            <div className="border-t border-gray-100">
              {pciRequirements.map((r) => (
                <div key={r.req} className="flex items-center justify-between px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <StatusDot status={r.status} />
                    <span className="text-xs text-gray-400 font-mono">Req {r.req}</span>
                    <span className="text-sm text-gray-700">{r.name}</span>
                  </div>
                  <span className={`text-xs font-semibold ${r.score >= 85 ? 'text-green-600' : 'text-orange-500'}`}>{r.score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText size={16} className="text-orange-500" />
          Auto-Generated Narrative Summary
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            <strong className="text-gray-900">Q2 2026 Compliance Summary:</strong> CyberShield LMS reports an overall compliance score of <strong>84%</strong> for the period ending May 8, 2026 — up from 82% in Q1 2026, representing a <strong>+2 point improvement</strong>.
          </p>
          <p>
            Training completion remains the primary gap, with <strong>Sales (63%)</strong> and <strong>Marketing (74%)</strong> significantly below the 95% organizational target. Immediate remediation is recommended for the 5 flagged employees with overdue requirements.
          </p>
          <p>
            Phishing resilience has improved: the overall click rate fell to <strong>12%</strong> from 18% a year ago. The Finance department's 18% click rate warrants focused intervention with targeted simulation campaigns and mandatory refresher training.
          </p>
          <p>
            ISO 27001 control A.16 (Incident Management) remains <strong>non-compliant at 58%</strong> and requires a formal remediation plan before the next external audit. SOC 2 and PCI-DSS postures are satisfactory with no critical gaps identified.
          </p>
          <p className="text-gray-400 text-xs">
            Generated automatically on May 8, 2026 · Based on platform data only · Not a substitute for formal audit.
          </p>
        </div>
      </div>
    </div>
  );
}
