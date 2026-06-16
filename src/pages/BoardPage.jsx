import { useState } from 'react';
import KanbanBoard from '../components/Board/KanbanBoard.jsx';
import TaskDrawer from '../components/TaskDrawer/TaskDrawer.jsx';
import FilterPanel from '../components/Filters/FilterPanel.jsx';
import Header from '../components/Layout/Header.jsx';
import { useFilter } from '../context/FilterContext.jsx';
import { useTask } from '../context/TaskContext.jsx';

export default function BoardPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { hasActiveFilters } = useFilter();
  const { tasks, columns } = useTask();

  return (
    <div className="flex flex-col h-full">
      <Header onFilterToggle={() => setFilterOpen(v => !v)} filterOpen={filterOpen} />

      {/* Board stats */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10">
        {columns.map(col => {
          const count = tasks.filter(t => t.columnId === col.id).length;
          return (
            <div key={col.id} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span>{col.title}</span>
              <span className="font-semibold text-gray-300">{count}</span>
            </div>
          );
        })}
        <span className="ml-auto text-xs text-gray-600">{tasks.length} total tasks</span>
        {hasActiveFilters && (
          <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Filters active
          </span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

        {/* Kanban Board */}
        <div className="flex-1 overflow-auto">
          <KanbanBoard />
        </div>
      </div>

      {/* Task Drawer */}
      <TaskDrawer />
    </div>
  );
}
