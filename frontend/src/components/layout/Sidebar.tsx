import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  Trophy,
  FileText,
  User,
  Users,
  Mail,
  BarChart2,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/courses', label: 'My Courses', icon: <BookOpen size={20} /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
  { path: '/policies', label: 'Policies', icon: <FileText size={20} /> },
  { path: '/profile', label: 'Profile', icon: <User size={20} /> },
];

const ADMIN_ITEMS: NavItem[] = [
  { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <BarChart2 size={20} /> },
  { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
  { path: '/admin/phishing', label: 'Phishing', icon: <Mail size={20} /> },
  { path: '/admin/reports', label: 'Reports', icon: <ClipboardList size={20} /> },
  { path: '/admin/audit', label: 'Audit Logs', icon: <Settings size={20} /> },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getRoleBadge(role: string) {
  const map: Record<string, string> = {
    admin: 'bg-red-500',
    manager: 'bg-blue-500',
    it_staff: 'bg-purple-500',
    employee: 'bg-green-500',
  };
  return map[role] || 'bg-gray-500';
}

function getRoleLabel(role: string) {
  const map: Record<string, string> = {
    admin: 'Admin',
    manager: 'Manager',
    it_staff: 'IT Staff',
    employee: 'Employee',
  };
  return map[role] || role;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = sidebarCollapsed ? 'w-18' : 'w-64';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-gray-900 text-white transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-700 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="flex-shrink-0 w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">CyberShield</span>
              <span className="text-orange-400 text-xs">Security Training</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                ${isActive
                  ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500 ml-0 pl-[10px]'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className={`pt-4 pb-2 ${sidebarCollapsed ? 'px-1' : 'px-3'}`}>
                {!sidebarCollapsed ? (
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</p>
                ) : (
                  <hr className="border-gray-700" />
                )}
              </div>
              {ADMIN_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                    ${isActive
                      ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500 pl-[10px]'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User info at bottom */}
        <div className="border-t border-gray-700 p-3">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user ? getInitials(user.name) : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <span className={`inline-block text-xs text-white px-1.5 py-0.5 rounded ${getRoleBadge(user?.role || '')}`}>
                  {getRoleLabel(user?.role || '')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                {user ? getInitials(user.name) : '?'}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-600 transition-colors shadow-lg z-10 hidden lg:flex"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
