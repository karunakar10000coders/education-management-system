import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, BookOpen, UserCheck, Edit, Trash2, LayoutGrid, List } from 'lucide-react';
import { teacherService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { DEPARTMENTS } from '../utils/constants';

export const TeachersPage = () => {
  const { addToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Mathematics',
    qualification: 'M.Sc in Mathematics',
    experience: '5 Years',
    status: 'Active',
  });

  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      addToast('Failed to load faculty', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleOpenAdd = () => {
    setSelectedTeacher(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Mathematics',
      qualification: 'M.Sc in Mathematics',
      experience: '5 Years',
      status: 'Active',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setSelectedTeacher(t);
    setFormData({ ...t });
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (t) => {
    setSelectedTeacher(t);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeacher) {
        await teacherService.update(selectedTeacher.id, formData);
        addToast('Teacher updated', 'success');
      } else {
        await teacherService.create({
          ...formData,
          employeeId: `TCH-${Math.floor(100 + Math.random() * 900)}`,
          subjects: ['Core Course'],
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          joiningDate: new Date().toISOString().split('T')[0],
        });
        addToast('Teacher added', 'success');
      }
      setIsFormModalOpen(false);
      loadTeachers();
    } catch (err) {
      addToast('Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await teacherService.delete(selectedTeacher.id);
      addToast('Teacher deleted', 'success');
      setIsDeleteModalOpen(false);
      loadTeachers();
    } catch (err) {
      addToast('Failed to delete teacher', 'error');
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept ? t.department === selectedDept : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Faculty Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage teaching staff, qualifications, and department allocations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-slate-500'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-brand-500 text-white' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button icon={Plus} onClick={handleOpenAdd}>
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by teacher name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          placeholder="All Departments"
          options={DEPARTMENTS}
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex items-start gap-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/20" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">{t.employeeId}</span>
                    <Badge variant="success" size="sm">{t.status}</Badge>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate mt-0.5">{t.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.department}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2 truncate"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> {t.qualification}</p>
                <p className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5 text-slate-400" /> {t.email}</p>
                <p className="flex items-center gap-2 truncate"><Phone className="w-3.5 h-3.5 text-slate-400" /> {t.phone}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">Exp: {t.experience}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(t)} className="p-1.5 text-slate-500 hover:text-amber-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleOpenDelete(t)} className="p-1.5 text-slate-500 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs font-bold uppercase text-slate-500 border-b">
              <tr>
                <th className="p-4">Teacher</th>
                <th className="p-4">Department</th>
                <th className="p-4">Qualification</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-4 font-bold flex items-center gap-3">
                    <img src={t.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p>{t.name}</p>
                      <span className="text-[10px] text-slate-400">{t.employeeId}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{t.department}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{t.qualification}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{t.email}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(t)} className="text-amber-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenDelete(t)} className="text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedTeacher ? 'Edit Faculty Details' : 'Add New Teacher'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Select label="Department" required options={DEPARTMENTS} value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
            <Input label="Qualification" required value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} />
            <Input label="Experience" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Teacher</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Remove Teacher"
        message={`Are you sure you want to remove ${selectedTeacher?.name}?`}
      />
    </div>
  );
};
