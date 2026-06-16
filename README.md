# CloudDesk – Kanban Workspace

A modern, fully-featured Kanban task management application built with React 19, Vite, and Tailwind CSS.

## 🚀 Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:5173 in your browser.

## ✅ Features

| Feature | Status |
|---|---|
| Draggable Kanban Board (5 columns) | ✅ |
| Slide-Out Task Drawer (right panel) | ✅ |
| Big Task Breakdown (subtasks + promote) | ✅ |
| Infinite Activity Log (virtualized) | ✅ |
| Quick Tag Filter (multi-filter) | ✅ |
| Team Access Manager (role permissions) | ✅ |
| Individual Card Safety (Error Boundaries) | ✅ |
| Card Position Saver (localStorage) | ✅ |
| Dark / Light Mode | ✅ |
| Responsive Design | ✅ |

## 🏗️ Architecture

```
src/
├── components/
│   ├── Board/          # KanbanBoard, KanbanColumn, CreateTaskModal
│   ├── TaskCard/       # TaskCard with CardErrorBoundary
│   ├── TaskDrawer/     # Slide-out drawer, SubtaskBreakdown
│   ├── ActivityLog/    # Virtualized list using react-window
│   ├── Filters/        # FilterPanel (tags, priority, assignee, status)
│   ├── Permissions/    # TeamManager with role management
│   ├── Layout/         # Sidebar, Header
│   └── Shared/         # ErrorBoundary, Avatar, Badge, Modal, ProgressBar
├── context/
│   ├── TaskContext.jsx      # Tasks state + localStorage sync
│   ├── ActivityContext.jsx  # Activity log
│   ├── FilterContext.jsx    # Active filters + localStorage sync
│   ├── ThemeContext.jsx     # Dark/Light mode
│   └── UserContext.jsx      # Current user + role permissions
├── data/
│   ├── tasks.js        # 50 mock tasks, 5 columns, tags, priorities
│   ├── users.js        # 20 mock users with roles
│   └── activities.js   # 60 initial activity entries
├── hooks/
│   ├── useLocalStorage.js
│   └── useKeyboardShortcut.js
├── pages/
│   ├── BoardPage.jsx
│   ├── ActivityPage.jsx
│   ├── TeamPage.jsx
│   └── SettingsPage.jsx
├── styles/
│   └── index.css       # Tailwind + custom scrollbar + light mode
└── utils/
    ├── date.js         # formatDate, isOverdue, isDueSoon
    ├── filters.js      # applyFilters
    └── priority.js     # Priority colour configs
```

## 🛠️ Tech Stack

- **React 19** – UI library
- **Vite 8** – Build tool
- **Tailwind CSS 4** – Utility-first styling
- **Framer Motion** – Animations
- **@hello-pangea/dnd** – Drag and drop
- **react-window** – Virtualised activity list
- **lucide-react** – Icons
- **react-router-dom 6** – Client-side routing
- **localStorage** – Persistence (no backend needed)

## 🔐 Roles & Permissions

| Action | Admin | Manager | Member | Viewer |
|---|:---:|:---:|:---:|:---:|
| Create tasks | ✅ | ✅ | ✅ | ❌ |
| Edit tasks | ✅ | ✅ | ✅ | ❌ |
| Delete tasks | ✅ | ✅ | ❌ | ❌ |
| Move tasks | ✅ | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |

Switch users on the **Team** page to test different permission levels.

## 💾 LocalStorage Keys

| Key | Content |
|---|---|
| `cd_tasks` | All task data and positions |
| `cd_theme` | `"dark"` or `"light"` |
| `cd_filters` | Active filter state |
| `cd_current_user` | Active user session |
