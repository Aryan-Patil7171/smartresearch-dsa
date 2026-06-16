import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, Tag, AlertCircle } from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { CardErrorBoundary } from '../Shared/ErrorBoundary.jsx';
import Avatar from '../Shared/Avatar.jsx';
import Badge from '../Shared/Badge.jsx';
import { getPriorityConfig } from '../../utils/priority.js';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date.js';

const PRIORITY_DOT = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981' };

function TaskCardInner({ task, index }) {
  const { setSelectedTaskId } = useTask();
  const { users } = useUser();
  const assignee = users.find(u => u.id === task.assigneeId);
  const priorityCfg = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.dueDate);
  const dueSoon = isDueSoon(task.dueDate);
  const checkDone = (task.checklist || []).filter(c => c.done).length;
  const checkTotal = (task.checklist || []).length;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <motion.div
            layout
            whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            onClick={() => setSelectedTaskId(task.id)}
            className={`
              bg-gray-800/80 border rounded-xl p-4 cursor-pointer
              transition-colors select-none
              ${snapshot.isDragging
                ? 'border-indigo-500/70 shadow-xl shadow-indigo-500/20 rotate-1 scale-105'
                : 'border-white/10 hover:border-white/20'}
            `}
          >
            {/* Priority strip */}
            <div
              className="w-full h-0.5 rounded-full mb-3 opacity-70"
              style={{ backgroundColor: PRIORITY_DOT[task.priority] }}
            />

            {/* Tags row */}
            {task.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-gray-400">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <p className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2">
              {task.title}
            </p>

            {/* Description preview */}
            {task.description && (
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{task.description}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Due date */}
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : dueSoon ? 'text-amber-400' : 'text-gray-500'}`}>
                  {overdue
                    ? <AlertCircle size={11} />
                    : <Calendar size={11} />}
                  {formatDate(task.dueDate)}
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {/* Checklist */}
                {checkTotal > 0 && (
                  <div className={`flex items-center gap-1 text-xs ${checkDone === checkTotal ? 'text-emerald-400' : 'text-gray-500'}`}>
                    <CheckSquare size={11} />
                    {checkDone}/{checkTotal}
                  </div>
                )}

                {/* Priority badge */}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium border ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}>
                  {priorityCfg.label}
                </span>

                {/* Assignee */}
                {assignee && <Avatar user={assignee} size="xs" />}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}

const TaskCardMemo = memo(TaskCardInner);

/** Wrapped with its own Error Boundary */
export default function TaskCard({ task, index }) {
  return (
    <CardErrorBoundary key={task.id}>
      <TaskCardMemo task={task} index={index} />
    </CardErrorBoundary>
  );
}
