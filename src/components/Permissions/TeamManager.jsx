import { useState } from 'react';
import { Users, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext.jsx';
import { ROLE_PERMISSIONS } from '../../data/users.js';
import Avatar from '../Shared/Avatar.jsx';

const ROLES = ['admin', 'manager', 'member', 'viewer'];

function RoleBadge({ role }) {
  const cfg = ROLE_PERMISSIONS[role];
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium border"
      style={{ backgroundColor: `${cfg.color}22`, color: cfg.color, borderColor: `${cfg.color}44` }}
    >
      {cfg.label}
    </span>
  );
}

export default function TeamManager({ onClose }) {
  const { users, currentUser, permissions, updateUserRole, switchUser } = useUser();
  const [expandedId, setExpandedId] = useState(null);

  const canManage = permissions.canManageUsers;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-indigo-400" />
          <h2 className="font-semibold text-white">Team Access</h2>
          <span className="text-xs bg-white/10 text-gray-400 rounded-full px-2 py-0.5">{users.length}</span>
        </div>
        {!canManage && (
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <Shield size={12} /> View only
          </span>
        )}
      </div>

      {/* Current user switcher (dev helper) */}
      <div className="p-3 bg-indigo-500/10 border-b border-indigo-500/20 m-3 rounded-xl">
        <p className="text-xs text-indigo-400 mb-2 font-medium">👤 Acting as</p>
        <div className="flex items-center gap-2">
          <Avatar user={currentUser} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{currentUser.name}</p>
            <RoleBadge role={currentUser.role} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Switch user to test permissions:</p>
        <select
          value={currentUser.id}
          onChange={e => switchUser(e.target.value)}
          className="mt-1.5 w-full bg-gray-800 text-sm text-white rounded-lg px-2 py-1.5 outline-none border border-white/10"
        >
          {users.map(u => (
            <option key={u.id} value={u.id} className="bg-gray-800">
              {u.name} ({ROLE_PERMISSIONS[u.role]?.label})
            </option>
          ))}
        </select>
      </div>

      {/* Permission summary */}
      <div className="mx-3 mb-3 grid grid-cols-2 gap-2">
        {Object.entries({
          'Create tasks': permissions.canCreate,
          'Edit tasks': permissions.canEdit,
          'Delete tasks': permissions.canDelete,
          'Move tasks': permissions.canMove,
          'Manage users': permissions.canManageUsers,
          'View all': permissions.canViewAll,
        }).map(([label, allowed]) => (
          <div key={label} className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg ${allowed ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            <span>{allowed ? '✓' : '✗'}</span> {label}
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {users.map(user => (
          <div key={user.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
            <div
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition"
              onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
            >
              <Avatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <ChevronDown size={14} className={`text-gray-500 transition ${expandedId === user.id ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {expandedId === user.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 border-t border-white/10">
                    {canManage ? (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1.5">Change role:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ROLES.map(r => {
                            const cfg = ROLE_PERMISSIONS[r];
                            return (
                              <button
                                key={r}
                                onClick={() => updateUserRole(user.id, r)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                                  user.role === r
                                    ? 'text-white font-semibold'
                                    : 'border-white/15 text-gray-400 hover:border-white/30'
                                }`}
                                style={user.role === r ? { backgroundColor: `${cfg.color}30`, borderColor: `${cfg.color}60`, color: cfg.color } : {}}
                              >
                                {cfg.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
                        <Shield size={12} /> You don't have permission to change roles.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
