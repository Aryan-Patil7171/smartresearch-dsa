import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Search } from 'lucide-react';
import { useFilter } from '../../context/FilterContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { TAGS, PRIORITIES, COLUMNS } from '../../data/tasks.js';
import { getPriorityConfig } from '../../utils/priority.js';
import Avatar from '../Shared/Avatar.jsx';

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
        active
          ? 'bg-indigo-500/30 border-indigo-500/60 text-indigo-300'
          : 'border-white/15 text-gray-400 hover:border-white/30 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterPanel({ open, onClose }) {
  const { filters, toggleFilter, setSearch, clearFilters, hasActiveFilters } = useFilter();
  const { users } = useUser();

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="fixed left-0 top-0 h-full w-72 bg-gray-900 border-r border-white/10 z-40 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-indigo-400" />
              <h2 className="font-semibold text-white">Filters</h2>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-500/10 transition">
                  Clear all
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Search</p>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={filters.search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full bg-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Priority</p>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map(p => {
                  const cfg = getPriorityConfig(p);
                  return (
                    <button
                      key={p}
                      onClick={() => toggleFilter('priorities', p)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
                        filters.priorities.includes(p)
                          ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                          : 'border-white/15 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {COLUMNS.map(col => (
                  <FilterChip
                    key={col.id}
                    active={filters.statuses.includes(col.id)}
                    onClick={() => toggleFilter('statuses', col.id)}
                  >
                    {col.title}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map(tag => (
                  <FilterChip
                    key={tag}
                    active={filters.tags.includes(tag)}
                    onClick={() => toggleFilter('tags', tag)}
                  >
                    {tag}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Assignee</p>
              <div className="space-y-1.5">
                {users.slice(0, 10).map(u => (
                  <button
                    key={u.id}
                    onClick={() => toggleFilter('assignees', u.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition text-left ${
                      filters.assignees.includes(u.id)
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                        : 'border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <Avatar user={u} size="xs" />
                    <span className="text-xs">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
