import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckSquare, CheckCircle2, XCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { studentService, attendanceService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { useToast } from '../hooks/useToast';
import { ATTENDANCE_STATUS } from '../utils/constants';

export const AttendancePage = () => {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allStudents = await studentService.getAll();
        const existingAttendance = await attendanceService.getAll();

        const classStudents = allStudents.filter((s) => s.class === selectedClass);
        setStudents(classStudents);

        // Initialize status matrix
        const map = {};
        classStudents.forEach((stu) => {
          const match = existingAttendance.find(
            (a) => a.studentId === stu.id && a.date === selectedDate
          );
          map[stu.id] = match ? match.status : ATTENDANCE_STATUS.PRESENT;
        });
        setAttendanceRecords(map);
      } catch (err) {
        addToast('Failed to load attendance sheet', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = ATTENDANCE_STATUS.PRESENT;
    });
    setAttendanceRecords(updated);
    addToast('All students marked Present', 'info');
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      for (const stu of students) {
        await attendanceService.create({
          studentId: stu.id,
          studentName: stu.name,
          rollNo: stu.rollNo,
          class: stu.class,
          date: selectedDate,
          status: attendanceRecords[stu.id] || ATTENDANCE_STATUS.PRESENT,
        });
      }
      addToast(`Attendance for ${selectedClass} saved successfully!`, 'success');
    } catch (err) {
      addToast('Failed to save attendance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const statusIcons = {
    Present: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    Absent: <XCircle className="w-4 h-4 text-rose-500" />,
    Late: <Clock className="w-4 h-4 text-amber-500" />,
    Excused: <AlertCircle className="w-4 h-4 text-blue-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Attendance Marker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Record daily student attendance, status tracking, and logs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleMarkAllPresent}>
            Mark All Present
          </Button>
          <Button icon={Save} isLoading={isSaving} onClick={handleSaveAttendance}>
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="w-full sm:w-64">
          <Select
            label="Select Class"
            options={['Grade 9', 'Grade 10', 'Grade 11']}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Input
            label="Attendance Date"
            type="date"
            icon={CalendarIcon}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Interactive Attendance List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Roll No</th>
              <th className="p-4">Current Status</th>
              <th className="p-4 text-center">Mark Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {students.map((stu) => {
              const currentStatus = attendanceRecords[stu.id] || ATTENDANCE_STATUS.PRESENT;
              return (
                <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-4 font-bold flex items-center gap-3">
                    <img src={stu.avatar} alt={stu.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-slate-900 dark:text-slate-100">{stu.name}</p>
                      <span className="text-[11px] text-slate-400">{stu.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">{stu.rollNo}</td>
                  <td className="p-4">
                    <Badge variant={currentStatus === 'Present' ? 'success' : currentStatus === 'Absent' ? 'danger' : 'warning'}>
                      {statusIcons[currentStatus]}
                      {currentStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1 gap-1">
                      {Object.values(ATTENDANCE_STATUS).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(stu.id, st)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentStatus === st
                              ? st === 'Present'
                                ? 'bg-emerald-600 text-white shadow'
                                : st === 'Absent'
                                ? 'bg-rose-600 text-white shadow'
                                : st === 'Late'
                                ? 'bg-amber-500 text-white shadow'
                                : 'bg-blue-600 text-white shadow'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
