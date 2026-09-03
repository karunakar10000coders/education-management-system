import React from 'react';
import { Award, CheckSquare, FileText, CreditCard, ArrowUpRight, Calendar, BookOpen } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { mockAssignments, mockResults, mockFees, mockTimetable } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
  const navigate = useNavigate();

  const myResults = mockResults.filter((r) => r.studentId === 'stu-1');
  const pendingFees = mockFees.filter((f) => f.studentId === 'stu-1' && f.status !== 'Paid');

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
            alt="Alex Vance"
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Student Portal</span>
            <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">Welcome back, Alex Vance</h1>
            <p className="text-xs text-emerald-200 mt-0.5">Roll No: STU-1001 • Grade 10 - Section A</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={Award} onClick={() => navigate('/exams')}>
            My Report Card
          </Button>
          <Button variant="primary" size="sm" icon={FileText} onClick={() => navigate('/assignments')}>
            My Homework
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Cumulative GPA" value="3.85 / 4.0" icon={Award} color="emerald" description="Top 5% of class" />
        <StatCard title="Attendance Rate" value="96.5%" icon={CheckSquare} color="brand" description="2 days absent total" />
        <StatCard title="Pending Assignments" value="2 Homework" icon={FileText} color="amber" description="Math & Physics due soon" />
        <StatCard title="Fee Status" value={pendingFees.length ? formatCurrency(pendingFees[0].amount) : 'Paid'} icon={CreditCard} color="purple" description={pendingFees.length ? 'Pending payment' : 'No dues'} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">My Class Timetable</h3>
            </div>
            <button onClick={() => navigate('/timetable')} className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
              Full Schedule <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockTimetable.slice(0, 4).map((tt) => (
              <div key={tt.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                  {tt.time}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">{tt.subject}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{tt.teacher} • {tt.room}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exam Scores */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Exam Marks</h3>
            <button onClick={() => navigate('/exams')} className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myResults.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.subject}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{r.exam}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{r.marksObtained}/{r.totalMarks}</span>
                  <span className="block text-[10px] font-bold text-slate-400">Grade: {r.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
