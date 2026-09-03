import React from 'react';
import { BookOpen, CheckSquare, FileText, Users, ArrowUpRight, Clock } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { mockAssignments, mockTimetable } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Faculty Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Hello, Prof. Sarah Jenkins</h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">Department of Mathematics • Grade 10 Lead Teacher</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" icon={CheckSquare} onClick={() => navigate('/attendance')}>
            Mark Class Attendance
          </Button>
          <Button variant="secondary" size="sm" icon={FileText} onClick={() => navigate('/assignments')}>
            New Assignment
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Classes" value="3 Classes" icon={BookOpen} color="brand" description="Grade 9A, 10A, 10B" />
        <StatCard title="Total Students" value="98 Students" icon={Users} color="emerald" description="Across 3 sections" />
        <StatCard title="Active Assignments" value="4 Pending" icon={FileText} color="amber" description="128 submissions to grade" />
        <StatCard title="Class Attendance" value="96.2%" icon={CheckSquare} color="purple" description="Today's attendance" />
      </div>

      {/* Schedule & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Today's Class Schedule</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monday, Academic Session 2025-2026</p>
            </div>
            <button
              onClick={() => navigate('/timetable')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 inline-flex items-center gap-1"
            >
              Full Timetable <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mockTimetable.slice(0, 4).map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{slot.subject}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{slot.class} • {slot.room}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments Needing Grading */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Submissions to Grade</h3>
            <button
              onClick={() => navigate('/assignments')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 inline-flex items-center gap-1"
            >
              Gradebook <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mockAssignments.map((asg) => (
              <div key={asg.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{asg.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{asg.class} • Due: {asg.dueDate}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{asg.submissionsCount}/{asg.totalStudents} Submitted</span>
                  <button className="text-[10px] font-bold bg-brand-600 text-white px-2.5 py-1 rounded-md hover:bg-brand-700">
                    Grade Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
