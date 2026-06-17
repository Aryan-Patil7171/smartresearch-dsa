import { useState } from 'react';
import { Plus, Filter, Sun, Moon, Bell, Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useFilter } from '../../context/FilterContext.jsx';
import CreateTaskModal from '../Board/CreateTaskModal.jsx';
import Avatar from '../Shared/Avatar.jsx';

export default function Header({ onFilterToggle, filterOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { tasks } = useTask();
  const { permissions, currentUser } = useUser();
  const { hasActiveFilters, filters, setSearch, clearFilters } = useFilter();
  const [createOpen, setCreateOpen] = useState(false);

  const overdueCount = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return (
    <>
      <header
        className="flex items-center px-5 gap-3 shrink-0 sticky top-0 z-30"
        style={{
          height: 56,
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            value={filters.search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-xl pl-9 pr-9 py-2 text-sm placeholder-gray-600 outline-none transition"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fafafa',
            }}
          />
          {filters.search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Filter button */}
          <button
            onClick={onFilterToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition ${
              filterOpen || hasActiveFilters
                ? 'text-indigo-300'
                : 'text-gray-500 hover:text-gray-200'
            }`}
            style={{
              background: filterOpen || hasActiveFilters ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${filterOpen || hasActiveFilters ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            )}
          </button>

          {/* Overdue bell */}
          <button
            className="relative p-2 rounded-xl transition text-gray-500 hover:text-gray-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            title={overdueCount > 0 ? `${overdueCount} overdue tasks` : 'No overdue tasks'}
          >
            <Bell size={15} />
            {overdueCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold leading-none">
                {overdueCount > 9 ? '9+' : overdueCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition text-gray-500 hover:text-gray-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Separator */}
          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Avatar */}
          <Avatar user={currentUser} size="sm" />

          {/* New Task */}
          {permissions.canCreate && (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-white transition ml-1"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          )}
        </div>
      </header>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
