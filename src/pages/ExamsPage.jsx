import React, { useState, useEffect } from 'react';
import { Plus, Award, Calendar, FileCheck, Printer, CheckCircle2 } from 'lucide-react';
import { examService, resultService, studentService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { useToast } from '../hooks/useToast';
import { getGradeFromScore } from '../utils/formatters';

export const ExamsPage = () => {
  const { addToast } = useToast();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules' or 'marks'

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);

  const [examFormData, setExamFormData] = useState({
    name: 'Mid-Term Examination',
    class: 'Grade 10',
    subject: 'Advanced Mathematics',
    examDate: '2025-10-15',
    duration: '2 Hours',
    room: 'Main Hall A',
    totalMarks: 100,
    passingMarks: 40,
  });

  const [marksFormData, setMarksFormData] = useState({
    studentId: '',
    subject: 'Advanced Mathematics',
    exam: 'Fall Mid-Term Examination 2025',
    marksObtained: 85,
    totalMarks: 100,
    remarks: 'Good performance',
  });

  const loadData = async () => {
    try {
      const [eData, rData, sData] = await Promise.all([
        examService.getAll(),
        resultService.getAll(),
        studentService.getAll(),
      ]);
      setExams(eData);
      setResults(rData);
      setStudents(sData);
      if (sData.length) setMarksFormData((prev) => ({ ...prev, studentId: sData[0].id }));
    } catch (err) {
      addToast('Failed to load exam portal', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await examService.create({ ...examFormData, status: 'Scheduled' });
      addToast('Exam scheduled', 'success');
      setIsExamModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to schedule exam', 'error');
    }
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    try {
      const student = students.find((s) => s.id === marksFormData.studentId);
      const grade = getGradeFromScore(marksFormData.marksObtained);
      await resultService.create({
        ...marksFormData,
        studentName: student?.name || 'Student',
        rollNo: student?.rollNo || 'STU-100',
        grade,
      });
      addToast('Marks recorded in Gradebook!', 'success');
      setIsMarksModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to save marks', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resultColumns = [
    { header: 'Student', key: 'studentName', render: (row) => <strong className="text-slate-900 dark:text-slate-100">{row.studentName} ({row.rollNo})</strong> },
    { header: 'Subject', key: 'subject' },
    { header: 'Exam', key: 'exam' },
    { header: 'Marks', key: 'marksObtained', render: (row) => <span className="font-bold text-emerald-600">{row.marksObtained}/{row.totalMarks}</span> },
    { header: 'Grade', key: 'grade', render: (row) => <Badge variant="primary">{row.grade}</Badge> },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Button
          size="sm"
          variant="secondary"
          icon={Printer}
          onClick={() => {
            const stu = students.find((s) => s.id === row.studentId) || students[0];
            setSelectedStudentForReport(stu);
            setIsReportCardOpen(true);
          }}
        >
          Report Card
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Exams & Gradebook</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Exam schedules, marks entry, GPA report card generation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={FileCheck} onClick={() => setIsMarksModalOpen(true)}>
            Enter Marks
          </Button>
          <Button icon={Plus} onClick={() => setIsExamModalOpen(true)}>
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-colors ${activeTab === 'schedules' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'}`}
        >
          Exam Schedules
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-colors ${activeTab === 'marks' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'}`}
        >
          Gradebook Results
        </button>
      </div>

      {activeTab === 'schedules' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((ex) => (
            <div key={ex.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">{ex.class}</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-2">{ex.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{ex.subject}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Date: {ex.examDate}</p>
                <p>Duration: <strong>{ex.duration}</strong> | Hall: <strong>{ex.room}</strong></p>
                <p>Max Marks: <strong>{ex.totalMarks}</strong> | Passing: <strong>{ex.passingMarks}</strong></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table columns={resultColumns} data={results} />
      )}

      {/* Schedule Exam Modal */}
      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Schedule New Exam">
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input label="Exam Name" required value={examFormData.name} onChange={(e) => setExamFormData({ ...examFormData, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class" options={['Grade 9', 'Grade 10', 'Grade 11']} value={examFormData.class} onChange={(e) => setExamFormData({ ...examFormData, class: e.target.value })} />
            <Select label="Subject" options={['Advanced Mathematics', 'Physics', 'English Literature']} value={examFormData.subject} onChange={(e) => setExamFormData({ ...examFormData, subject: e.target.value })} />
            <Input label="Exam Date" type="date" required value={examFormData.examDate} onChange={(e) => setExamFormData({ ...examFormData, examDate: e.target.value })} />
            <Input label="Duration" value={examFormData.duration} onChange={(e) => setExamFormData({ ...examFormData, duration: e.target.value })} />
            <Input label="Room / Hall" value={examFormData.room} onChange={(e) => setExamFormData({ ...examFormData, room: e.target.value })} />
            <Input label="Total Marks" type="number" value={examFormData.totalMarks} onChange={(e) => setExamFormData({ ...examFormData, totalMarks: parseInt(e.target.value) || 100 })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsExamModalOpen(false)}>Cancel</Button>
            <Button type="submit">Schedule Exam</Button>
          </div>
        </form>
      </Modal>

      {/* Enter Marks Modal */}
      <Modal isOpen={isMarksModalOpen} onClose={() => setIsMarksModalOpen(false)} title="Enter Student Marks">
        <form onSubmit={handleSaveMarks} className="space-y-4">
          <Select label="Select Student" options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))} value={marksFormData.studentId} onChange={(e) => setMarksFormData({ ...marksFormData, studentId: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Subject" options={['Advanced Mathematics', 'Physics', 'English Literature']} value={marksFormData.subject} onChange={(e) => setMarksFormData({ ...marksFormData, subject: e.target.value })} />
            <Input label="Marks Obtained" type="number" required value={marksFormData.marksObtained} onChange={(e) => setMarksFormData({ ...marksFormData, marksObtained: parseInt(e.target.value) || 0 })} />
          </div>
          <Input label="Remarks" value={marksFormData.remarks} onChange={(e) => setMarksFormData({ ...marksFormData, remarks: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsMarksModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Marks</Button>
          </div>
        </form>
      </Modal>

      {/* Printable Report Card Modal */}
      {selectedStudentForReport && (
        <Modal isOpen={isReportCardOpen} onClose={() => setIsReportCardOpen(false)} title="Official Student Report Card" maxWidth="max-w-2xl">
          <div id="printable-area" className="p-6 bg-white dark:bg-slate-900 border rounded-2xl space-y-6 text-slate-900 dark:text-slate-100">
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-black tracking-wider text-brand-600">EDUPULSE ACADEMY</h2>
              <p className="text-xs text-slate-500">Official Student Academic Transcript • Session 2025-2026</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div>
                <p><strong>Student Name:</strong> {selectedStudentForReport.name}</p>
                <p><strong>Roll Number:</strong> {selectedStudentForReport.rollNo}</p>
                <p><strong>Class & Section:</strong> {selectedStudentForReport.class} ({selectedStudentForReport.section})</p>
              </div>
              <div className="text-right">
                <p><strong>Cumulative GPA:</strong> {selectedStudentForReport.gpa} / 4.0</p>
                <p><strong>Attendance Rate:</strong> {selectedStudentForReport.attendanceRate}%</p>
                <p><strong>Status:</strong> PASS (Grade A+)</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b">
                <tr>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Marks</th>
                  <th className="p-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.filter((r) => r.studentId === selectedStudentForReport.id || true).slice(0, 3).map((res) => (
                  <tr key={res.id} className="border-b">
                    <td className="p-2 font-bold">{res.subject}</td>
                    <td className="p-2">{res.marksObtained}/100</td>
                    <td className="p-2 font-bold text-brand-600">{res.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-6 text-[10px] text-slate-400">
              <p>Principal Signature: __________________</p>
              <p>Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 border-t pt-4">
            <Button variant="secondary" onClick={() => setIsReportCardOpen(false)}>Close</Button>
            <Button icon={Printer} onClick={handlePrint}>Print / Export PDF</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
