import React, { useState } from 'react';
import { Sparkles, ShieldCheck, UserCheck, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ROLES } from '../utils/constants';
import { mockUsers } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(ROLES.ADMIN);
  const [email, setEmail] = useState('admin@edupulse.edu');
  const [password, setPassword] = useState('password123');

  const roleDemos = [
    { role: ROLES.ADMIN, email: 'admin@edupulse.edu', icon: ShieldCheck, label: 'Admin Demo' },
    { role: ROLES.TEACHER, email: 'sarah.jenkins@edupulse.edu', icon: UserCheck, label: 'Teacher Demo' },
    { role: ROLES.STUDENT, email: 'alex.vance@student.edupulse.edu', icon: GraduationCap, label: 'Student Demo' },
    { role: ROLES.PARENT, email: 'robert.vance@gmail.com', icon: Users, label: 'Parent Demo' },
  ];

  const handleSelectDemo = (demo) => {
    setRole(demo.role);
    setEmail(demo.email);
    setPassword('password123');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const matchedUser = mockUsers.find((u) => u.email === email) || {
      id: `usr-${role.toLowerCase()}`,
      name: `${role} User`,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    login(matchedUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white mb-3 shadow-lg shadow-brand-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">EduPulse EMS</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to your Education Portal Account</p>
        </div>

        {/* Demo Quick Selector */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 text-center">Quick Demo Login Shortcuts</p>
          <div className="grid grid-cols-2 gap-2">
            {roleDemos.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleSelectDemo(demo)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all ${email === demo.email ? 'bg-brand-600/20 border-brand-500 text-brand-300' : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/50'}`}
                >
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span>{demo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Select label="Select Login Role" options={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]} value={role} onChange={(e) => setRole(e.target.value)} />
          <Input label="Email Address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button type="submit" className="w-full mt-2" icon={ArrowRight}>
            Sign In as {role}
          </Button>
        </form>
      </div>
    </div>
  );
};
