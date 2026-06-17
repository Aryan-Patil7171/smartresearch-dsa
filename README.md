# ResearchHub — Smart Research Project Collaboration Platform

A full-stack DSA project that combines a **C++17 terminal application** with a **React + Node.js web interface** for managing researchers, projects, documents, requests, and collaborations.

---

## Features

### C++ Terminal App (`main.cpp`)
Built from scratch using standard C++17 — no external libraries.

| Category | Feature |
|---|---|
| **Data Structures** | Hash map (unordered_map), Queue, Stack, Graph (adjacency list), BST |
| **Sorting** | QuickSort (projects by priority), MergeSort (projects by title) |
| **Searching** | Linear search for researchers & projects |
| **Graph Traversal** | BFS and DFS on the collaboration graph |
| **BST Operations** | Insert, search, in-order / pre-order / post-order traversal |
| **Revision Control** | Stack-based undo for document revisions |
| **Request Queue** | FIFO queue for collaboration requests |
| **Persistence** | All data saved to `.txt` files, loaded on startup |

### React Frontend (`frontend/react-app/`)
Built with **React 18 + Vite**, proxied to the Express API.

- **Researchers** — add and view all researchers
- **Projects** — add, view, and delete projects
- **Documents** — per-project revision history with undo
- **Requests** — send and process collaboration requests
- **Collaborations** — visualize the collaboration graph with BFS / DFS traversal

### Express API (`api/server.js`)
Minimal REST API that reads and writes the same `.txt` files used by the C++ app — both can run simultaneously.

---

## Project Structure

```
smartresearch-dsa/
├── main.cpp                  # C++ terminal app
├── api/
│   ├── server.js             # Express REST API (port 4000)
│   └── package.json
├── frontend/
│   ├── index.html            # Simple static UI
│   └── react-app/            # Vite + React app (port 5174)
│       └── src/
│           ├── App.jsx
│           ├── pages/        # Researchers, Projects, Documents, Requests, Collaborations
│           ├── components/   # Board, TaskCard, TaskDrawer, Filters, ActivityPanel
│           ├── contexts/     # PermissionContext
│           └── hooks/        # useAutoRefresh
├── researchers.txt           # Shared data files
├── projects.txt
├── documents.txt
├── requests.txt
└── collaborations.txt
```

---

## Getting Started

### 1. C++ Terminal App

```bash
clang++ main.cpp -std=c++17 -o research
./research
```

### 2. API Server

```bash
cd api
npm install
node server.js
# Running at http://localhost:4000
```

### 3. React Frontend

```bash
cd frontend/react-app
npm install
npm run dev
# Running at http://localhost:5174
```

> The React app proxies `/api` requests to `http://localhost:4000`, so make sure the API server is running first.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/researchers` | List all researchers |
| POST | `/api/researchers` | Add a researcher |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Add a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/documents/:projectId` | Get revisions for a project |
| POST | `/api/documents/:projectId` | Add a revision |
| DELETE | `/api/documents/:projectId` | Undo last revision |
| GET | `/api/requests` | List pending requests |
| POST | `/api/requests` | Send a request |
| POST | `/api/requests/process` | Process next request (FIFO) |
| GET | `/api/collaborations` | List all collaboration edges |
| POST | `/api/collaborations` | Add a collaboration edge |

---

## Documentation

| File | Description |
|---|---|
| [`docs/sample_input.txt`](docs/sample_input.txt) | Step-by-step sample input sequences for the terminal app |
| [`docs/sample_output.txt`](docs/sample_output.txt) | Expected output corresponding to sample inputs |
| [`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md) | Screenshot guide and placeholders for program execution |

---

## Notes

- The C++ app and the web server share the same `.txt` files. Avoid making edits from both simultaneously.
- The API is designed for local/demo use — no authentication.
- Auto-refresh is built into the React pages (every 4–4.5 seconds).
