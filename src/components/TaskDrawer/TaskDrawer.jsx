import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, User, Paperclip, CheckSquare, Activity, ChevronDown, Plus, Trash2, Edit3, Save } from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useActivity } from '../../context/ActivityContext.jsx';
import Avatar from '../Shared/Avatar.jsx';
import Badge from '../Shared/Badge.jsx';
import ProgressBar from '../Shared/ProgressBar.jsx';
import { getPriorityConfig } from '../../utils/priority.js';
import { formatDate, formatDateTime } from '../../utils/date.js';
import { COLUMNS } from '../../data/tasks.js';
import SubtaskBreakdown from './SubtaskBreakdown.jsx';

const MOCK_FILES = ['design-spec-v2.figma', 'architecture-diagram.png', 'api-contract.yaml'];

export default function TaskDrawer() {
  const { selectedTaskId, setSelectedTaskId, getTaskById, updateTask, toggleChecklistItem, addChecklistItem, deleteChecklistItem } = useTask();
  const { users, currentUser, permissions } = useUser();
  const { activities, addActivity, ACTIVITY_TYPES } = useActivity();

  const task = selectedTaskId ? getTaskById(selectedTaskId) : null;
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newCheckItem, setNewCheckItem] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const drawerRef = useRef(null);

  useEffect(() => {
    if (task) { setEditData({ title: task.title, description: task.description }); setEditing(false); }
  }, [task?.id]);

  useEffect(() => {
    if (!selectedTaskId) return;
    const handler = (e) => { if (e.key === 'Escape') setSelectedTaskId(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedTaskId]);

  const handleSave = () => {
    updateTask(task.id, editData);
    addActivity(ACTIVITY_TYPES.TASK_UPDATED, currentUser.id, currentUser.name, currentUser.avatar, currentUser.color, task.id, `updated task "${editData.title}"`);
    setEditing(false);
  };

  const handleAddCheck = (e) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    addChecklistItem(task.id, newCheckItem.trim());
    setNewCheckItem('');
  };

  const taskActivities = activities.filter(a => a.taskId === task?.id).slice(0, 20);
  const assignee = users.find(u => u.id === task?.assigneeId);
  const priorityCfg = task ? getPriorityConfig(task.priority) : {};
  const checkDone = (task?.checklist || []).filter(c => c.done).length;
  const checkTotal = (task?.checklist || []).length;

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setSelectedTaskId(null)}
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-white/10 gap-3">
              <div className="flex-1 min-w-0">
                {editing ? (
                  <input
                    autoFocus
                    value={editData.title}
                    onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                    className="w-full bg-white/10 rounded-lg px-3 py-1.5 text-white font-semibold text-base outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <h2 className="font-bold text-lg text-white leading-snug truncate">{task.title}</h2>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}>
                    {priorityCfg.label}
                  </span>
                  <span className="text-xs text-gray-500">#{task.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {permissions.canEdit && (
                  editing
                    ? <button onClick={handleSave} className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"><Save size={15} /></button>
                    : <button onClick={() => setEditing(true)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"><Edit3 size={15} /></button>
                )}
                <button onClick={() => setSelectedTaskId(null)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"><X size={18} /></button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-5">
              {['details', 'subtasks', 'activity'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition ${activeTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {activeTab === 'details' && (
                <>
                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assignee</p>
                      {assignee
                        ? <div className="flex items-center gap-2"><Avatar user={assignee} size="sm" /><span className="text-sm text-white">{assignee.name}</span></div>
                        : <span className="text-sm text-gray-500">Unassigned</span>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Due Date</p>
                      <p className="text-sm text-white">{formatDate(task.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm text-white capitalize">{task.status?.replace('inprogress', 'In Progress')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created</p>
                      <p className="text-sm text-white">{formatDate(task.createdAt)}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {task.tags?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Tag size={12} /> Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Description</p>
                    {editing ? (
                      <textarea
                        value={editData.description}
                        onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                        rows={4}
                        className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-300 leading-relaxed">{task.description || 'No description.'}</p>
                    )}
                  </div>

                  {/* Mock Files */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Paperclip size={12} /> Files</p>
                    <div className="space-y-1.5">
                      {MOCK_FILES.map(f => (
                        <div key={f} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer transition">
                          <Paperclip size={13} className="text-gray-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1"><CheckSquare size={12} /> Checklist</p>
                    </div>
                    {checkTotal > 0 && <ProgressBar value={checkDone} max={checkTotal} className="mb-3" />}
                    <div className="space-y-2">
                      {(task.checklist || []).map(item => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <input
                            type="checkbox"
                            checked={item.done}
                            disabled={!permissions.canEdit}
                            onChange={() => toggleChecklistItem(task.id, item.id)}
                            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                          />
                          <span className={`flex-1 text-sm ${item.done ? 'line-through text-gray-500' : 'text-gray-200'}`}>{item.text}</span>
                          {permissions.canEdit && (
                            <button onClick={() => deleteChecklistItem(task.id, item.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {permissions.canEdit && (
                      <form onSubmit={handleAddCheck} className="flex gap-2 mt-3">
                        <input
                          value={newCheckItem}
                          onChange={e => setNewCheckItem(e.target.value)}
                          placeholder="Add item..."
                          className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button type="submit" className="px-3 py-1.5 bg-indigo-600 rounded-lg text-white text-sm hover:bg-indigo-700 transition">
                          <Plus size={14} />
                        </button>
                      </form>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'subtasks' && (
                <SubtaskBreakdown taskId={task.id} />
              )}

              {activeTab === 'activity' && (
                <div>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1"><Activity size={12} /> Activity ({taskActivities.length})</p>
                  {taskActivities.length === 0
                    ? <p className="text-sm text-gray-600">No activity yet.</p>
                    : (
                      <div className="space-y-3">
                        {taskActivities.map(act => (
                          <div key={act.id} className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ backgroundColor: act.userColor }}>
                              {act.userAvatar}
                            </div>
                            <div>
                              <p className="text-sm text-gray-200"><span className="font-semibold">{act.userName}</span> {act.message}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(act.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
