import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, UserCheck, Clock, Award, Edit, Trash2 } from 'lucide-react';
import { subjectService, teacherService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { DEPARTMENTS } from '../utils/constants';

export const SubjectsPage = () => {
  const { addToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [formData, setFormData] = useState({
    code: 'MATH-101',
    name: 'Advanced Calculus',
    department: 'Mathematics',
    class: 'Grade 10',
    teacher: '',
    credits: 4,
    weeklyHours: 5,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sData, tData] = await Promise.all([subjectService.getAll(), teacherService.getAll()]);
      setSubjects(sData);
      setTeachers(tData);
    } catch (err) {
      addToast('Failed to load courses', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedSubject(null);
    setFormData({
      code: `SBJ-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      department: 'Mathematics',
      class: 'Grade 10',
      teacher: teachers[0]?.name || 'Prof. Sarah Jenkins',
      credits: 4,
      weeklyHours: 4,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sbj) => {
    setSelectedSubject(sbj);
    setFormData({ ...sbj });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSubject) {
        await subjectService.update(selectedSubject.id, formData);
        addToast('Course updated', 'success');
      } else {
        await subjectService.create(formData);
        addToast('New course added', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await subjectService.delete(selectedSubject.id);
      addToast('Course removed', 'success');
      setIsDeleteModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Subjects & Course Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Curriculum subjects, credit allocation, and assigned faculty</p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sbj) => (
          <div key={sbj.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-800">
                  {sbj.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-2">{sbj.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{sbj.department} • {sbj.class}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(sbj)} className="p-1 text-slate-400 hover:text-amber-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => { setSelectedSubject(sbj); setIsDeleteModalOpen(true); }} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-slate-400" /> Instructor: <strong className="text-slate-900 dark:text-slate-100">{sbj.teacher}</strong></p>
              <div className="flex justify-between items-center pt-1">
                <span className="flex items-center gap-1"><Award className="w-4 h-4 text-emerald-500" /> {sbj.credits} Credits</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-purple-500" /> {sbj.weeklyHours} Hours/Week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedSubject ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Subject Code" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            <Input label="Subject Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Select label="Department" required options={DEPARTMENTS} value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
            <Select label="Class Grade" required options={['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']} value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
            <Select label="Assigned Teacher" required options={teachers.map((t) => t.name)} value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} />
            <Input label="Credits" type="number" required value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })} />
            <Input label="Weekly Hours" type="number" required value={formData.weeklyHours} onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) || 4 })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Subject</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Subject" message={`Delete ${selectedSubject?.name}?`} />
    </div>
  );
};
