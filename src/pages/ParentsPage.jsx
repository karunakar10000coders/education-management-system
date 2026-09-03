import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Users, Edit, Trash2 } from 'lucide-react';
import { parentService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const ParentsPage = () => {
  const { addToast } = useToast();
  const [parents, setParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    address: '',
    children: [],
  });

  const loadParents = async () => {
    setIsLoading(true);
    try {
      const data = await parentService.getAll();
      setParents(data);
    } catch (err) {
      addToast('Failed to load parents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  const handleOpenAdd = () => {
    setSelectedParent(null);
    setFormData({ name: '', email: '', phone: '', occupation: '', address: '', children: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedParent(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (p) => {
    setSelectedParent(p);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedParent) {
        await parentService.update(selectedParent.id, formData);
        addToast('Parent profile updated', 'success');
      } else {
        await parentService.create({
          ...formData,
          status: 'Active',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          children: ['Alex Vance (STU-1001)'],
        });
        addToast('Parent added', 'success');
      }
      setIsModalOpen(false);
      loadParents();
    } catch (err) {
      addToast('Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await parentService.delete(selectedParent.id);
      addToast('Parent deleted', 'success');
      setIsDeleteModalOpen(false);
      loadParents();
    } catch (err) {
      addToast('Failed to delete parent', 'error');
    }
  };

  const filteredParents = parents.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Guardian Info',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
            <span className="text-[11px] text-slate-400">{row.occupation || 'Parent'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Details',
      key: 'email',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300"><Mail className="w-3.5 h-3.5 text-slate-400" /> {row.email}</p>
          <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300"><Phone className="w-3.5 h-3.5 text-slate-400" /> {row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Linked Wards',
      key: 'children',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.children?.map((c, i) => (
            <Badge key={i} variant="primary" size="sm">
              <Users className="w-3 h-3 mr-1" /> {c}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => handleOpenEdit(row)} className="p-1 text-slate-500 hover:text-amber-600">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenDelete(row)} className="p-1 text-slate-500 hover:text-rose-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Parent Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage parent profiles and linked student accounts</p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Parent
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Input
          icon={Search}
          placeholder="Search by parent name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table columns={columns} data={filteredParents} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedParent ? 'Edit Parent' : 'Add Parent'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Guardian Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Input label="Occupation" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
          <Input label="Residential Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Parent</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Parent" message={`Delete ${selectedParent?.name}?`} />
    </div>
  );
};
