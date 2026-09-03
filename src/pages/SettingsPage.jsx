import React, { useState, useEffect } from 'react';
import { Save, School, Mail, Phone, MapPin, Globe, Moon, Sun, Bell } from 'lucide-react';
import { settingsService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';

export const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    schoolName: 'EduPulse International Academy',
    schoolCode: 'EDUPULSE-2025',
    academicYear: '2025-2026',
    email: 'info@edupulse.edu',
    phone: '+1 (800) 555-0199',
    address: '100 Academic Boulevard, Suite 500, Innovation City, CA 94016',
    website: 'https://www.edupulse.edu',
    currency: 'USD',
    enableEmailAlerts: true,
    enableSMSAlerts: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err) {
        addToast('Failed to load settings', 'error');
      }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateSettings(settings);
      addToast('System settings updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">System & School Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure institution branding, academic terms, contact info, and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* School Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <School className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Institutional Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="School Name" required value={settings.schoolName} onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })} />
            <Input label="School Code" required value={settings.schoolCode} onChange={(e) => setSettings({ ...settings, schoolCode: e.target.value })} />
            <Select label="Active Academic Year" options={['2024-2025', '2025-2026', '2026-2027']} value={settings.academicYear} onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })} />
            <Input label="Official Email" type="email" icon={Mail} value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            <Input label="Phone Number" icon={Phone} value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            <Input label="Website" icon={Globe} value={settings.website} onChange={(e) => setSettings({ ...settings, website: e.target.value })} />
          </div>
          <Input label="Physical Address" icon={MapPin} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
        </div>

        {/* Display & Preference Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Sun className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Appearance & Notifications</h3>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Mode Interface</h4>
              <p className="text-[11px] text-slate-500">Toggle dark/light theme stylesheet across the application</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border text-xs font-bold ${isDarkMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-slate-200 text-slate-700'}`}
            >
              {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" icon={Save} isLoading={isSaving}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
