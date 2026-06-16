import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MOCK_TASKS, COLUMNS } from '../data/tasks.js';

const TaskContext = createContext(null);

function loadTasks() {
  try {
    const saved = localStorage.getItem('cd_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  } catch { return MOCK_TASKS; }
}

function saveTasks(tasks) {
  try { localStorage.setItem('cd_tasks', JSON.stringify(tasks)); } catch {}
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasks);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Auto-save to localStorage on every change
  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const getTaskById = useCallback((id) => tasks.find(t => t.id === id), [tasks]);

  const getTasksByColumn = useCallback((columnId) =>
    tasks
      .filter(t => t.columnId === columnId)
      .sort((a, b) => a.order - b.order),
    [tasks]
  );

  const createTask = useCallback((taskData) => {
    const colTasks = tasks.filter(t => t.columnId === taskData.columnId);
    const newTask = {
      id: `t_${Date.now()}`,
      order: colTasks.length,
      createdAt: new Date().toISOString().split('T')[0],
      checklist: [],
      subtasks: [],
      ...taskData,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [tasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((taskId, fromColId, toColId, newOrder) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          return { ...t, columnId: toColId, status: toColId, order: newOrder };
        }
        return t;
      });
      return updated;
    });
  }, []);

  /** Full column reorder after a DnD drop */
  const reorderTasks = useCallback((newTasksArray) => {
    setTasks(newTasksArray);
  }, []);

  const toggleChecklistItem = useCallback((taskId, itemId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        checklist: t.checklist.map(c =>
          c.id === itemId ? { ...c, done: !c.done } : c
        ),
      };
    }));
  }, []);

  const addChecklistItem = useCallback((taskId, text) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        checklist: [...t.checklist, { id: `c_${Date.now()}`, text, done: false }],
      };
    }));
  }, []);

  const deleteChecklistItem = useCallback((taskId, itemId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, checklist: t.checklist.filter(c => c.id !== itemId) };
    }));
  }, []);

  const addSubtask = useCallback((taskId, subtask) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: [...(t.subtasks || []), subtask] };
    }));
  }, []);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: (t.subtasks || []).filter(s => s.id !== subtaskId) };
    }));
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: (t.subtasks || []).map(s =>
          s.id === subtaskId ? { ...s, done: !s.done } : s
        ),
      };
    }));
  }, []);

  /** Promote a subtask to a standalone task card */
  const promoteSubtask = useCallback((parentTaskId, subtaskId) => {
    const parent = tasks.find(t => t.id === parentTaskId);
    if (!parent) return;
    const sub = (parent.subtasks || []).find(s => s.id === subtaskId);
    if (!sub) return;
    const colTasks = tasks.filter(t => t.columnId === 'todo');
    const newTask = {
      id: `t_${Date.now()}`,
      title: sub.text,
      description: `Promoted from subtask of: ${parent.title}`,
      priority: parent.priority,
      tags: [],
      assigneeId: parent.assigneeId,
      dueDate: parent.dueDate,
      status: 'todo',
      columnId: 'todo',
      order: colTasks.length,
      createdAt: new Date().toISOString().split('T')[0],
      checklist: [],
      subtasks: [],
    };
    setTasks(prev => [
      ...prev.map(t => {
        if (t.id !== parentTaskId) return t;
        return { ...t, subtasks: (t.subtasks || []).filter(s => s.id !== subtaskId) };
      }),
      newTask,
    ]);
    return newTask;
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks, columns: COLUMNS,
      selectedTaskId, setSelectedTaskId,
      getTaskById, getTasksByColumn,
      createTask, updateTask, deleteTask,
      moveTask, reorderTasks,
      toggleChecklistItem, addChecklistItem, deleteChecklistItem,
      addSubtask, deleteSubtask, toggleSubtask, promoteSubtask,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be inside TaskProvider');
  return ctx;
};
