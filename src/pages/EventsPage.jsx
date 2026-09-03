import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, MapPin, Clock, Users, Trash2 } from 'lucide-react';
import { eventService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ROLES } from '../utils/constants';

export const EventsPage = () => {
  const { activeRole } = useAuth();
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sports',
    startDate: '2025-09-20',
    endDate: '2025-09-20',
    time: '09:00 AM',
    location: 'Main Auditorium',
    organizer: 'Student Council',
    description: '',
  });

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      addToast('Failed to load events', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(formData);
      addToast('Event created successfully!', 'success');
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      addToast('Failed to create event', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await eventService.delete(id);
      addToast('Event deleted', 'success');
      loadEvents();
    } catch (err) {
      addToast('Failed to delete event', 'error');
    }
  };

  const filteredEvents = selectedCategory === 'All' ? events : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Events & Academic Calendar</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">School activities, sports meets, cultural nights, and term holidays</p>
        </div>
        {activeRole === ROLES.ADMIN && (
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Event
          </Button>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 overflow-x-auto">
        {['All', 'Sports', 'Exams', 'Cultural', 'Holidays'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <Badge variant="primary">{evt.category}</Badge>
                {activeRole === ROLES.ADMIN && (
                  <button onClick={() => handleDelete(evt.id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-3">{evt.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-brand-500" /> {evt.startDate} to {evt.endDate}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> {evt.time}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-500" /> {evt.location}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Campus Event">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Event Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" options={['Sports', 'Exams', 'Cultural', 'Holidays']} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <Input label="Time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
            <Input label="Start Date" type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            <Input label="End Date" type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <Input label="Organizer" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
