import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'admin@cybershield.com': {
    id: 'usr-001',
    name: 'Alex Johnson',
    email: 'admin@cybershield.com',
    role: 'admin',
    department: 'IT Security',
    avatar: '',
    securityScore: 98,
    completedCourses: ['crs-001', 'crs-002', 'crs-003', 'crs-004', 'crs-005'],
    badges: [
      { id: 'bdg-001', name: 'Security Champion', description: 'Completed all core courses', icon: '🏆', category: 'completion', earnedAt: '2025-01-15' },
      { id: 'bdg-002', name: 'Phishing Hunter', description: 'Reported 10 phishing attempts', icon: '🎣', category: 'phishing', earnedAt: '2025-02-01' },
      { id: 'bdg-003', name: '30-Day Streak', description: 'Logged in 30 days in a row', icon: '🔥', category: 'streak', earnedAt: '2025-02-28' },
    ],
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
    mfaEnabled: true,
    isActive: true,
  },
  'employee@cybershield.com': {
    id: 'usr-002',
    name: 'Sarah Williams',
    email: 'employee@cybershield.com',
    role: 'employee',
    department: 'Customer Support',
    avatar: '',
    securityScore: 72,
    completedCourses: ['crs-001', 'crs-002'],
    badges: [
      { id: 'bdg-001', name: 'First Steps', description: 'Completed first course', icon: '⭐', category: 'completion', earnedAt: '2025-01-20' },
    ],
    createdAt: '2024-03-15',
    lastLogin: new Date().toISOString(),
    mfaEnabled: false,
    isActive: true,
  },
  'manager@cybershield.com': {
    id: 'usr-003',
    name: 'Mike Chen',
    email: 'manager@cybershield.com',
    role: 'manager',
    department: 'Operations',
    avatar: '',
    securityScore: 85,
    completedCourses: ['crs-001', 'crs-002', 'crs-003'],
    badges: [
      { id: 'bdg-001', name: 'Team Leader', description: 'Led team to 90% compliance', icon: '👑', category: 'leadership', earnedAt: '2025-01-10' },
    ],
    createdAt: '2024-02-01',
    lastLogin: new Date().toISOString(),
    mfaEnabled: true,
    isActive: true,
  },
};

const MOCK_PASSWORDS: Record<string, string> = {
  'admin@cybershield.com': 'admin123',
  'employee@cybershield.com': 'emp123',
  'manager@cybershield.com': 'mgr123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem('cybershield_user');
    const token = localStorage.getItem('cybershield_token');
    if (stored && token) {
      setState({ user: JSON.parse(stored), token, isAuthenticated: true, isLoading: false });
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const user = MOCK_USERS[email.toLowerCase()];
    const expectedPwd = MOCK_PASSWORDS[email.toLowerCase()];
    if (!user || password !== expectedPwd) {
      throw new Error('Invalid credentials. Check demo credentials below.');
    }
    const token = `mock-jwt-${Date.now()}`;
    localStorage.setItem('cybershield_user', JSON.stringify(user));
    localStorage.setItem('cybershield_token', token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const loginWithMicrosoft = async () => {
    await new Promise(r => setTimeout(r, 1200));
    const user = MOCK_USERS['admin@cybershield.com'];
    const token = `mock-ms-jwt-${Date.now()}`;
    localStorage.setItem('cybershield_user', JSON.stringify(user));
    localStorage.setItem('cybershield_token', token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('cybershield_user');
    localStorage.removeItem('cybershield_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  const updateUser = (updates: Partial<User>) => {
    setState(s => {
      if (!s.user) return s;
      const updated = { ...s.user, ...updates };
      localStorage.setItem('cybershield_user', JSON.stringify(updated));
      return { ...s, user: updated };
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, loginWithMicrosoft, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
