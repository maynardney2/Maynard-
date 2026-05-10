import { useState } from 'react';
import { FileText, CheckCircle, Clock, Download, ChevronRight, Shield, Award } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  description: string;
  version: string;
  effectiveDate: string;
  category: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  fileSize: string;
}

const mockPolicies: Policy[] = [
  {
    id: '1', title: 'Acceptable Use Policy', version: 'v2.3', effectiveDate: '2024-01-01', fileSize: '148 KB',
    description: 'Governs acceptable use of company systems, networks, internet, and email resources.',
    category: 'General Security', acknowledged: true, acknowledgedAt: '2024-01-10',
  },
  {
    id: '2', title: 'Password & Authentication Policy', version: 'v3.1', effectiveDate: '2024-01-01', fileSize: '92 KB',
    description: 'Requirements for password complexity, MFA, and account management procedures.',
    category: 'Access Control', acknowledged: true, acknowledgedAt: '2024-01-10',
  },
  {
    id: '3', title: 'Clean Desk & Screen Lock Policy', version: 'v1.8', effectiveDate: '2024-01-01', fileSize: '75 KB',
    description: 'Procedures for securing physical workspaces and unattended workstations.',
    category: 'Physical Security', acknowledged: true, acknowledgedAt: '2024-02-05',
  },
  {
    id: '4', title: 'Remote Work Security Policy', version: 'v2.0', effectiveDate: '2024-03-01', fileSize: '120 KB',
    description: 'Security requirements for employees working from home or remote locations.',
    category: 'Remote Work', acknowledged: false,
  },
  {
    id: '5', title: 'Data Classification Policy', version: 'v1.5', effectiveDate: '2024-01-01', fileSize: '165 KB',
    description: 'Framework for classifying company and client data: Public, Internal, Confidential, Restricted.',
    category: 'Data Protection', acknowledged: true, acknowledgedAt: '2024-01-15',
  },
  {
    id: '6', title: 'Incident Response Policy', version: 'v2.2', effectiveDate: '2024-01-01', fileSize: '210 KB',
    description: 'Procedures for identifying, reporting, containing, and recovering from security incidents.',
    category: 'Incident Management', acknowledged: false,
  },
  {
    id: '7', title: 'BYOD & Mobile Device Policy', version: 'v1.3', effectiveDate: '2024-02-01', fileSize: '98 KB',
    description: 'Requirements for using personal devices to access company resources and data.',
    category: 'Device Security', acknowledged: false,
  },
  {
    id: '8', title: 'AI & Generative AI Usage Policy', version: 'v1.0', effectiveDate: '2024-04-01', fileSize: '88 KB',
    description: 'Guidelines for the safe and compliant use of AI tools including ChatGPT, Copilot, and others.',
    category: 'AI Security', acknowledged: false,
  },
];

const categoryColors: Record<string, string> = {
  'General Security': 'bg-blue-100 text-blue-700',
  'Access Control': 'bg-purple-100 text-purple-700',
  'Physical Security': 'bg-gray-100 text-gray-700',
  'Remote Work': 'bg-teal-100 text-teal-700',
  'Data Protection': 'bg-orange-100 text-orange-700',
  'Incident Management': 'bg-red-100 text-red-700',
  'Device Security': 'bg-indigo-100 text-indigo-700',
  'AI Security': 'bg-yellow-100 text-yellow-700',
};

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [filter, setFilter] = useState<'all' | 'pending' | 'acknowledged'>('all');
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const acknowledged = policies.filter(p => p.acknowledged).length;
  const total = policies.length;
  const fullyCompliant = acknowledged === total;

  const filtered = filter === 'pending' ? policies.filter(p => !p.acknowledged)
    : filter === 'acknowledged' ? policies.filter(p => p.acknowledged)
    : policies;

  const handleAcknowledge = (id: string) => {
    setAcknowledging(id);
    setTimeout(() => {
      setPolicies(prev => prev.map(p =>
        p.id === id ? { ...p, acknowledged: true, acknowledgedAt: new Date().toISOString().split('T')[0] } : p
      ));
      setAcknowledging(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Policies</h1>
          <p className="text-sm text-gray-500 mt-0.5">Read and acknowledge all company security policies to maintain compliance.</p>
        </div>
      </div>

      {/* Compliance Banner */}
      <div className={`rounded-xl p-5 flex items-center justify-between ${fullyCompliant ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${fullyCompliant ? 'bg-green-100' : 'bg-orange-100'}`}>
            {fullyCompliant ? <Award className="w-6 h-6 text-green-600" /> : <Shield className="w-6 h-6 text-orange-600" />}
          </div>
          <div>
            <p className={`font-semibold ${fullyCompliant ? 'text-green-800' : 'text-orange-800'}`}>
              {fullyCompliant ? 'Fully Compliant — All Policies Acknowledged' : `${total - acknowledged} ${total - acknowledged === 1 ? 'policy requires' : 'policies require'} your acknowledgment`}
            </p>
            <p className={`text-sm ${fullyCompliant ? 'text-green-600' : 'text-orange-600'}`}>
              {acknowledged} of {total} policies acknowledged
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{Math.round((acknowledged / total) * 100)}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
          <div className="w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none"
                stroke={fullyCompliant ? '#10B981' : '#F97316'} strokeWidth="3"
                strokeDasharray={`${(acknowledged / total) * 94.25} 94.25`}
                strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
        {(['all', 'pending', 'acknowledged'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f} {f === 'pending' ? `(${policies.filter(p => !p.acknowledged).length})` : f === 'acknowledged' ? `(${policies.filter(p => p.acknowledged).length})` : `(${policies.length})`}
          </button>
        ))}
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {filtered.map(policy => (
          <div key={policy.id} className={`bg-white rounded-xl border shadow-sm transition-all ${policy.acknowledged ? 'border-gray-100' : 'border-orange-200'}`}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${policy.acknowledged ? 'bg-green-50' : 'bg-orange-50'}`}>
                    {policy.acknowledged ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                      <span className="text-xs text-gray-400">{policy.version}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[policy.category] || 'bg-gray-100 text-gray-600'}`}>
                        {policy.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{policy.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Effective: {new Date(policy.effectiveDate).toLocaleDateString()}</span>
                      <span>{policy.fileSize}</span>
                      {policy.acknowledged && policy.acknowledgedAt && (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Acknowledged {new Date(policy.acknowledgedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}
                    className="text-gray-400 hover:text-gray-600 p-1.5"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedId === policy.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded: acknowledge button */}
              {expandedId === policy.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Acknowledgment Statement</h4>
                    <p className="text-sm text-gray-600">
                      By acknowledging this policy, I confirm that I have read, understood, and agree to comply with
                      the <strong>{policy.title}</strong> ({policy.version}), effective {new Date(policy.effectiveDate).toLocaleDateString()}.
                      I understand that failure to comply may result in disciplinary action.
                    </p>
                  </div>
                  {!policy.acknowledged ? (
                    <button
                      onClick={() => handleAcknowledge(policy.id)}
                      disabled={acknowledging === policy.id}
                      className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-70"
                    >
                      {acknowledging === policy.id ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" />I Acknowledge This Policy</>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Acknowledged on {new Date(policy.acknowledgedAt!).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Certificate of compliance */}
      {fullyCompliant && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
          <Award className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800">Congratulations! You are Fully Compliant</h3>
          <p className="text-sm text-green-600 mt-1 mb-4">All security policies have been acknowledged. Your compliance certificate is ready.</p>
          <button className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" /> Download Compliance Certificate
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No policies match this filter</p>
          <button onClick={() => setFilter('all')} className="text-orange-500 text-sm mt-2 hover:underline">View all policies</button>
        </div>
      )}
    </div>
  );
}
