import { useState } from 'react';
import KanbanBoard from '../components/Board/KanbanBoard.jsx';
import TaskDrawer from '../components/TaskDrawer/TaskDrawer.jsx';
import FilterPanel from '../components/Filters/FilterPanel.jsx';
import Header from '../components/Layout/Header.jsx';
import { useFilter } from '../context/FilterContext.jsx';
import { useTask } from '../context/TaskContext.jsx';
import { motion } from 'framer-motion';

export default function BoardPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { hasActiveFilters } = useFilter();
  const { tasks, columns } = useTask();

  const doneCount = tasks.filter(t => t.columnId === 'done').length;
  const totalCount = tasks.length;
  const completionPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <Header onFilterToggle={() => setFilterOpen(v => !v)} filterOpen={filterOpen} />

      {/* Stats bar */}
      <div
        className="flex items-center gap-5 px-6 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Column stats */}
        <div className="flex items-center gap-4">
          {columns.map(col => {
            const count = tasks.filter(t => t.columnId === col.id).length;
            return (
              <div key={col.id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-xs text-gray-600">{col.title}</span>
                <span className="text-xs font-bold text-gray-300">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Completion */}
        <div className="ml-auto flex items-center gap-3">
          {hasActiveFilters && (
            <span className="text-xs text-indigo-400 px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
              Filtered
            </span>
          )}
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #10b981)' }}
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">{completionPct}% done</span>
          </div>
          <span className="text-xs text-gray-700">{totalCount} tasks</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
        <div className="flex-1 overflow-auto">
          <KanbanBoard />
        </div>
      </div>

      <TaskDrawer />
    </div>
  );
}
