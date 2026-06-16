import { createContext, useContext, useState } from 'react';
import { MOCK_USERS, ROLE_PERMISSIONS } from '../data/users.js';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cd_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_USERS[0]; // Default: Alice (admin)
  });

  const [users, setUsers] = useState(MOCK_USERS);

  const switchUser = (userId) => {
    const u = users.find(u => u.id === userId);
    if (u) {
      setCurrentUser(u);
      try { localStorage.setItem('cd_current_user', JSON.stringify(u)); } catch {}
    }
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const permissions = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.viewer;

  return (
    <UserContext.Provider value={{ currentUser, users, permissions, switchUser, updateUserRole }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
};
