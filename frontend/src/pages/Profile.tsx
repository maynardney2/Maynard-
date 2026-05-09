import { useState } from 'react';
import {
  Shield, Award, BookOpen, TrendingUp, Download, Edit2,
  CheckCircle, Lock, Calendar, Zap, Star, User, Mail,
  Building, Clock, AlertTriangle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mockBadges = [
  { id: '1', name: 'First Steps', icon: '🎯', description: 'Complete your first course', earned: true, earnedAt: '2024-01-15' },
  { id: '2', name: 'Phish Fighter', icon: '🐟', description: 'Report 5 phishing emails', earned: true, earnedAt: '2024-02-01' },
  { id: '3', name: 'Quiz Master', icon: '🧠', description: 'Score 100% on any quiz', earned: true, earnedAt: '2024-02-14' },
  { id: '4', name: 'Security Champion', icon: '🏆', description: 'Top scorer in your department', earned: true, earnedAt: '2024-03-05' },
  { id: '5', name: 'Streak Keeper', icon: '🔥', description: 'Maintain a 30-day learning streak', earned: false, earnedAt: null },
  { id: '6', name: 'Compliance Star', icon: '⭐', description: 'Complete all required training on time', earned: false, earnedAt: null },
  { id: '7', name: 'MFA Hero', icon: '🛡️', description: 'Enable all security features', earned: true, earnedAt: '2024-01-20' },
  { id: '8', name: 'Data Guardian', icon: '🔒', description: 'Complete BPO Data Protection track', earned: false, earnedAt: null },
];

const mockCertificates = [
  { id: '1', title: 'Core Cybersecurity Awareness', issuedAt: '2024-02-28', expiresAt: '2025-02-28', certNo: 'CS-2024-001247' },
  { id: '2', title: 'Phishing & Social Engineering Defense', issuedAt: '2024-03-10', expiresAt: '2025-03-10', certNo: 'CS-2024-001389' },
  { id: '3', title: 'Microsoft 365 Security Awareness', issuedAt: '2024-03-22', expiresAt: '2025-03-22', certNo: 'CS-2024-001502' },
];

const mockActivity = [
  { id: '1', action: 'Completed course', detail: 'Password Security & MFA Fundamentals', time: '2 days ago', icon: BookOpen, color: 'text-green-500' },
  { id: '2', action: 'Earned badge', detail: 'Security Champion', time: '5 days ago', icon: Award, color: 'text-yellow-500' },
  { id: '3', action: 'Reported phishing', detail: 'Suspicious email flagged to IT', time: '1 week ago', icon: Shield, color: 'text-blue-500' },
  { id: '4', action: 'Quiz passed', detail: 'BPO Data Protection – Score: 95%', time: '1 week ago', icon: CheckCircle, color: 'text-green-500' },
  { id: '5', action: 'Policy acknowledged', detail: 'Acceptable Use Policy v2.3', time: '2 weeks ago', icon: CheckCircle, color: 'text-purple-500' },
];

function SecurityGauge({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ * 0.75;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F97316' : '#EF4444';
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="120" viewBox="0 0 160 120">
        <path d="M 20 100 A 60 60 0 1 1 140 100" fill="none" stroke="#E5E7EB" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 20 100 A 60 60 0 1 1 140 100"
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${progress} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="80" y="95" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1F2937">{score}</text>
        <text x="80" y="112" textAnchor="middle" fontSize="11" fill="#6B7280">Security Score</text>
      </svg>
      <span className="text-sm font-medium" style={{ color }}>
        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good – Keep improving' : 'Needs Attention'}
      </span>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'certs' | 'activity'>('overview');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [editForm, setEditForm] = useState({
    firstName: user?.name?.split(' ')[0] ?? 'Jane',
    lastName: user?.name?.split(' ')[1] ?? 'Smith',
    email: user?.email ?? 'jane.smith@company.com',
    department: user?.department ?? 'Operations',
    phone: '+1 (555) 234-5678',
  });

  const displayName = user?.name ?? 'Jane Smith';
  const score = user?.securityScore ?? 82;
  const completedCourses = 8;
  const totalXP = 3450;
  const streak = 14;
  const phishingReported = 7;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-orange-500 to-orange-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-800 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {displayName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="mb-1">
                <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{user?.email ?? 'jane.smith@company.com'}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 capitalize">
                    {user?.role ?? 'employee'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Quick info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {user?.department ?? 'Operations'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined January 2024</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last login: Today, 9:14 AM</span>
            <span className={`flex items-center gap-1 ${mfaEnabled ? 'text-green-600' : 'text-red-500'}`}>
              {mfaEnabled ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              MFA {mfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Courses Completed', value: completedCourses, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total XP Earned', value: totalXP.toLocaleString(), icon: Zap, color: 'bg-orange-50 text-orange-600' },
          { label: 'Current Streak', value: `${streak} days`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
          { label: 'Phishing Reported', value: phishingReported, icon: Shield, color: 'bg-purple-50 text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 self-start">Security Score</h2>
          <SecurityGauge score={score} />
          <div className="w-full mt-4 space-y-2">
            {[
              { label: 'Training Completion', val: 85 },
              { label: 'Quiz Performance', val: 92 },
              { label: 'Phishing Awareness', val: 70 },
              { label: 'Policy Compliance', val: 100 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{item.label}</span><span>{item.val}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-1.5 bg-orange-500 rounded-full" style={{ width: `${item.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex border-b border-gray-100">
            {(['overview', 'badges', 'certs', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'certs' ? 'Certificates' : tab === 'activity' ? 'Activity' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Multi-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Microsoft Authenticator app connected</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMfaEnabled(!mfaEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mfaEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mfaEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">EMP-00247</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.department ?? 'Operations'}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-xs text-gray-500">Certificates Earned</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{mockCertificates.length}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-xs text-gray-500">Badges Earned</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{mockBadges.filter(b => b.earned).length}/{mockBadges.length}</p>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-sm font-medium text-orange-800 flex items-center gap-2">
                    <Star className="w-4 h-4" /> Current Learning Goal
                  </p>
                  <p className="text-sm text-orange-700 mt-1">Complete BPO Security track to earn <strong>Data Guardian</strong> badge</p>
                  <div className="mt-2 h-2 bg-orange-200 rounded-full">
                    <div className="h-2 bg-orange-500 rounded-full w-3/5" />
                  </div>
                  <p className="text-xs text-orange-600 mt-1">3 of 5 courses completed</p>
                </div>
              </div>
            )}

            {/* Badges */}
            {activeTab === 'badges' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mockBadges.map(badge => (
                  <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl border text-center ${badge.earned ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <p className="text-xs font-semibold text-gray-800">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{badge.description}</p>
                    {badge.earned && badge.earnedAt && (
                      <p className="text-xs text-orange-600 mt-1">{new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    )}
                    {!badge.earned && <p className="text-xs text-gray-400 mt-1">Locked</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Certificates */}
            {activeTab === 'certs' && (
              <div className="space-y-3">
                {mockCertificates.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{cert.title}</p>
                        <p className="text-xs text-gray-500">Cert #{cert.certNo} · Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">Expires {new Date(cert.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Activity */}
            {activeTab === 'activity' && (
              <div className="space-y-3">
                {mockActivity.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 mt-0.5 ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
                <button className="w-full text-center text-xs text-orange-600 hover:text-orange-700 font-medium py-2 flex items-center justify-center gap-1">
                  View full history <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  value={editForm.email} disabled />
                <p className="text-xs text-gray-400 mt-1">Managed by Microsoft 365</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  value={editForm.department} disabled />
                <p className="text-xs text-gray-400 mt-1">Contact HR to change department</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
