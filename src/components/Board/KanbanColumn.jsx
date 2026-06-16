import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskCard from '../TaskCard/TaskCard.jsx';
import { ColumnErrorBoundary } from '../Shared/ErrorBoundary.jsx';
import CreateTaskModal from './CreateTaskModal.jsx';
import { useUser } from '../../context/UserContext.jsx';

function ColumnInner({ column, tasks }) {
  const { permissions } = useUser();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: column.color }} />
          <h3 className="font-semibold text-sm text-white">{column.title}</h3>
          <span className="text-xs bg-white/10 text-gray-400 rounded-full px-2 py-0.5 font-medium">
            {tasks.length}
          </span>
        </div>
        {permissions.canCreate && (
          <button
            onClick={() => setCreateOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
            title="Add task"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      {/* Drop zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 min-h-[120px] rounded-2xl p-2 transition-colors
              ${snapshot.isDraggingOver ? 'bg-indigo-500/10 border-2 border-dashed border-indigo-500/40' : 'bg-white/5 border-2 border-transparent'}
            `}
          >
            {tasks.map((task, idx) => (
              <TaskCard key={task.id} task={task} index={idx} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-24 text-gray-600">
                <p className="text-xs">Drop tasks here</p>
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
