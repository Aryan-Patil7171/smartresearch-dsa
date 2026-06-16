import { DragDropContext } from '@hello-pangea/dnd';
import { useTask } from '../../context/TaskContext.jsx';
import { useFilter } from '../../context/FilterContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useActivity } from '../../context/ActivityContext.jsx';
import { applyFilters } from '../../utils/filters.js';
import KanbanColumn from './KanbanColumn.jsx';

export default function KanbanBoard() {
  const { tasks, columns, reorderTasks } = useTask();
  const { filters } = useFilter();
  const { currentUser, permissions } = useUser();
  const { addActivity, ACTIVITY_TYPES } = useActivity();

  const filteredIds = new Set(applyFilters(tasks, filters).map(t => t.id));

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (!permissions.canMove) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const fromCol = source.droppableId;
    const toCol = destination.droppableId;

    // Build updated tasks array
    const tasksCopy = [...tasks];

    // Remove from source
    const sourceTasks = tasksCopy
      .filter(t => t.columnId === fromCol)
      .sort((a, b) => a.order - b.order);
    sourceTasks.splice(source.index, 1);

    // Insert into destination
    const destTasks = fromCol === toCol
      ? sourceTasks
      : tasksCopy.filter(t => t.columnId === toCol).sort((a, b) => a.order - b.order);
    const updatedTask = { ...task, columnId: toCol, status: toCol };
    destTasks.splice(destination.index, 0, updatedTask);

    // Reassign order values
    const updatedAll = tasksCopy.map(t => {
      if (t.id === draggableId) return { ...updatedTask };
      if (t.columnId === fromCol) {
        const idx = sourceTasks.findIndex(s => s.id === t.id);
        return idx >= 0 ? { ...t, order: idx } : t;
      }
      if (t.columnId === toCol && fromCol !== toCol) {
        const idx = destTasks.findIndex(s => s.id === t.id);
        return idx >= 0 ? { ...t, order: idx } : t;
      }
      return t;
    });

    // Apply dest order if same column
    if (fromCol === toCol) {
      const colIds = new Set(destTasks.map(t => t.id));
      const reordered = updatedAll.map(t => {
        if (!colIds.has(t.id)) return t;
        const idx = destTasks.findIndex(s => s.id === t.id);
        return { ...t, order: idx };
      });
      reorderTasks(reordered);
    } else {
      reorderTasks(updatedAll);
    }

    if (fromCol !== toCol) {
      const toColTitle = columns.find(c => c.id === toCol)?.title || toCol;
      addActivity(
        ACTIVITY_TYPES.TASK_MOVED,
        currentUser.id, currentUser.name, currentUser.avatar, currentUser.color,
        draggableId, `moved task "${task.title}" to ${toColTitle}`
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-6 px-6 pt-2 min-h-full">
        {columns.map(col => {
          const colTasks = tasks
            .filter(t => t.columnId === col.id && filteredIds.has(t.id))
            .sort((a, b) => a.order - b.order);
          return (
            <KanbanColumn key={col.id} column={col} tasks={colTasks} />
          );
        })}
      </div>
    </DragDropContext>
  );
}
