/**
 * Mock tasks data – 50 tasks across 5 Kanban columns
 */
import { MOCK_USERS } from './users.js';

const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};

export const COLUMNS = [
  { id: 'backlog',     title: 'Backlog',     color: '#6b7280' },
  { id: 'todo',        title: 'To Do',       color: '#3b82f6' },
  { id: 'inprogress',  title: 'In Progress', color: '#f59e0b' },
  { id: 'review',      title: 'Review',      color: '#a855f7' },
  { id: 'done',        title: 'Done',        color: '#10b981' },
];

export const TAGS = [
  'Frontend', 'Backend', 'Design', 'Testing', 'DevOps',
  'Bug', 'Feature', 'Research', 'Documentation', 'Security',
  'Performance', 'API', 'Database', 'Mobile', 'Hotfix',
];

export const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const MOCK_TASKS = [
  {
    id: 't1', title: 'Design system architecture',
    description: 'Define the high-level architecture for the new microservices platform.',
    priority: 'critical', tags: ['Backend', 'Research'], assigneeId: 'u1',
    dueDate: d(10), status: 'backlog', columnId: 'backlog', order: 0,
    createdAt: d(-15),
    checklist: [
      { id: 'c1', text: 'Research existing systems', done: true },
      { id: 'c2', text: 'Draft initial diagram', done: false },
      { id: 'c3', text: 'Review with team', done: false },
    ],
    subtasks: [],
  },
  {
    id: 't2', title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated builds and deployments.',
    priority: 'high', tags: ['DevOps'], assigneeId: 'u2',
    dueDate: d(5), status: 'backlog', columnId: 'backlog', order: 1,
    createdAt: d(-12),
    checklist: [
      { id: 'c1', text: 'Create workflow file', done: true },
      { id: 'c2', text: 'Add environment secrets', done: false },
    ],
    subtasks: [],
  },
  {
    id: 't3', title: 'Database schema design',
    description: 'Design ERD for the new user management module.',
    priority: 'high', tags: ['Database', 'Backend'], assigneeId: 'u3',
    dueDate: d(8), status: 'backlog', columnId: 'backlog', order: 2,
    createdAt: d(-10),
    checklist: [],
    subtasks: [],
  },
  {
    id: 't4', title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI/Swagger.',
    priority: 'medium', tags: ['API', 'Documentation'], assigneeId: 'u4',
    dueDate: d(20), status: 'backlog', columnId: 'backlog', order: 3,
    createdAt: d(-8),
    checklist: [
      { id: 'c1', text: 'List all endpoints', done: false },
      { id: 'c2', text: 'Add request/response schemas', done: false },
    ],
    subtasks: [],
  },
  {
    id: 't5', title: 'Research authentication options',
    description: 'Compare OAuth2, JWT, and session-based auth for the platform.',
    priority: 'medium', tags: ['Security', 'Research'], assigneeId: 'u5',
    dueDate: d(15), status: 'backlog', columnId: 'backlog', order: 4,
    createdAt: d(-5),
    checklist: [],
    subtasks: [],
  },
  {
    id: 't6', title: 'Create landing page wireframes',
    description: 'Design initial wireframes for the marketing landing page.',
    priority: 'medium', tags: ['Design', 'Frontend'], assigneeId: 'u6',
    dueDate: d(7), status: 'backlog', columnId: 'backlog', order: 5,
    createdAt: d(-4),
    checklist: [],
    subtasks: [],
  },
  {
    id: 't7', title: 'Performance audit',
    description: 'Run Lighthouse audits and identify bottlenecks.',
    priority: 'low', tags: ['Performance', 'Frontend'], assigneeId: 'u7',
    dueDate: d(25), status: 'backlog', columnId: 'backlog', order: 6,
    createdAt: d(-3),
    checklist: [],
    subtasks: [],
  },
  {
    id: 't8', title: 'Mobile responsiveness fixes',
    description: 'Fix layout issues on screens below 768px.',
    priority: 'medium', tags: ['Frontend', 'Mobile', 'Bug'], assigneeId: 'u8',
    dueDate: d(12), status: 'backlog', columnId: 'backlog', order: 7,
    createdAt: d(-2),
    checklist: [],
    subtasks: [],
  },
  {
    id: 't9', title: 'Implement user registration flow',
    description: 'Build sign-up page, form validation, and email confirmation.',
    priority: 'high', tags: ['Frontend', 'Feature'], assigneeId: 'u9',
    dueDate: d(6), status: 'todo', columnId: 'todo', order: 0,
    createdAt: d(-14),
    checklist: [
      { id: 'c1', text: 'Design form UI', done: true },
      { id: 'c2', text: 'Add validation', done: true },
      { id: 'c3', text: 'Email confirmation', done: false },
    ],
    subtasks: [],
  },
  {
    id: 't10', title: 'Build dashboard layout',
    description: 'Create the main dashboard with sidebar, header and content area.',
    priority: 'high', tags: ['Frontend', 'Design'], assigneeId: 'u10',
    dueDate: d(4), status: 'todo', columnId: 'todo', order: 1,
    createdAt: d(-13),
    checklist: [],
    subtasks: [],
  },
];

// Continue mock tasks t11–t30
const moreTasks = [
  {
    id: 't11', title: 'Notification system',
    description: 'Real-time toast notifications for task updates.',
    priority: 'medium', tags: ['Frontend', 'Feature'], assigneeId: 'u11',
    dueDate: d(9), status: 'todo', columnId: 'todo', order: 2,
    createdAt: d(-11), checklist: [], subtasks: [],
  },
  {
    id: 't12', title: 'Dark mode implementation',
    description: 'Add system-based and manual dark/light mode toggle.',
    priority: 'low', tags: ['Frontend', 'Feature'], assigneeId: 'u12',
    dueDate: d(14), status: 'todo', columnId: 'todo', order: 3,
    createdAt: d(-9), checklist: [
      { id: 'c1', text: 'Add CSS variables', done: false },
      { id: 'c2', text: 'Implement toggle button', done: false },
    ], subtasks: [],
  },
  {
    id: 't13', title: 'Set up Redux store',
    description: 'Configure Redux Toolkit for global state management.',
    priority: 'high', tags: ['Frontend', 'Backend'], assigneeId: 'u13',
    dueDate: d(3), status: 'todo', columnId: 'todo', order: 4,
    createdAt: d(-7), checklist: [], subtasks: [],
  },
  {
    id: 't14', title: 'Unit test auth module',
    description: 'Write Jest tests for login, register, and token refresh.',
    priority: 'high', tags: ['Testing', 'Backend'], assigneeId: 'u14',
    dueDate: d(5), status: 'todo', columnId: 'todo', order: 5,
    createdAt: d(-6), checklist: [], subtasks: [],
  },
  {
    id: 't15', title: 'Onboarding flow design',
    description: 'Multi-step onboarding wizard for new users.',
    priority: 'medium', tags: ['Design', 'Frontend'], assigneeId: 'u15',
    dueDate: d(18), status: 'todo', columnId: 'todo', order: 6,
    createdAt: d(-4), checklist: [], subtasks: [],
  },
  {
    id: 't16', title: 'Implement Kanban drag-and-drop',
    description: 'Allow tasks to be dragged between columns using @hello-pangea/dnd.',
    priority: 'critical', tags: ['Frontend', 'Feature'], assigneeId: 'u1',
    dueDate: d(2), status: 'inprogress', columnId: 'inprogress', order: 0,
    createdAt: d(-20), checklist: [
      { id: 'c1', text: 'Install dnd library', done: true },
      { id: 'c2', text: 'Set up DragDropContext', done: true },
      { id: 'c3', text: 'Implement Droppable columns', done: true },
      { id: 'c4', text: 'Implement Draggable cards', done: false },
      { id: 'c5', text: 'Persist positions', done: false },
    ], subtasks: [],
  },
  {
    id: 't17', title: 'API integration layer',
    description: 'Build a service layer for all API calls with Axios interceptors.',
    priority: 'high', tags: ['Frontend', 'API'], assigneeId: 'u2',
    dueDate: d(4), status: 'inprogress', columnId: 'inprogress', order: 1,
    createdAt: d(-18), checklist: [
      { id: 'c1', text: 'Setup Axios instance', done: true },
      { id: 'c2', text: 'Add request interceptor', done: false },
    ], subtasks: [],
  },
  {
    id: 't18', title: 'Build reusable component library',
    description: 'Create Button, Input, Modal, Badge components with variants.',
    priority: 'high', tags: ['Frontend', 'Design'], assigneeId: 'u3',
    dueDate: d(6), status: 'inprogress', columnId: 'inprogress', order: 2,
    createdAt: d(-16), checklist: [], subtasks: [],
  },
  {
    id: 't19', title: 'Search functionality',
    description: 'Global search across tasks, users, and projects.',
    priority: 'medium', tags: ['Frontend', 'Feature'], assigneeId: 'u4',
    dueDate: d(11), status: 'inprogress', columnId: 'inprogress', order: 3,
    createdAt: d(-14), checklist: [], subtasks: [],
  },
  {
    id: 't20', title: 'Email notification service',
    description: 'Send transactional emails for task assignments and due dates.',
    priority: 'medium', tags: ['Backend', 'Feature'], assigneeId: 'u5',
    dueDate: d(16), status: 'inprogress', columnId: 'inprogress', order: 4,
    createdAt: d(-12), checklist: [], subtasks: [],
  },
];
MOCK_TASKS.push(...moreTasks);

// Tasks t21–t50
const extraTasks = [
  { id: 't21', title: 'Implement file upload',       description: 'S3-based file upload with progress tracking.',              priority: 'medium',   tags: ['Backend', 'Feature'],        assigneeId: 'u6',  dueDate: d(13), status: 'inprogress', columnId: 'inprogress', order: 5,  createdAt: d(-10), checklist: [], subtasks: [] },
  { id: 't22', title: 'Code review process',          description: 'Establish PR review guidelines and automate checks.',       priority: 'low',      tags: ['DevOps', 'Documentation'],   assigneeId: 'u7',  dueDate: d(22), status: 'inprogress', columnId: 'inprogress', order: 6,  createdAt: d(-8),  checklist: [], subtasks: [] },
  { id: 't23', title: 'Accessibility audit',          description: 'Ensure WCAG 2.1 AA compliance across all pages.',           priority: 'high',     tags: ['Frontend', 'Testing'],       assigneeId: 'u8',  dueDate: d(9),  status: 'review',     columnId: 'review',     order: 0,  createdAt: d(-22), checklist: [{ id: 'c1', text: 'Run axe audit', done: true }, { id: 'c2', text: 'Fix violations', done: true }, { id: 'c3', text: 'Retest', done: false }], subtasks: [] },
  { id: 't24', title: 'Load testing',                 description: 'Run k6 load tests targeting 10k concurrent users.',         priority: 'high',     tags: ['Testing', 'Performance'],    assigneeId: 'u9',  dueDate: d(7),  status: 'review',     columnId: 'review',     order: 1,  createdAt: d(-20), checklist: [], subtasks: [] },
  { id: 't25', title: 'Security penetration test',    description: 'Engage third-party pen testers for the API surface.',       priority: 'critical', tags: ['Security', 'Testing'],       assigneeId: 'u10', dueDate: d(4),  status: 'review',     columnId: 'review',     order: 2,  createdAt: d(-18), checklist: [], subtasks: [] },
  { id: 't26', title: 'Billing module',                description: 'Integrate Stripe for subscription billing.',                priority: 'critical', tags: ['Backend', 'Feature'],        assigneeId: 'u11', dueDate: d(3),  status: 'review',     columnId: 'review',     order: 3,  createdAt: d(-17), checklist: [], subtasks: [] },
  { id: 't27', title: 'Analytics dashboard',          description: 'Charts and metrics for user activity and revenue.',         priority: 'medium',   tags: ['Frontend', 'Feature'],       assigneeId: 'u12', dueDate: d(14), status: 'review',     columnId: 'review',     order: 4,  createdAt: d(-15), checklist: [], subtasks: [] },
  { id: 't28', title: 'Webhook system',               description: 'Allow users to subscribe to event webhooks.',               priority: 'medium',   tags: ['API', 'Backend'],            assigneeId: 'u13', dueDate: d(19), status: 'review',     columnId: 'review',     order: 5,  createdAt: d(-13), checklist: [], subtasks: [] },
  { id: 't29', title: 'Multi-language support',       description: 'i18n integration with English and Spanish locales.',        priority: 'low',      tags: ['Frontend', 'Feature'],       assigneeId: 'u14', dueDate: d(28), status: 'review',     columnId: 'review',     order: 6,  createdAt: d(-11), checklist: [], subtasks: [] },
  { id: 't30', title: 'Export to CSV/PDF',            description: 'Allow users to export task lists as CSV or PDF.',           priority: 'low',      tags: ['Frontend', 'Feature'],       assigneeId: 'u15', dueDate: d(30), status: 'review',     columnId: 'review',     order: 7,  createdAt: d(-9),  checklist: [], subtasks: [] },
  { id: 't31', title: 'Login page',                   description: 'Completed login with email/password and social auth.',      priority: 'high',     tags: ['Frontend', 'Feature'],       assigneeId: 'u16', dueDate: d(-5), status: 'done',       columnId: 'done',       order: 0,  createdAt: d(-30), checklist: [{ id: 'c1', text: 'Build form', done: true }, { id: 'c2', text: 'OAuth integration', done: true }], subtasks: [] },
  { id: 't32', title: 'Project scaffolding',          description: 'Initial Vite + React + Tailwind setup.',                    priority: 'medium',   tags: ['DevOps', 'Frontend'],        assigneeId: 'u17', dueDate: d(-10),status: 'done',       columnId: 'done',       order: 1,  createdAt: d(-35), checklist: [], subtasks: [] },
  { id: 't33', title: 'Linting & formatting',         description: 'ESLint + Prettier config for consistent code style.',       priority: 'low',      tags: ['DevOps'],                    assigneeId: 'u18', dueDate: d(-8), status: 'done',       columnId: 'done',       order: 2,  createdAt: d(-33), checklist: [], subtasks: [] },
  { id: 't34', title: 'Git repository setup',         description: 'Initialize monorepo with branch protection rules.',         priority: 'medium',   tags: ['DevOps'],                    assigneeId: 'u19', dueDate: d(-15),status: 'done',       columnId: 'done',       order: 3,  createdAt: d(-40), checklist: [], subtasks: [] },
  { id: 't35', title: 'Design token system',          description: 'Define colors, spacing, typography as design tokens.',      priority: 'medium',   tags: ['Design', 'Frontend'],        assigneeId: 'u20', dueDate: d(-7), status: 'done',       columnId: 'done',       order: 4,  createdAt: d(-28), checklist: [], subtasks: [] },
  { id: 't36', title: 'Fix header overlap bug',       description: 'Header overlaps content on scroll in Safari.',             priority: 'high',     tags: ['Bug', 'Frontend'],           assigneeId: 'u1',  dueDate: d(-3), status: 'done',       columnId: 'done',       order: 5,  createdAt: d(-20), checklist: [], subtasks: [] },
  { id: 't37', title: 'User profile page',            description: 'Allow users to update avatar, bio, and preferences.',      priority: 'medium',   tags: ['Frontend', 'Feature'],       assigneeId: 'u2',  dueDate: d(6),  status: 'todo',       columnId: 'todo',       order: 7,  createdAt: d(-5),  checklist: [], subtasks: [] },
  { id: 't38', title: 'Password reset flow',          description: 'Email-based password reset with secure token.',             priority: 'high',     tags: ['Backend', 'Security'],       assigneeId: 'u3',  dueDate: d(5),  status: 'todo',       columnId: 'todo',       order: 8,  createdAt: d(-4),  checklist: [], subtasks: [] },
  { id: 't39', title: 'Team invitation system',       description: 'Invite team members via email with role assignment.',       priority: 'medium',   tags: ['Backend', 'Feature'],        assigneeId: 'u4',  dueDate: d(10), status: 'backlog',    columnId: 'backlog',    order: 8,  createdAt: d(-2),  checklist: [], subtasks: [] },
  { id: 't40', title: 'Keyboard shortcuts',           description: 'Add keyboard shortcuts for common actions.',                priority: 'low',      tags: ['Frontend', 'Feature'],       assigneeId: 'u5',  dueDate: d(21), status: 'backlog',    columnId: 'backlog',    order: 9,  createdAt: d(-1),  checklist: [], subtasks: [] },
  { id: 't41', title: 'Image optimization pipeline',  description: 'Auto-compress and serve WebP images via CDN.',             priority: 'medium',   tags: ['Performance', 'DevOps'],     assigneeId: 'u6',  dueDate: d(17), status: 'backlog',    columnId: 'backlog',    order: 10, createdAt: d(-1),  checklist: [], subtasks: [] },
  { id: 't42', title: 'Rate limiting middleware',     description: 'Prevent abuse by rate-limiting API endpoints.',             priority: 'high',     tags: ['Security', 'Backend'],       assigneeId: 'u7',  dueDate: d(8),  status: 'inprogress', columnId: 'inprogress', order: 7,  createdAt: d(-9),  checklist: [], subtasks: [] },
  { id: 't43', title: 'Test payment integration',     description: 'E2E tests for Stripe checkout and webhook handlers.',       priority: 'critical', tags: ['Testing', 'Backend'],        assigneeId: 'u8',  dueDate: d(2),  status: 'inprogress', columnId: 'inprogress', order: 8,  createdAt: d(-8),  checklist: [], subtasks: [] },
  { id: 't44', title: 'Improve error messages',       description: 'User-friendly error messages across all API responses.',   priority: 'medium',   tags: ['Backend', 'Feature'],        assigneeId: 'u9',  dueDate: d(12), status: 'inprogress', columnId: 'inprogress', order: 9,  createdAt: d(-7),  checklist: [], subtasks: [] },
  { id: 't45', title: 'Data backup strategy',         description: 'Automated daily DB backups to S3 with retention policy.',  priority: 'high',     tags: ['DevOps', 'Database'],        assigneeId: 'u10', dueDate: d(15), status: 'review',     columnId: 'review',     order: 8,  createdAt: d(-16), checklist: [], subtasks: [] },
  { id: 't46', title: 'Refactor auth hooks',          description: 'Extract auth logic into reusable custom hooks.',            priority: 'medium',   tags: ['Frontend', 'Backend'],       assigneeId: 'u11', dueDate: d(11), status: 'review',     columnId: 'review',     order: 9,  createdAt: d(-14), checklist: [], subtasks: [] },
  { id: 't47', title: 'Storybook setup',              description: 'Document all UI components in Storybook.',                  priority: 'low',      tags: ['Frontend', 'Documentation'], assigneeId: 'u12', dueDate: d(26), status: 'backlog',    columnId: 'backlog',    order: 11, createdAt: d(-1),  checklist: [], subtasks: [] },
  { id: 't48', title: 'CDN configuration',            description: 'Serve static assets via CloudFront for faster load times.', priority: 'medium',   tags: ['DevOps', 'Performance'],     assigneeId: 'u13', dueDate: d(23), status: 'backlog',    columnId: 'backlog',    order: 12, createdAt: d(-1),  checklist: [], subtasks: [] },
  { id: 't49', title: 'Admin user management panel',  description: 'CRUD interface for managing users and roles.',             priority: 'high',     tags: ['Frontend', 'Feature'],       assigneeId: 'u14', dueDate: d(7),  status: 'todo',       columnId: 'todo',       order: 9,  createdAt: d(-3),  checklist: [], subtasks: [] },
  { id: 't50', title: 'Launch checklist',             description: 'Final pre-launch checklist: smoke tests, DNS, monitoring.', priority: 'critical', tags: ['DevOps', 'Testing'],         assigneeId: 'u15', dueDate: d(1),  status: 'todo',       columnId: 'todo',       order: 10, createdAt: d(-2),  checklist: [{ id: 'c1', text: 'Smoke tests pass', done: false }, { id: 'c2', text: 'DNS configured', done: false }, { id: 'c3', text: 'Monitoring active', done: false }], subtasks: [] },
];
MOCK_TASKS.push(...extraTasks);
