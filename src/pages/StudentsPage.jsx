import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { studentService } from '../services/api';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const StudentsPage = () => {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: 'Grade 10',
    section: 'Section A',
    gender: 'Male',
    dob: '2008-01-01',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    gpa: 3.5,
    attendanceRate: 95.0,
    status: 'Active',
  });

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      addToast('Failed to load students', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormData({
      name: '',
      email: '',
      class: 'Grade 10',
      section: 'Section A',
      gender: 'Male',
      dob: '2008-01-01',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      gpa: 3.5,
      attendanceRate: 95.0,
      status: 'Active',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setIsFormModalOpen(true);
  };

  const handleOpenProfile = (student) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.id, formData);
        addToast('Student details updated successfully!', 'success');
      } else {
        await studentService.create({
          ...formData,
          rollNo: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
          avatar: `https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150`,
        });
        addToast('New student added successfully!', 'success');
      }
      setIsFormModalOpen(false);
      loadStudents();
    } catch (err) {
      addToast('Operation failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await studentService.delete(selectedStudent.id);
      addToast('Student record deleted', 'success');
      setIsDeleteModalOpen(false);
      loadStudents();
    } catch (err) {
      addToast('Failed to delete student', 'error');
    }
  };

  // Filtering & Search
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass ? s.class === selectedClass : true;
    const matchesGender = selectedGender ? s.gender === selectedGender : true;
    return matchesSearch && matchesClass && matchesGender;
  });

  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      header: 'Student Info',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'} alt={row.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.rollNo} • {row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Class & Sec',
      key: 'class',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{row.class}</p>
          <span className="text-[11px] text-slate-500">{row.section}</span>
        </div>
      ),
    },
    {
      header: 'Guardian Contact',
      key: 'parentName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{row.parentName}</p>
          <span className="text-[11px] text-slate-500">{row.parentPhone}</span>
        </div>
      ),
    },
    {
      header: 'GPA / Att %',
      key: 'gpa',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{row.gpa} GPA</span>
          <p className="text-[11px] text-slate-500">{row.attendanceRate}% Att.</p>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleOpenProfile(row)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700 transition-colors" title="View Profile">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenEdit(row)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-700 transition-colors" title="Edit Student">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenDelete(row)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-700 transition-colors" title="Delete Student">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Student Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage student profiles, class enrollments, and guardians</p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add New Student
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by student name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            placeholder="All Classes"
            options={['Grade 9', 'Grade 10', 'Grade 11']}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-36"
          />
          <Select
            placeholder="All Genders"
            options={['Male', 'Female']}
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        data={paginatedStudents}
        isLoading={isLoading}
        emptyTitle="No students found"
        emptySubtitle="Try adjusting search terms or filters."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredStudents.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedStudent ? 'Edit Student Details' : 'Add New Student'}
        subtitle="Fill in student profile and guardian information"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Select label="Class Grade" required options={['Grade 9', 'Grade 10', 'Grade 11']} value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
            <Select label="Section" required options={['Section A', 'Section B']} value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
            <Select label="Gender" required options={['Male', 'Female']} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
            <Input label="Date of Birth" type="date" required value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
            <Input label="Guardian Name" required value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
            <Input label="Guardian Phone" required value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
            <Input label="Guardian Email" type="email" value={formData.parentEmail} onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })} />
            <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="secondary" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{selectedStudent ? 'Save Changes' : 'Create Student'}</Button>
          </div>
        </form>
      </Modal>

      {/* Student Profile View Modal */}
      {selectedStudent && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Student Record Profile"
          maxWidth="max-w-xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{selectedStudent.name}</h3>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{selectedStudent.rollNo} • {selectedStudent.class} ({selectedStudent.section})</p>
                <div className="mt-1 flex gap-2">
                  <Badge variant="success">GPA: {selectedStudent.gpa}</Badge>
                  <Badge variant="primary">Attendance: {selectedStudent.attendanceRate}%</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Personal Info</p>
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Mail className="w-3.5 h-3.5" /> {selectedStudent.email}</p>
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><GraduationCap className="w-3.5 h-3.5" /> Gender: {selectedStudent.gender}</p>
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><MapPin className="w-3.5 h-3.5" /> {selectedStudent.address}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Guardian Info</p>
                <p className="font-bold text-slate-900 dark:text-slate-100">{selectedStudent.parentName}</p>
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Phone className="w-3.5 h-3.5" /> {selectedStudent.parentPhone}</p>
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Mail className="w-3.5 h-3.5" /> {selectedStudent.parentEmail}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button variant="secondary" onClick={() => setIsProfileModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message={`Are you sure you want to permanently remove ${selectedStudent?.name} (${selectedStudent?.rollNo})?`}
      />
    </div>
  );
};
