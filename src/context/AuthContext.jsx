import React, { createContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edupulse_current_user');
    return saved ? JSON.parse(saved) : mockUsers[0]; // Default to Admin
  });

  const [activeRole, setActiveRole] = useState(() => currentUser?.role || ROLES.ADMIN);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edupulse_current_user', JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  const switchRole = (roleName) => {
    // Find matching mock user for role or update current user role
    const matchedUser = mockUsers.find((u) => u.role === roleName) || {
      id: `usr-${roleName.toLowerCase()}`,
      name: `${roleName} User`,
      email: `${roleName.toLowerCase()}@edupulse.edu`,
      role: roleName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    setCurrentUser(matchedUser);
    setActiveRole(roleName);
  };

  const login = (user) => {
    setCurrentUser(user);
    setActiveRole(user.role);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edupulse_current_user');
  };

  const hasPermission = (allowedRoles = []) => {
    if (!allowedRoles.length) return true;
    return allowedRoles.includes(activeRole);
  };

  return (
    <AuthContext.Provider value={{ currentUser, activeRole, switchRole, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
