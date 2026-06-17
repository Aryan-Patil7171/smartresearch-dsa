# ResearchHub — Smart Research Project Collaboration Platform

A full-stack Data Structures & Algorithms project combining a **C++17 terminal application** with a **React + Node.js web interface** for managing researchers, projects, documents, collaboration requests, and graph-based researcher networks.

---

## 2.1 Project Title

**ResearchHub — Smart Research Project Collaboration & Knowledge Sharing Platform**

---

## 2.2 Problem Statement

Research institutions struggle to efficiently manage researchers, track project progress, handle collaboration requests, maintain document revision histories, and visualize researcher networks. Existing tools are either too heavyweight or lack the algorithmic transparency needed for academic evaluation.

This project addresses the need for a lightweight, DSA-driven system that:
- Stores and retrieves researcher and project data efficiently
- Manages document revisions with undo capability
- Processes collaboration requests in a fair FIFO order
- Models and traverses the researcher collaboration network as a graph
- Exposes all functionality through both a terminal interface and a live web UI

---

## 2.3 Objectives

1. Implement core data structures (hash map, stack, queue, graph, BST) from scratch in C++17
2. Apply QuickSort and MergeSort for project sorting with real comparisons
3. Enable stack-based undo for document revision control
4. Model researcher collaborations as an undirected graph and support BFS/DFS traversal
5. Persist all data to plain-text files shared between the C++ app and the Node.js API
6. Build a React frontend that provides real-time CRUD access to the same dataset
7. Demonstrate end-to-end integration between a compiled systems program and a web stack

---

## 2.4 System Overview / Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Interfaces                  │
│                                                     │
│   Terminal (C++ App)        Browser (React + Vite)  │
│   ./research                http://localhost:5174   │
└───────────┬─────────────────────────┬───────────────┘
            │                         │ HTTP /api/*
            │                         ▼
            │              ┌──────────────────────┐
            │              │  Express API Server  │
            │              │  api/server.js :4000 │
            │              └──────────┬───────────┘
            │                         │
            ▼                         ▼
┌───────────────────────────────────────────────────┐
│                  Shared Data Layer                 │
│                                                   │
│  researchers.txt   projects.txt   documents.txt   │
│  requests.txt      collaborations.txt             │
└───────────────────────────────────────────────────┘
```

- The **C++ terminal app** reads/writes all `.txt` files directly at startup and exit
- The **Express API** reads/writes the same `.txt` files on every request (stateless)
- The **React frontend** calls the Express API via a Vite proxy (`/api → localhost:4000`)
- Both the C++ app and the web stack can run simultaneously; they share state through the files

---

## 2.5 Data Structures and Algorithms Used

### Data Structures

| Structure | Usage in Project |
|---|---|
| `unordered_map` (Hash Map) | O(1) average lookup for researchers and projects by ID |
| `stack<string>` | Per-project document revision history with LIFO undo |
| `queue<Request>` | FIFO processing of collaboration requests |
| Graph (adjacency list) | Undirected collaboration network between researchers |
| Binary Search Tree (BST) | Ordered storage and traversal of project IDs |
| `vector` | Dynamic lists for researchers, projects, BFS/DFS output |

### Algorithms

| Algorithm | Applied To | Complexity |
|---|---|---|
| QuickSort | Sort projects by priority | Avg O(n log n), Worst O(n²) |
| MergeSort | Sort projects by title (alphabetical) | O(n log n) always |
| BFS | Collaboration graph traversal from a start node | O(V + E) |
| DFS | Collaboration graph traversal from a start node | O(V + E) |
| BST Insert/Search | Project ID tree operations | O(log n) avg, O(n) worst |
| BST In/Pre/Post-order | Tree traversal and display | O(n) |
| Linear Search | Researcher name substring match | O(n) |

---

## 2.6 Implementation Approach

### C++ Terminal App (`main.cpp`)

- All data structures are implemented using the C++ Standard Library — no third-party dependencies
- On startup, data is loaded from `.txt` files (pipe-delimited for structured records, comma-separated for graph edges)
- Each menu option maps to a dedicated function that operates on in-memory structures
- On exit (option 0), all in-memory state is flushed back to the `.txt` files

**Key design decisions:**
- The collaboration graph uses `unordered_map<int, vector<int>>` (adjacency list) for space efficiency
- The BST is a custom linked-node implementation supporting insert, search, and all three traversals
- Document revisions use `unordered_map<int, stack<string>>` keyed by project ID
- Requests use `queue<tuple<int,int,string>>` — requester ID, project ID, message

### Express API (`api/server.js`)

- Stateless: every request parses the `.txt` file, performs the operation, and writes back
- CORS enabled so the Vite dev server can call it from a different port
- File parsing functions mirror the C++ parsing logic for format compatibility

### React Frontend (`frontend/react-app/`)

- Built with React 18 + Vite; pages use `useEffect` + `useState` for data fetching
- `useAutoRefresh` hook polls the API every 4–4.5 seconds to reflect changes made in the terminal
- Vite proxy forwards all `/api/*` requests to `http://localhost:4000`
- Pages: Researchers, Projects, Documents, Requests, Collaborations (with in-browser BFS/DFS)

---

## 2.7 Time and Space Complexity Analysis

### Time Complexity

| Operation | Complexity | Notes |
|---|---|---|
| Add / lookup researcher | O(1) avg | Hash map |
| Display all researchers | O(n) | Iterate hash map |
| Add / lookup project | O(1) avg | Hash map |
| QuickSort projects | O(n log n) avg | Pivot-based partition |
| MergeSort projects | O(n log n) | Stable, always |
| Linear search (name) | O(n) | Substring scan |
| Push / pop revision | O(1) | Stack top operations |
| Enqueue / dequeue request | O(1) | Queue front/back |
| BFS traversal | O(V + E) | V = researchers, E = edges |
| DFS traversal | O(V + E) | Recursive |
| BST insert | O(log n) avg | O(n) worst (skewed tree) |
| BST traversals | O(n) | Visit all nodes once |
| Load / save from file | O(n) | Linear scan of file |

### Space Complexity

| Component | Complexity | Notes |
|---|---|---|
| Researcher map | O(n) | n = number of researchers |
| Project map | O(m) | m = number of projects |
| Revision stacks | O(r) | r = total revisions across all projects |
| Request queue | O(q) | q = pending requests |
| Collaboration graph | O(V + E) | Adjacency list |
| BST | O(k) | k = number of inserted project IDs |

---

## 2.8 Execution Steps

### Prerequisites

- C++ compiler with C++17 support (clang++ or g++)
- Node.js ≥ 18

### 1. Compile and Run the C++ Terminal App

```bash
cd "smartresearch dsa"
clang++ main.cpp -std=c++17 -o research
./research
```

### 2. Start the API Server

```bash
cd "smartresearch dsa/api"
npm install
node server.js
# Server running at http://localhost:4000
```

### 3. Start the React Frontend

```bash
cd "smartresearch dsa/frontend/react-app"
npm install
npm run dev
# Frontend running at http://localhost:5174
```

> Start the API server before the React frontend. The Vite dev server proxies all `/api` calls to port 4000.

---

## 2.9 Sample Inputs and Outputs

### Sample Input Sequence (Terminal App)

```
Choice: 1          → Add Researcher
Researcher ID: 10
Name: Alice Smith
Department: Computer Science

Choice: 4          → Add Project
Project ID: 201
Title: AI in Healthcare
Priority: High
Status: Active

Choice: 9          → Add Revision
Project ID: 201
Revision text: Initial draft - literature review complete

Choice: 9          → Add Another Revision
Project ID: 201
Revision text: Added methodology section

Choice: 11         → Show Revisions
Project ID: 201

Choice: 10         → Undo Last Revision
Project ID: 201

Choice: 12         → Send Request
Requester ID: 10
Project ID: 201
Message: Requesting collaboration on AI research

Choice: 13         → Process Next Request

Choice: 15         → Add Collaboration Edge
Researcher A ID: 1
Researcher B ID: 10

Choice: 16         → BFS
Start node: 1

Choice: 17         → DFS
Start node: 1

Choice: 0          → Exit
```

### Sample Output

```
Researcher Added

Project Added

Revision added.
Revision added.

Revisions (top->bottom):
- Added methodology section
- Initial draft - literature review complete

Revision removed.

Request Sent

Request Processed: Requesting collaboration on AI research

Collaboration added between 1 and 10

BFS Traversal from 1: 1 2 10 3 4

DFS Traversal from 1: 1 2 3 4 10

Exiting. Saving data...
```

Full step-by-step sequences are in [`docs/sample_input.txt`](docs/sample_input.txt) and [`docs/sample_output.txt`](docs/sample_output.txt).

---

## 2.10 Screenshots

> Add screenshots of your terminal and web UI here.

**Terminal — Main Menu**
```
ResearchHub - Smart Research Project Collaboration & Knowledge Sharing Platform
Loading data...

--- ResearchHub Menu ---
1  Add Researcher        11 Show Revisions
2  Display Researchers   12 Send Request
3  Search Researcher     13 Process Request
4  Add Project           14 Show Requests
5  Display Projects      15 Add Collaboration
6  Sort (QuickSort)      16 BFS
7  Sort (MergeSort)      17 DFS
8  Search Project        18 Display BST Traversals
9  Add Revision          19 Insert Project ID to BST
10 Undo Revision         20 Delete Project
                          0 Exit
```

**Web UI Pages**
- `Researchers` — table of all researchers with add form
- `Projects` — project cards with priority badges and delete button
- `Documents` — revision stack per project with undo
- `Requests` — pending request queue with process button
- `Collaborations` — adjacency list display + BFS/DFS in-browser

Place screenshots in a `docs/screenshots/` folder and link them here as:
```markdown
![Terminal Menu](docs/screenshots/terminal_menu.png)
![Collaborations Page](docs/screenshots/collaborations.png)
```

---

## 2.11 Results and Observations

- **Hash map lookups** for researchers and projects ran in O(1) average time, providing immediate response even as dataset size grew
- **QuickSort** outperformed MergeSort on already-partially-sorted datasets due to better cache locality; MergeSort was more predictable (always O(n log n))
- **Stack-based undo** worked correctly for multiple revisions per project — popping only affected the targeted project's stack
- **BFS and DFS** produced different visit orderings as expected: BFS explored level-by-level (useful for finding shortest collaboration paths), DFS went deep-first (useful for detecting connected components)
- **BST traversals** correctly produced sorted (in-order), root-first (pre-order), and leaves-first (post-order) sequences of project IDs
- **File sharing** between the C++ app and the Node.js API worked reliably for sequential use; concurrent modification from both simultaneously caused occasional read inconsistencies, confirming the need for file locking in production
- **Auto-refresh** in the React UI (every 4–4.5 seconds) kept the web view in sync with terminal changes without requiring a manual page reload
- The system handled all 20 menu operations without memory leaks or crashes across repeated test runs

---

## 2.12 Conclusion

ResearchHub demonstrates how classical data structures and algorithms can be integrated into a practical, full-stack application. The C++17 terminal app serves as the algorithmic core — each feature directly maps to a specific DSA concept (hash map, stack, queue, graph, BST, QuickSort, MergeSort). The Node.js API and React frontend extend the same dataset to a web interface without duplicating the data layer.

Key takeaways:
- Choosing the right data structure has measurable impact: hash maps gave O(1) lookup while a linear list would give O(n)
- Algorithm selection matters: MergeSort is preferable when stability is required; QuickSort is faster in practice for random data
- A shared file-based persistence layer is simple and portable but not suitable for concurrent writes — a database would replace it in a production system
- Separating the data layer (`.txt` files) from both the C++ app and the web API kept the architecture clean and easy to test

This project reinforces that DSA concepts are not academic abstractions — they are the foundation of every performant system.

---

## Project Structure

```
smartresearch-dsa/
├── main.cpp                  # C++ terminal app (all DSA logic)
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
├── docs/
│   ├── sample_input.txt      # Step-by-step sample inputs
│   └── sample_output.txt     # Expected outputs
├── researchers.txt           # Shared data files
├── projects.txt
├── documents.txt
├── requests.txt
└── collaborations.txt
```

---

## API Reference

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
