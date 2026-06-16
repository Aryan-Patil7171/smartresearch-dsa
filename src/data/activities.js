/**
 * Mock activity log – initial 60 entries; more are generated at runtime
 */
import { MOCK_USERS } from './users.js';

const today = new Date();
const ts = (minsAgo) => new Date(today.getTime() - minsAgo * 60000).toISOString();

export const ACTIVITY_TYPES = {
  TASK_CREATED:     'task_created',
  TASK_UPDATED:     'task_updated',
  TASK_DELETED:     'task_deleted',
  TASK_MOVED:       'task_moved',
  CHECKLIST_UPDATED:'checklist_updated',
  COMMENT_ADDED:    'comment_added',
  ASSIGNEE_CHANGED: 'assignee_changed',
};

const icons = {
  task_created:      '✅',
  task_updated:      '✏️',
  task_deleted:      '🗑️',
  task_moved:        '🔀',
  checklist_updated: '☑️',
  comment_added:     '💬',
  assignee_changed:  '👤',
};

export const getActivityIcon = (type) => icons[type] || '📌';

export const MOCK_ACTIVITIES = Array.from({ length: 60 }, (_, i) => {
  const types = Object.values(ACTIVITY_TYPES);
  const type = types[i % types.length];
  const user = MOCK_USERS[i % MOCK_USERS.length];
  const taskId = `t${(i % 50) + 1}`;
  const messages = {
    task_created:      `created task #${taskId}`,
    task_updated:      `updated task #${taskId}`,
    task_deleted:      `deleted a task`,
    task_moved:        `moved task #${taskId} to a new column`,
    checklist_updated: `checked off an item in task #${taskId}`,
    comment_added:     `commented on task #${taskId}`,
    assignee_changed:  `reassigned task #${taskId}`,
  };
  return {
    id: `act${i + 1}`,
    type,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    userColor: user.color,
    taskId,
    message: messages[type],
    timestamp: ts((60 - i) * 15 + Math.floor(Math.random() * 30)),
  };
});
