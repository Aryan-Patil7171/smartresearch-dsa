import { NavLink } from 'react-router-dom';
import { Kanban, Activity, Users, Settings, ChevronLeft, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../Shared/Avatar.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const NAV_ITEMS = [
  { to: '/',         icon: Kanban,       label: 'Board'      },
  { to: '/activity', icon: Activity,     label: 'Activity'   },
  { to: '/team',     icon: Users,        label: 'Team'       },
  { to: '/settings', icon: Settings,     label: 'Settings'   },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser } = useUser();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-gray-900/80 border-r border-white/10 flex flex-col shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 h-14">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-white text-lg whitespace-nowrap"
            >
              CloudDesk
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition shrink-0"
        >
          <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition group ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User badge */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Avatar user={currentUser} size="sm" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
