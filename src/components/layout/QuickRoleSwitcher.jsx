import React, { useState } from 'react';
import { ShieldCheck, UserCheck, GraduationCap, Users, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

export const QuickRoleSwitcher = () => {
  const { activeRole, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roleConfigs = [
    { role: ROLES.ADMIN, label: 'Admin Access', icon: ShieldCheck, color: 'text-purple-600 dark:text-purple-400' },
    { role: ROLES.TEACHER, label: 'Teacher View', icon: UserCheck, color: 'text-blue-600 dark:text-blue-400' },
    { role: ROLES.STUDENT, label: 'Student View', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400' },
    { role: ROLES.PARENT, label: 'Parent Portal', icon: Users, color: 'text-amber-600 dark:text-amber-400' },
  ];

  const currentConfig = roleConfigs.find((r) => r.role === activeRole) || roleConfigs[0];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <CurrentIcon className={`w-4 h-4 ${currentConfig.color}`} />
        <span>Role: <span className="font-extrabold text-brand-600 dark:text-brand-400">{activeRole}</span></span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden py-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700">
              Switch Role Simulator
            </div>
            {roleConfigs.map(({ role, label, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                  activeRole === role
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
