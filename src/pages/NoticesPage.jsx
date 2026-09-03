import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, Calendar, User, Tag, Trash2 } from 'lucide-react';
import { noticeService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ROLES } from '../utils/constants';

export const NoticesPage = () => {
  const { activeRole } = useAuth();
  const { addToast } = useToast();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    targetAudience: 'All',
    priority: 'Medium',
    content: '',
  });

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const data = await noticeService.getAll();
      setNotices(data);
    } catch (err) {
      addToast('Failed to load notices', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await noticeService.create({
        ...formData,
        publishDate: new Date().toISOString().split('T')[0],
        author: 'Principal Office',
      });
      addToast('Announcement posted!', 'success');
      setIsModalOpen(false);
      loadNotices();
    } catch (err) {
      addToast('Failed to post announcement', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await noticeService.delete(id);
      addToast('Notice removed', 'success');
      loadNotices();
    } catch (err) {
      addToast('Failed to remove notice', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Notices & Bulletins</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Broadcast official school announcements, administrative circulars, and reminders</p>
        </div>
        {activeRole === ROLES.ADMIN && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Post Notice
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={n.priority === 'High' ? 'danger' : n.priority === 'Medium' ? 'warning' : 'neutral'}>
                  Priority: {n.priority}
                </Badge>
                <Badge variant="primary">Target: {n.targetAudience}</Badge>
                <span className="text-xs font-semibold text-slate-400">{n.category}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {n.publishDate}</span>
                {activeRole === ROLES.ADMIN && (
                  <button onClick={() => handleDelete(n.id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-3">{n.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">{n.content}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Campus Announcement">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Notice Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Select label="Category" options={['Event', 'Academic', 'General', 'Urgent']} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <Select label="Target Audience" options={['All', 'Teachers', 'Students', 'Parents']} value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} />
            <Select label="Priority Level" options={['Low', 'Medium', 'High']} value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Content</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm"
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Broadcast Notice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
