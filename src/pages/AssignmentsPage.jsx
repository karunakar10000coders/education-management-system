import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, CheckCircle2, Clock, Upload, Send } from 'lucide-react';
import { assignmentService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ROLES } from '../utils/constants';

export const AssignmentsPage = () => {
  const { activeRole } = useAuth();
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Advanced Mathematics',
    class: 'Grade 10',
    dueDate: '2025-09-15',
    totalPoints: 100,
    description: '',
  });

  const [submissionFile, setSubmissionFile] = useState('');

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      addToast('Failed to load assignments', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await assignmentService.create({
        ...formData,
        assignedDate: new Date().toISOString().split('T')[0],
        submissionsCount: 0,
        totalStudents: 32,
        status: 'Active',
      });
      addToast('Assignment posted successfully!', 'success');
      setIsCreateModalOpen(false);
      loadAssignments();
    } catch (err) {
      addToast('Failed to create assignment', 'error');
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    try {
      await assignmentService.update(selectedAssignment.id, {
        submissionsCount: selectedAssignment.submissionsCount + 1,
      });
      addToast('Homework submitted successfully!', 'success');
      setIsSubmitModalOpen(false);
      loadAssignments();
    } catch (err) {
      addToast('Submission failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Assignments & Homework</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track coursework, deadlines, points, and student submissions</p>
        </div>
        {activeRole !== ROLES.STUDENT && (
          <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
            Post Assignment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asg) => (
          <div key={asg.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                  {asg.subject}
                </span>
                <Badge variant={asg.status === 'Active' ? 'success' : 'neutral'}>
                  {asg.status}
                </Badge>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-2">{asg.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">{asg.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {asg.dueDate}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{asg.totalPoints} Marks</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Submissions:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{asg.submissionsCount}/{asg.totalStudents} Turn-ins</strong>
              </div>

              {activeRole === ROLES.STUDENT && (
                <div className="pt-2">
                  <Button variant="primary" size="sm" className="w-full" icon={Upload} onClick={() => { setSelectedAssignment(asg); setIsSubmitModalOpen(true); }}>
                    Submit Homework
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Assignment Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Assignment">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Assignment Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Subject" options={['Advanced Mathematics', 'Physics', 'English Literature', 'World History']} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            <Select label="Target Class" options={['Grade 9', 'Grade 10', 'Grade 11']} value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
            <Input label="Due Date" type="date" required value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            <Input label="Total Points" type="number" required value={formData.totalPoints} onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) || 100 })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instructions & Guidelines</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit">Post Assignment</Button>
          </div>
        </form>
      </Modal>

      {/* Submit Assignment Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Assignment Work">
        <form onSubmit={handleSubmitWork} className="space-y-4">
          <p className="text-xs text-slate-500">Submitting work for: <strong className="text-slate-900 dark:text-slate-100">{selectedAssignment?.title}</strong></p>
          <Input label="File / Document Link" placeholder="Paste Google Drive or PDF link..." required value={submissionFile} onChange={(e) => setSubmissionFile(e.target.value)} />
          <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center">
            <Upload className="w-8 h-8 text-brand-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Drag and drop file here or click to browse</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button type="submit" icon={Send}>Submit Homework</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
