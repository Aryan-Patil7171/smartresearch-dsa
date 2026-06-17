import { NavLink } from 'react-router-dom';
import { Kanban, Activity, Users, Settings, ChevronLeft, Zap, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../Shared/Avatar.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useTask } from '../../context/TaskContext.jsx';
import { ROLE_PERMISSIONS } from '../../data/users.js';
import { useState } from 'react';
import CreateTaskModal from '../Board/CreateTaskModal.jsx';

const NAV_ITEMS = [
  { to: '/',         icon: Kanban,    label: 'Board',    badge: null    },
  { to: '/activity', icon: Activity,  label: 'Activity', badge: null    },
  { to: '/team',     icon: Users,     label: 'Team',     badge: null    },
  { to: '/settings', icon: Settings,  label: 'Settings', badge: null    },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser, permissions } = useUser();
  const { tasks } = useTask();
  const [createOpen, setCreateOpen] = useState(false);

  const overdueCount = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const roleCfg = ROLE_PERMISSIONS[currentUser.role];

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="h-full flex flex-col shrink-0 overflow-hidden relative"
        style={{ background: 'linear-gradient(180deg, #111113 0%, #0d0d0f 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 glow-indigo"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap size={15} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-bold text-white text-base leading-none tracking-tight">CloudDesk</span>
                <span className="text-xs text-gray-600 leading-none mt-0.5">Workspace</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition shrink-0"
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Quick add */}
        {permissions.canCreate && (
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={() => setCreateOpen(true)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition
                ${collapsed ? 'justify-center' : ''}
              `}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
              title="New Task"
            >
              <Plus size={15} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    New Task
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
                ${isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon size={17} className={`shrink-0 relative z-10 ${isActive ? 'text-indigo-400' : ''}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap relative z-10"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Overdue badge on Board */}
                  {to === '/' && overdueCount > 0 && (
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold relative z-10"
                        >
                          {overdueCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 mb-2" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* User card */}
        <div className="p-3">
          <div className={`flex items-center gap-2.5 overflow-hidden rounded-xl px-2 py-2 hover:bg-white/5 transition cursor-default ${collapsed ? 'justify-center px-0' : ''}`}>
            <Avatar user={currentUser} size="sm" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="text-xs font-semibold text-white truncate leading-none">{currentUser.name}</p>
                  <p className="text-xs mt-0.5 font-medium truncate" style={{ color: roleCfg?.color || '#6366f1' }}>
                    {roleCfg?.label}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
