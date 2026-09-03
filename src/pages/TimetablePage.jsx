import React, { useState, useEffect } from 'react';
import { Plus, CalendarClock, BookOpen, UserCheck, DoorOpen, Trash2 } from 'lucide-react';
import { timetableService, subjectService, teacherService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { useToast } from '../hooks/useToast';
import { DAYS_OF_WEEK } from '../utils/constants';

export const TimetablePage = () => {
  const { addToast } = useToast();
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('Grade 10 - Sec A');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '08:30 AM - 09:30 AM',
    subject: 'Advanced Mathematics',
    teacher: 'Prof. Sarah Jenkins',
    room: 'Room 301',
    class: 'Grade 10 - Sec A',
  });

  const loadData = async () => {
    try {
      const [tData, sData, tchData] = await Promise.all([
        timetableService.getAll(),
        subjectService.getAll(),
        teacherService.getAll(),
      ]);
      setTimetable(tData);
      setSubjects(sData);
      setTeachers(tchData);
    } catch (err) {
      addToast('Failed to load schedule', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await timetableService.create({ ...formData, class: selectedClass });
      addToast('Timetable slot added', 'success');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to add slot', 'error');
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await timetableService.delete(id);
      addToast('Slot removed', 'success');
      loadData();
    } catch (err) {
      addToast('Failed to delete slot', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Academic Timetable</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Class schedule matrix, time slots, and classroom locations</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select
            options={['Grade 10 - Sec A', 'Grade 10 - Sec B', 'Grade 9 - Sec A']}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-48"
          />
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Schedule Slot
          </Button>
        </div>
      </div>

      {/* Schedule Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = timetable.filter((t) => t.day === day);
          return (
            <div key={day} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
              <div className="pb-3 mb-3 border-b border-slate-100 dark:border-slate-700 text-center">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{day}</h3>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">{daySlots.length} Classes</span>
              </div>

              <div className="space-y-3 flex-1">
                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No slots scheduled</p>
                ) : (
                  daySlots.map((slot) => (
                    <div key={slot.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 relative group">
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                        {slot.time}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5">{slot.subject}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" /> {slot.teacher}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <DoorOpen className="w-3 h-3" /> {slot.room}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Timetable Slot">
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <Select label="Day of Week" options={DAYS_OF_WEEK} value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} />
          <Input label="Time Duration" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
          <Select label="Subject" options={subjects.map((s) => s.name)} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
          <Select label="Instructor" options={teachers.map((t) => t.name)} value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} />
          <Input label="Room / Lab" required value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Slot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
