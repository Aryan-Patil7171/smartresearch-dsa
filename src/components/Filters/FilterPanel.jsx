import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { useFilter } from '../../context/FilterContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { TAGS, PRIORITIES, COLUMNS } from '../../data/tasks.js';
import { getPriorityConfig } from '../../utils/priority.js';
import Avatar from '../Shared/Avatar.jsx';

function Chip({ active, onClick, children, activeStyle }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium"
      style={active
        ? activeStyle || { background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#71717a' }
      }
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: '#52525b' }}>
      {children}
    </p>
  );
}

export default function FilterPanel({ open, onClose }) {
  const { filters, toggleFilter, setSearch, clearFilters, hasActiveFilters } = useFilter();
  const { users } = useUser();

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="w-64 shrink-0 flex flex-col overflow-hidden"
          style={{
            background: '#111113',
            borderRight: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-indigo-400" />
              <span className="font-semibold text-sm text-white">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasActiveFilters && (
                <button onClick={clearFilters}
                  className="text-xs px-2 py-1 rounded-lg transition font-medium"
                  style={{ color: '#818cf8', background: 'rgba(99,102,241,0.1)' }}>
                  Clear
                </button>
              )}
              <button onClick={onClose}
                className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {/* Search */}
            <div>
              <SectionLabel>Search</SectionLabel>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input
                  value={filters.search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full rounded-xl pl-8 pr-3 py-2 text-sm placeholder-gray-600 outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fafafa',
                  }}
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <SectionLabel>Priority</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map(p => {
                  const cfg = getPriorityConfig(p);
                  const active = filters.priorities.includes(p);
                  return (
                    <Chip
                      key={p}
                      active={active}
                      onClick={() => toggleFilter('priorities', p)}
                      activeStyle={{ background: `${cfg.color}20`, borderColor: `${cfg.color}40`, color: cfg.color }}
                    >
                      {cfg.label}
                    </Chip>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <SectionLabel>Status</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {COLUMNS.map(col => (
                  <Chip
                    key={col.id}
                    active={filters.statuses.includes(col.id)}
                    onClick={() => toggleFilter('statuses', col.id)}
                    activeStyle={{ background: `${col.color}20`, borderColor: `${col.color}40`, color: col.color }}
                  >
                    {col.title}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <SectionLabel>Tags</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map(tag => (
                  <Chip
                    key={tag}
                    active={filters.tags.includes(tag)}
                    onClick={() => toggleFilter('tags', tag)}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <SectionLabel>Assignee</SectionLabel>
              <div className="space-y-1">
                {users.slice(0, 10).map(u => {
                  const active = filters.assignees.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => toggleFilter('assignees', u.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition text-left"
                      style={{
                        background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <Avatar user={u} size="xs" />
                      <span className="text-xs text-gray-300 flex-1 truncate">{u.name}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
