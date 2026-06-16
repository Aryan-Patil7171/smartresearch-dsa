import { useState } from 'react';
import { Plus, Trash2, ArrowUpRight, CheckCircle2, Circle } from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import ProgressBar from '../Shared/ProgressBar.jsx';

/**
 * Big Task Breakdown – lets users split large tasks into subtasks.
 * Subtasks can be marked done or promoted to standalone task cards.
 */
export default function SubtaskBreakdown({ taskId }) {
  const { getTaskById, addSubtask, deleteSubtask, toggleSubtask, promoteSubtask } = useTask();
  const { permissions } = useUser();
  const task = getTaskById(taskId);
  const [newText, setNewText] = useState('');
  const subtasks = task?.subtasks || [];
  const done = subtasks.filter(s => s.done).length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addSubtask(taskId, { id: `sub_${Date.now()}`, text: newText.trim(), done: false });
    setNewText('');
  };

  return (
    <div>
      <p className="text-sm font-semibold text-white mb-1">Big Task Breakdown</p>
      <p className="text-xs text-gray-500 mb-4">
        Break this task into smaller steps. Subtasks can be promoted to standalone cards.
      </p>

      {subtasks.length > 0 && (
        <ProgressBar value={done} max={subtasks.length} color="#10b981" className="mb-4" />
      )}

      {/* Example suggestion for new tasks */}
      {subtasks.length === 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-indigo-300 font-medium mb-2">💡 Example breakdown for "{task?.title}"</p>
          <div className="space-y-1">
            {['Research & Planning', 'Design', 'Implementation', 'Testing', 'Deployment'].map(s => (
              <p key={s} className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" /> {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-2 mb-4">
        {subtasks.map(sub => (
          <div key={sub.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 group">
            <button
              disabled={!permissions.canEdit}
              onClick={() => toggleSubtask(taskId, sub.id)}
              className={`shrink-0 transition ${sub.done ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`}
            >
              {sub.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            </button>
            <span className={`flex-1 text-sm ${sub.done ? 'line-through text-gray-500' : 'text-gray-200'}`}>
              {sub.text}
            </span>
            {permissions.canCreate && (
              <button
                onClick={() => promoteSubtask(taskId, sub.id)}
                title="Promote to task card"
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-indigo-400 transition"
              >
                <ArrowUpRight size={14} />
              </button>
            )}
            {permissions.canDelete && (
              <button
                onClick={() => deleteSubtask(taskId, sub.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add subtask */}
      {permissions.canEdit && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Add a step..."
            className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-indigo-600 rounded-lg text-white text-sm hover:bg-indigo-700 transition flex items-center gap-1"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      )}
    </div>
  );
}
