import { useState } from 'react';
import Modal from '../Shared/Modal.jsx';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useActivity } from '../../context/ActivityContext.jsx';
import { TAGS, PRIORITIES, COLUMNS } from '../../data/tasks.js';

export default function CreateTaskModal({ open, onClose, defaultColumnId = 'todo' }) {
  const { createTask } = useTask();
  const { currentUser, users } = useUser();
  const { addActivity, ACTIVITY_TYPES } = useActivity();

  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    tags: [], assigneeId: currentUser.id,
    dueDate: '', columnId: defaultColumnId,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleTag = (tag) =>
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const task = createTask({ ...form, status: form.columnId });
    addActivity(ACTIVITY_TYPES.TASK_CREATED, currentUser.id, currentUser.name, currentUser.avatar, currentUser.color, task.id, `created task "${task.title}"`);
    setForm({ title: '', description: '', priority: 'medium', tags: [], assigneeId: currentUser.id, dueDate: '', columnId: defaultColumnId });
    onClose();
  };

  const inputCls = 'w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500 border border-white/10';
  const labelCls = 'text-xs text-gray-400 mb-1 block';

  return (
    <Modal open={open} onClose={onClose} title="Create New Task" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Task title..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="What needs to be done?" rows={3} className={`${inputCls} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputCls}>
              {PRIORITIES.map(p => <option key={p} value={p} className="bg-gray-800">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Column</label>
            <select value={form.columnId} onChange={e => set('columnId', e.target.value)} className={inputCls}>
              {COLUMNS.map(c => <option key={c.id} value={c.id} className="bg-gray-800">{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Assignee</label>
            <select value={form.assigneeId} onChange={e => set('assigneeId', e.target.value)} className={inputCls}>
              {users.map(u => <option key={u.id} value={u.id} className="bg-gray-800">{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map(tag => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded-full border transition ${form.tags.includes(tag) ? 'bg-indigo-500/30 border-indigo-500/60 text-indigo-300' : 'border-white/15 text-gray-400 hover:border-white/30'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-white/15 text-gray-400 text-sm hover:bg-white/5 transition">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Create Task</button>
        </div>
      </form>
    </Modal>
  );
}
