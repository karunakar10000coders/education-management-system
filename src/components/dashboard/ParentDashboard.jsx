import React from 'react';
import { Users, CreditCard, Award, CheckSquare, ArrowUpRight, MessageSquare } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { mockStudents, mockFees, mockNotices } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const ParentDashboard = () => {
  const navigate = useNavigate();
  const child = mockStudents[0]; // Alex Vance

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Parent Guardian Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Welcome, Mr. Robert Vance</h1>
          <p className="text-xs sm:text-sm text-amber-200 mt-1">Monitoring academic growth for: <strong className="text-white">{child.name}</strong> ({child.class})</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" icon={CreditCard} onClick={() => navigate('/fees')}>
            Pay Fee Invoice
          </Button>
          <Button variant="secondary" size="sm" icon={MessageSquare} onClick={() => navigate('/messages')}>
            Message Teacher
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Child's Cumulative GPA" value={`${child.gpa} / 4.0`} icon={Award} color="emerald" description="Excellent Performance" />
        <StatCard title="Child's Attendance" value={`${child.attendanceRate}%`} icon={CheckSquare} color="brand" description="96.5% present rate" />
        <StatCard title="Fee Due Balance" value={formatCurrency(250)} icon={CreditCard} color="amber" description="Lab & Tech Fee due Sept 20" />
        <StatCard title="Linked Wards" value="1 Child" icon={Users} color="purple" description="Alex Vance (Grade 10)" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Child Academic Summary Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Ward Profile Overview</h3>
            <button onClick={() => navigate('/students')} className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
              Full Profile <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
            <img src={child.avatar} alt={child.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20" />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{child.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Class: {child.class} • {child.section} | Roll #: {child.rollNo}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Class Teacher: Prof. Sarah Jenkins</p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                  Status: Active
                </span>
                <span className="text-xs bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 font-bold px-2.5 py-0.5 rounded-full">
                  GPA: {child.gpa}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">School Notices for Parents</h3>
            <button onClick={() => navigate('/notices')} className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
              All Notices <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {mockNotices.slice(0, 2).map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
