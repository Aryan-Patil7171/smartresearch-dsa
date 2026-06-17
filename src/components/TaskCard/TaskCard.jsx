import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, AlertCircle, GripVertical } from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { CardErrorBoundary } from '../Shared/ErrorBoundary.jsx';
import Avatar from '../Shared/Avatar.jsx';
import { getPriorityConfig } from '../../utils/priority.js';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date.js';

const PRIORITY_COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#f59e0b',
  low:      '#10b981',
};

function TaskCardInner({ task, index }) {
  const { setSelectedTaskId } = useTask();
  const { users } = useUser();
  const assignee = users.find(u => u.id === task.assigneeId);
  const priorityCfg = getPriorityConfig(task.priority);
  const overdue   = isOverdue(task.dueDate);
  const dueSoon   = isDueSoon(task.dueDate);
  const checkDone  = (task.checklist || []).filter(c => c.done).length;
  const checkTotal = (task.checklist || []).length;
  const pct = checkTotal > 0 ? Math.round((checkDone / checkTotal) * 100) : 0;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-2.5"
        >
          <motion.div
            layout
            onClick={() => setSelectedTaskId(task.id)}
            whileHover={{ y: -1 }}
            className={`
              group relative rounded-2xl p-4 cursor-pointer select-none overflow-hidden
              transition-all duration-200
              ${snapshot.isDragging
                ? 'rotate-1 scale-[1.03]'
                : ''
              }
            `}
            style={{
              background: snapshot.isDragging
                ? 'rgba(99,102,241,0.12)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${snapshot.isDragging ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
              boxShadow: snapshot.isDragging
                ? '0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3)'
                : '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            {/* Priority left border */}
            <div
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            />

            {/* Drag handle */}
            <div
              {...provided.dragHandleProps}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition p-1 rounded-lg hover:bg-white/10 text-gray-600"
            >
              <GripVertical size={13} />
            </div>

            {/* Tags */}
            {task.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {task.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#71717a' }}>
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <p className="text-sm font-semibold text-white leading-snug mb-1.5 pr-4 line-clamp-2">
              {task.title}
            </p>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Checklist progress bar */}
            {checkTotal > 0 && (
              <div className="mb-3">
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ background: pct === 100 ? '#10b981' : '#6366f1' }}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Due date */}
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-xs rounded-lg px-2 py-0.5 font-medium ${
                  overdue
                    ? 'text-red-400 bg-red-500/10'
                    : dueSoon
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-gray-500'
                }`}>
                  {overdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                  {formatDate(task.dueDate)}
                </div>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                {/* Checklist count */}
                {checkTotal > 0 && (
                  <div className={`flex items-center gap-1 text-xs ${
                    checkDone === checkTotal ? 'text-emerald-400' : 'text-gray-600'
                  }`}>
                    <CheckSquare size={11} />
                    <span>{checkDone}/{checkTotal}</span>
                  </div>
                )}

                {/* Priority pill */}
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${PRIORITY_COLORS[task.priority]}18`,
                    color: PRIORITY_COLORS[task.priority],
                    border: `1px solid ${PRIORITY_COLORS[task.priority]}30`,
                  }}
                >
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

export default function TaskCard({ task, index }) {
  return (
    <CardErrorBoundary key={task.id}>
      <TaskCardMemo task={task} index={index} />
    </CardErrorBoundary>
  );
}
