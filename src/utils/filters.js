/**
 * Apply active filters to a list of tasks
 */
export function applyFilters(tasks, filters) {
  return tasks.filter(task => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        task.title.toLowerCase().includes(q) ||
        (task.description || '').toLowerCase().includes(q) ||
        (task.tags || []).some(tag => tag.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Tags
    if (filters.tags.length > 0) {
      if (!filters.tags.some(tag => (task.tags || []).includes(tag))) return false;
    }
    // Priorities
    if (filters.priorities.length > 0) {
      if (!filters.priorities.includes(task.priority)) return false;
    }
    // Assignees
    if (filters.assignees.length > 0) {
      if (!filters.assignees.includes(task.assigneeId)) return false;
    }
    // Statuses
    if (filters.statuses.length > 0) {
      if (!filters.statuses.includes(task.status)) return false;
    }
    return true;
  });
}
