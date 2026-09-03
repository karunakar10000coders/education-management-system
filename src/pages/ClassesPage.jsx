import React, { useState, useEffect } from 'react';
import { Plus, School, Users, UserCheck, DoorOpen, Edit, Trash2 } from 'lucide-react';
import { classService, teacherService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const ClassesPage = () => {
  const { addToast } = useToast();
  const [classesList, setClassesList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [formData, setFormData] = useState({
    className: 'Grade 10',
    section: 'Section A',
    classTeacher: '',
    roomNo: 'Room 101',
    capacity: 35,
    enrolled: 30,
    academicYear: '2025-2026',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cData, tData] = await Promise.all([classService.getAll(), teacherService.getAll()]);
      setClassesList(cData);
      setTeachers(tData);
    } catch (err) {
      addToast('Failed to load classes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedClass(null);
    setFormData({
      className: 'Grade 10',
      section: 'Section A',
      classTeacher: teachers[0]?.name || 'Prof. Sarah Jenkins',
      roomNo: 'Room 301',
      capacity: 35,
      enrolled: 25,
      academicYear: '2025-2026',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setSelectedClass(cls);
    setFormData({ ...cls });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedClass) {
        await classService.update(selectedClass.id, formData);
        addToast('Class updated', 'success');
      } else {
        await classService.create(formData);
        addToast('New Class & Section created', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await classService.delete(selectedClass.id);
      addToast('Class deleted', 'success');
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Classes & Sections</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure class rooms, assigned class teachers, and capacity</p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Class Section
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classesList.map((cls) => (
          <div key={cls.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{cls.className}</h3>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{cls.section}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(cls)} className="p-1.5 text-slate-400 hover:text-amber-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => { setSelectedClass(cls); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-slate-400" /> Class Teacher: <strong className="text-slate-900 dark:text-slate-100">{cls.classTeacher}</strong></p>
              <p className="flex items-center gap-2"><DoorOpen className="w-4 h-4 text-slate-400" /> Location: <strong>{cls.roomNo}</strong></p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Enrolled: <strong>{cls.enrolled} / {cls.capacity} Students</strong></p>
            </div>

            {/* Capacity Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Occupancy Rate</span>
                <span>{Math.round((cls.enrolled / cls.capacity) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all"
                  style={{ width: `${Math.min((cls.enrolled / cls.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedClass ? 'Edit Class Section' : 'Create Class Section'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class Grade" required options={['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']} value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
            <Select label="Section" required options={['Section A', 'Section B', 'Section C']} value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
            <Select label="Class Teacher" required options={teachers.map((t) => t.name)} value={formData.classTeacher} onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })} />
            <Input label="Room Number" required value={formData.roomNo} onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })} />
            <Input label="Max Student Capacity" type="number" required value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 30 })} />
            <Input label="Currently Enrolled" type="number" required value={formData.enrolled} onChange={(e) => setFormData({ ...formData, enrolled: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Class</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Class" message={`Delete ${selectedClass?.className} ${selectedClass?.section}?`} />
    </div>
  );
};
