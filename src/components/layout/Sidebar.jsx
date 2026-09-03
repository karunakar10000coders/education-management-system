import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Users,
  School,
  BookOpen,
  CheckSquare,
  CalendarClock,
  FileText,
  Award,
  CreditCard,
  Library,
  Megaphone,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { activeRole } = useAuth();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
    { name: 'Students', path: '/students', icon: GraduationCap, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Teachers', path: '/teachers', icon: UserCheck, roles: [ROLES.ADMIN] },
    { name: 'Parents', path: '/parents', icon: Users, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Classes & Sections', path: '/classes', icon: School, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Subjects', path: '/subjects', icon: BookOpen, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
    { name: 'Attendance', path: '/attendance', icon: CheckSquare, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
    { name: 'Timetable', path: '/timetable', icon: CalendarClock, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
    { name: 'Assignments', path: '/assignments', icon: FileText, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
    { name: 'Exams & Grades', path: '/exams', icon: Award, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
    { name: 'Fees & Payments', path: '/fees', icon: CreditCard, roles: [ROLES.ADMIN, ROLES.STUDENT, ROLES.PARENT] },
    { name: 'Library', path: '/library', icon: Library, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
    { name: 'Notices', path: '/notices', icon: Megaphone, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT], badge: 'New' },
    { name: 'Events', path: '/events', icon: Calendar, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
    { name: 'Messages', path: '/messages', icon: MessageSquare, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT], badge: '3' },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Users & Roles', path: '/users', icon: Shield, roles: [ROLES.ADMIN] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: [ROLES.ADMIN] },
  ];

  const filteredNav = navigation.filter((item) => item.roles.includes(activeRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col justify-between shadow-xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Logo */}
        <div>
          <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/30 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-wide">EduPulse</span>
              <span className="block text-[10px] font-bold text-brand-400 tracking-wider uppercase">EMS Portal v2.5</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 max-h-[calc(100vh-140px)] overflow-y-auto space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-extrabold tracking-wider text-slate-500">
              Main Menu ({activeRole})
            </div>
            {filteredNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold px-2 py-0.5 border border-brand-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl bg-slate-800/60 p-3 text-center border border-slate-700/50">
            <p className="text-[11px] font-bold text-slate-200">EduPulse Academy</p>
            <p className="text-[10px] text-slate-400">Academic Term 2025-2026</p>
          </div>
        </div>

      </aside>
    </>
  );
};
