import React from 'react';
import { BarChart3, Download, FileSpreadsheet, Printer, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '../hooks/useToast';

export const ReportsPage = () => {
  const { addToast } = useToast();

  const gradeData = [
    { grade: 'A+ (90-100%)', count: 42 },
    { grade: 'A (80-89%)', count: 68 },
    { grade: 'B+ (70-79%)', count: 54 },
    { grade: 'B (60-69%)', count: 28 },
    { grade: 'C (50-59%)', count: 12 },
  ];

  const feeStatusData = [
    { name: 'Paid Fees', value: 78, color: '#10b981' },
    { name: 'Pending Fees', value: 16, color: '#f59e0b' },
    { name: 'Overdue Dues', value: 6, color: '#f43f5e' },
  ];

  const handleExportCSV = () => {
    addToast('Academic & Financial Report exported to CSV!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Reports & Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Institutional metrics, academic distribution, attendance rates, and financial reports</p>
        </div>
        <Button icon={Download} onClick={handleExportCSV}>
          Export Report (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Academic Pass & Grade Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Student count per grade category for current term</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                <XAxis dataKey="grade" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0c8de9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Payment Collection Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Fee Collection Status %</h3>
          <p className="text-xs text-slate-500 mb-4">Percentage breakdown of total tuition collection</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feeStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
