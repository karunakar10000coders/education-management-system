import React from 'react';
import { Users, GraduationCap, UserCheck, CreditCard, ArrowUpRight, Plus, CheckSquare, Megaphone } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { mockStudents, mockTeachers, mockFees, mockNotices, mockEvents } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const totalFeeCollected = mockFees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const revenueChartData = [
    { month: 'May', revenue: 14500, attendance: 95 },
    { month: 'Jun', revenue: 18200, attendance: 92 },
    { month: 'Jul', revenue: 12000, attendance: 94 },
    { month: 'Aug', revenue: 24500, attendance: 96 },
    { month: 'Sep', revenue: 31000, attendance: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Executive Overview</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Welcome back, Administrator</h1>
          <p className="text-xs sm:text-sm text-brand-200 mt-1">Here is what is happening across EduPulse Academy today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => navigate('/students')}>
            Add Student
          </Button>
          <Button variant="primary" size="sm" icon={CheckSquare} onClick={() => navigate('/attendance')}>
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={mockStudents.length * 140}
          icon={GraduationCap}
          trend={4.2}
          trendLabel="vs last term"
          color="brand"
        />
        <StatCard
          title="Active Faculty"
          value={mockTeachers.length * 18}
          icon={UserCheck}
          trend={2.1}
          trendLabel="vs last month"
          color="emerald"
        />
        <StatCard
          title="Fee Revenue"
          value={formatCurrency(totalFeeCollected * 35)}
          icon={CreditCard}
          trend={8.5}
          trendLabel="target achieved"
          color="purple"
        />
        <StatCard
          title="Avg Attendance Rate"
          value="95.8%"
          icon={Users}
          trend={1.2}
          trendLabel="daily average"
          color="amber"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Collection Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Fee Collection Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly revenue trends for current academic year</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              +14.8% YoY
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c8de9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0c8de9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0c8de9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Attendance Rate Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Attendance %</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly student participation</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Notices & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Announcements */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Notices</h3>
            </div>
            <button
              onClick={() => navigate('/notices')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 inline-flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {mockNotices.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                  <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold px-2 py-0.5 rounded-full">
                    {n.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Campus Events</h3>
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 inline-flex items-center gap-1"
            >
              Calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {mockEvents.map((evt) => (
              <div key={evt.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="flex-shrink-0 w-12 text-center p-2 rounded-lg bg-brand-600 text-white font-extrabold text-xs">
                  <div>{new Date(evt.startDate).toLocaleString('default', { month: 'short' })}</div>
                  <div className="text-base leading-none mt-0.5">{new Date(evt.startDate).getDate()}</div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{evt.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{evt.location} • {evt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
