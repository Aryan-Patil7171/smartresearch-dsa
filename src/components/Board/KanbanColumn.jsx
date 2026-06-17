import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskCard from '../TaskCard/TaskCard.jsx';
import { ColumnErrorBoundary } from '../Shared/ErrorBoundary.jsx';
import CreateTaskModal from './CreateTaskModal.jsx';
import { useUser } from '../../context/UserContext.jsx';

const COLUMN_GRADIENTS = {
  backlog:    'rgba(107,114,128,0.15)',
  todo:       'rgba(59,130,246,0.12)',
  inprogress: 'rgba(245,158,11,0.12)',
  review:     'rgba(168,85,247,0.12)',
  done:       'rgba(16,185,129,0.12)',
};

function ColumnInner({ column, tasks }) {
  const { permissions } = useUser();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col w-[285px] shrink-0">
      {/* Column header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-t-2xl mb-0"
        style={{
          background: COLUMN_GRADIENTS[column.id] || 'rgba(255,255,255,0.05)',
          border: `1px solid rgba(255,255,255,0.07)`,
          borderBottom: 'none',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: column.color, boxShadow: `0 0 6px ${column.color}80` }}
          />
          <h3 className="font-semibold text-sm text-white tracking-tight">{column.title}</h3>
          <motion.span
            key={tasks.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#a1a1aa',
              minWidth: 20,
              textAlign: 'center',
            }}
          >
            {tasks.length}
          </motion.span>
        </div>
        {permissions.canCreate && (
          <button
            onClick={() => setCreateOpen(true)}
            className="p-1.5 rounded-lg transition text-gray-600 hover:text-gray-200 hover:bg-white/10"
            title="Add task"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Drop zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 min-h-[100px] p-2 rounded-b-2xl transition-all"
            style={{
              background: snapshot.isDraggingOver
                ? COLUMN_GRADIENTS[column.id] || 'rgba(99,102,241,0.08)'
                : 'rgba(255,255,255,0.025)',
              border: `1px solid ${snapshot.isDraggingOver ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
              borderTop: 'none',
              outline: snapshot.isDraggingOver ? '2px dashed rgba(99,102,241,0.3)' : 'none',
              outlineOffset: '-4px',
            }}
          >
            {tasks.map((task, idx) => (
              <TaskCard key={task.id} task={task} index={idx} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-20 gap-1">
                <p className="text-xs text-gray-700">No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} defaultColumnId={column.id} />
    </div>
  );
}

export default function KanbanColumn({ column, tasks }) {
  return (
    <ColumnErrorBoundary>
      <ColumnInner column={column} tasks={tasks} />
    </ColumnErrorBoundary>
  );
}
