import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle2, Lock, Users, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: <Shield size={20} />, text: 'Phishing Simulation & Defense Training' },
  { icon: <Lock size={20} />, text: 'Philippine Data Privacy Act Compliance' },
  { icon: <Trophy size={20} />, text: 'Gamified Learning with Leaderboards' },
  { icon: <Zap size={20} />, text: 'Microsoft 365 Security Essentials' },
  { icon: <Users size={20} />, text: 'Department Compliance Tracking' },
];

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@cybershield.com', password: 'admin123', color: 'bg-red-50 border-red-200' },
  { role: 'Employee', email: 'employee@cybershield.com', password: 'emp123', color: 'bg-blue-50 border-blue-200' },
  { role: 'Manager', email: 'manager@cybershield.com', password: 'mgr123', color: 'bg-green-50 border-green-200' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithMicrosoft } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msLoading, setMsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoft = async () => {
    setMsLoading(true);
    setError('');
    try {
      await loginWithMicrosoft();
      setSuccess('Microsoft SSO successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch {
      setError('Microsoft login failed. Please try again.');
    } finally {
      setMsLoading(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2" />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">CyberShield</h1>
              <p className="text-orange-200 text-sm">LMS Platform</p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Protect.<br />Learn.<br />Thrive.
            </h2>
            <p className="text-orange-100 text-lg mb-10 leading-relaxed max-w-md">
              Enterprise-grade cybersecurity awareness training tailored for BPO environments and the Philippine regulatory landscape.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-white/90 text-sm font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-8 pt-8 border-t border-white/20">
            {[
              { value: '8+', label: 'Training Modules' },
              { value: '80%', label: 'Pass Required' },
              { value: 'DPA', label: 'Compliant' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white text-2xl font-bold">{s.value}</p>
                <p className="text-orange-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-gray-900 font-bold text-xl">CyberShield</span>
          </div>

          <div className="max-w-sm w-full mx-auto lg:mx-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-8">Sign in to your security training portal</p>

            {/* Error / Success */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4 text-sm text-green-700">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            {/* Microsoft SSO */}
            <button
              onClick={handleMicrosoft}
              disabled={msLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {msLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-orange-500 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h10v10H0V0z" fill="#f25022" />
                  <path d="M11 0h10v10H11V0z" fill="#7fba00" />
                  <path d="M0 11h10v10H0V11z" fill="#00a4ef" />
                  <path d="M11 11h10v10H11V11z" fill="#ffb900" />
                </svg>
              )}
              {msLoading ? 'Signing in with Microsoft...' : 'Sign in with Microsoft'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email/Password form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || msLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 font-medium mb-2 text-center uppercase tracking-wide">Demo Credentials</p>
              <div className="space-y-2">
                {DEMO_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.role}
                    onClick={() => fillDemo(cred.email, cred.password)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all hover:shadow-sm ${cred.color}`}
                  >
                    <span className="font-semibold text-gray-700">{cred.role}</span>
                    <span className="text-gray-500">{cred.email}</span>
                    <span className="text-gray-400 font-mono">{cred.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Powered by CyberShield | Enterprise Security Training</p>
          <p className="text-xs text-gray-300 mt-0.5">© 2025 CyberShield. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
