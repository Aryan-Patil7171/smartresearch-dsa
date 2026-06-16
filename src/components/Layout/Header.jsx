import { useState } from 'react';
import { Plus, Filter, Sun, Moon, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useFilter } from '../../context/FilterContext.jsx';
import CreateTaskModal from '../Board/CreateTaskModal.jsx';

export default function Header({ onFilterToggle, filterOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { tasks } = useTask();
  const { permissions } = useUser();
  const { hasActiveFilters, filters, setSearch } = useFilter();
  const [createOpen, setCreateOpen] = useState(false);

  const overdueCount = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return (
    <>
      <header className="h-14 bg-gray-900/80 border-b border-white/10 flex items-center px-4 gap-3 shrink-0 backdrop-blur-sm sticky top-0 z-30">
        {/* Search bar */}
        <div className="flex-1 max-w-sm relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={filters.search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-white/10 rounded-xl pl-9 pr-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500 border border-white/10"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Filter toggle */}
          <button
            onClick={onFilterToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition border ${
              filterOpen || hasActiveFilters
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'border-white/15 text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
          </button>

          {/* Overdue badge */}
          {overdueCount > 0 && (
            <div className="relative">
              <button className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition">
                <Bell size={16} />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {overdueCount > 9 ? '9+' : overdueCount}
              </span>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Create task */}
          {permissions.canCreate && (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
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
