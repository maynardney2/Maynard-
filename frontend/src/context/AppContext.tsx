import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Notification } from '../types';

interface AppContextType extends AppState {
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'usr-002', type: 'course_assigned', message: 'New course assigned: Phishing Awareness 2025', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), link: '/courses' },
  { id: 'n2', userId: 'usr-002', type: 'deadline_reminder', message: 'Password Security course due in 3 days', read: false, createdAt: new Date(Date.now() - 7200000).toISOString(), link: '/courses' },
  { id: 'n3', userId: 'usr-002', type: 'badge_earned', message: 'You earned the "First Steps" badge!', read: false, createdAt: new Date(Date.now() - 86400000).toISOString(), link: '/profile' },
  { id: 'n4', userId: 'usr-002', type: 'phishing_alert', message: 'Phishing simulation campaign launched in your department', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'n5', userId: 'usr-002', type: 'compliance_warning', message: 'Acceptable Use Policy requires acknowledgment', read: true, createdAt: new Date(Date.now() - 259200000).toISOString(), link: '/policies' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    sidebarCollapsed: false,
    theme: 'light',
    notifications: INITIAL_NOTIFICATIONS,
  });

  const toggleSidebar = () => setState(s => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }));
  const setSidebarCollapsed = (v: boolean) => setState(s => ({ ...s, sidebarCollapsed: v }));

  const markNotificationRead = (id: string) =>
    setState(s => ({
      ...s,
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));

  const markAllRead = () =>
    setState(s => ({
      ...s,
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    }));

  const addNotification = (n: Omit<Notification, 'id' | 'createdAt'>) =>
    setState(s => ({
      ...s,
      notifications: [
        { ...n, id: `n-${Date.now()}`, createdAt: new Date().toISOString() },
        ...s.notifications,
      ],
    }));

  return (
    <AppContext.Provider value={{ ...state, toggleSidebar, setSidebarCollapsed, markNotificationRead, markAllRead, addNotification }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
