import React, { useState, useEffect } from 'react';
import { Plus, Shield, User, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { userService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { useToast } from '../hooks/useToast';
import { ROLES, ROLE_BADGE_COLORS } from '../utils/constants';

export const UsersPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Teacher',
    department: 'Faculty',
  });

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      addToast('Failed to load user accounts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await userService.create({
        ...formData,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
      addToast('New user created successfully!', 'success');
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      addToast('Failed to create user', 'error');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
      await userService.update(user.id, { status: newStatus });
      addToast(`Account for ${user.name} is now ${newStatus}`, 'info');
      loadUsers();
    } catch (err) {
      addToast('Failed to change user status', 'error');
    }
  };

  const columns = [
    {
      header: 'User Profile',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
            <span className="text-[10px] text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => (
        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md border ${ROLE_BADGE_COLORS[row.role]}`}>
          {row.role}
        </span>
      ),
    },
    { header: 'Department', key: 'department' },
    {
      header: 'Account Status',
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Access Control',
      key: 'action',
      render: (row) => (
        <Button size="sm" variant={row.status === 'Active' ? 'secondary' : 'primary'} onClick={() => handleToggleStatus(row)}>
          {row.status === 'Active' ? 'Disable User' : 'Enable User'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Users & Role Access Control</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">System user accounts, RBAC permission toggles, and status management</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create User
        </Button>
      </div>

      <Table columns={columns} data={users} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create System Account">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Select label="Assign Role" options={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          <Input label="Department / Class" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create User Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
