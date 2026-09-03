import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { TeacherDashboard } from '../components/dashboard/TeacherDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { ParentDashboard } from '../components/dashboard/ParentDashboard';

export const DashboardPage = () => {
  const { activeRole } = useAuth();

  switch (activeRole) {
    case ROLES.TEACHER:
      return <TeacherDashboard />;
    case ROLES.STUDENT:
      return <StudentDashboard />;
    case ROLES.PARENT:
      return <ParentDashboard />;
    case ROLES.ADMIN:
    default:
      return <AdminDashboard />;
  }
};
