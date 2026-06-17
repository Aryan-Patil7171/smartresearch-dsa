
#include <algorithm>
#include <chrono>
#include <fstream>
#include <functional>
#include <iostream>
#include <limits>
#include <queue>
#include <stack>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

// ----------------------------- Data Structures -----------------------------

struct Researcher {
    int id;
    string name;
    string department;
};

struct Project {
    int id;
    string title;
    string priority; // "Low", "Medium", "High"
    string status;   // e.g., "Active", "Completed", ...
};

// Activity Request struct (collaboration request)
struct Request {
    int requesterId;
    int projectId;
    string message;
};

// ----------------------------- BST for project IDs -------------------------

struct BSTNode {
    int key;
    BSTNode* left;
    BSTNode* right;
    BSTNode(int k) : key(k), left(nullptr), right(nullptr) {}
};

class ProjectBST {
   private:
    BSTNode* root;

    BSTNode* insertRec(BSTNode* node, int key) {
        if (!node) return new BSTNode(key);
        if (key < node->key)
            node->left = insertRec(node->left, key);
        else if (key > node->key)
            node->right = insertRec(node->right, key);
        // duplicates skipped
        return node;
    }

    bool searchRec(BSTNode* node, int key) {
        if (!node) return false;
        if (node->key == key) return true;
        return key < node->key ? searchRec(node->left, key) : searchRec(node->right, key);
    }

    void inorderRec(BSTNode* node, vector<int>& out) {
        if (!node) return;
        inorderRec(node->left, out);
        out.push_back(node->key);
        inorderRec(node->right, out);
    }

    void preorderRec(BSTNode* node, vector<int>& out) {
        if (!node) return;
        out.push_back(node->key);
        preorderRec(node->left, out);
        preorderRec(node->right, out);
    }

    void postorderRec(BSTNode* node, vector<int>& out) {
        if (!node) return;
        postorderRec(node->left, out);
        postorderRec(node->right, out);
        out.push_back(node->key);
    }

    void freeRec(BSTNode* node) {
        if (!node) return;
        freeRec(node->left);
        freeRec(node->right);
        delete node;
    }

   public:
    ProjectBST() : root(nullptr) {}
    ~ProjectBST() { freeRec(root); }

    void insert(int key) { root = insertRec(root, key); }
    bool search(int key) { return searchRec(root, key); }
    vector<int> inorder() {
        vector<int> out;
        inorderRec(root, out);
        return out;
    }
    vector<int> preorder() {
        vector<int> out;
        preorderRec(root, out);
        return out;
    }
    vector<int> postorder() {
        vector<int> out;
        postorderRec(root, out);
        return out;
    }
};

// ----------------------------- Graph (Adj List) ---------------------------

class CollaborationGraph {
   private:
    unordered_map<int, vector<int>> adj;

   public:
    void addNode(int id) {
        if (adj.find(id) == adj.end()) adj[id] = {};
    }
    void addEdge(int a, int b) {
        addNode(a);
        addNode(b);
        // avoid duplicates
        auto &va = adj[a], &vb = adj[b];
        if (find(va.begin(), va.end(), b) == va.end()) va.push_back(b);
        if (find(vb.begin(), vb.end(), a) == vb.end()) vb.push_back(a);
    }
    bool hasNode(int id) { return adj.find(id) != adj.end(); }

    vector<int> bfs(int start) {
        vector<int> result;
        if (!hasNode(start)) return result;
        unordered_map<int, bool> vis;
        queue<int> q;
        vis[start] = true;
        q.push(start);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            result.push_back(u);
            for (int v : adj[u]) {
                if (!vis[v]) {
                    vis[v] = true;
                    q.push(v);
                }
            }
        }
        return result;
    }

    vector<int> dfs(int start) {
        vector<int> result;
        if (!hasNode(start)) return result;
        unordered_map<int, bool> vis;
        function<void(int)> dfsRec = [&](int u) {
            vis[u] = true;
            result.push_back(u);
            for (int v : adj[u]) if (!vis[v]) dfsRec(v);
        };
        dfsRec(start);
        return result;
    }

    // persistence helpers
    vector<pair<int,int>> edges() {
        vector<pair<int,int>> out;
        for (auto &p: adj) {
            int u = p.first;
            for (int v: p.second) {
                if (u < v) out.emplace_back(u,v);
            }
        }
        return out;
    }

    void clear() { adj.clear(); }
};

// ----------------------------- Utility Helpers -----------------------------

int promptInt(const string &msg) {
    while (true) {
        cout << msg;
        int x;
        if (cin >> x) {
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return x;
        }
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid input. Try again.\n";
    }
}

string trim(const string &s) {
    size_t a = s.find_first_not_of(" \t\r\n");
    if (a == string::npos) return "";
    size_t b = s.find_last_not_of(" \t\r\n");
    return s.substr(a, b - a + 1);
}

// ----------------------------- ResearchHub Class ---------------------------

class ResearchHub {
   private:
    unordered_map<int, Researcher> researchers; // hashing: researcher IDs
    vector<Project> projects;                    // project list
    unordered_map<int, stack<string>> revisions; // projectId -> stack of revisions
    queue<Request> requests;                     // collaboration request queue
    ProjectBST projectBST;                       // BST storing project IDs
    CollaborationGraph graph;                     // research collaboration graph

    // filenames
    const string rFile = "researchers.txt";
    const string pFile = "projects.txt";
    const string dFile = "documents.txt";
    const string reqFile = "requests.txt";
    const string collabFile = "collaborations.txt";

   public:
    ResearchHub() { loadAll(); }

    ~ResearchHub() { saveAll(); }

    // ----------------- File I/O and Persistence -----------------

    void loadAll() {
        bool ok = true;
        if (!loadResearchers()) ok = false;
        if (!loadProjects()) ok = false;
        if (!loadDocuments()) ok = false;
        if (!loadRequests()) ok = false;
        if (!loadCollaborations()) ok = false;
        if (!ok) {
            // If something missing or empty, seed sample data
            seedSampleData();
            saveAll();
        } else {
            // ensure BST and graph contain loaded IDs
            for (auto &pr: projects) projectBST.insert(pr.id);
            for (auto &p: projects) graph.addNode(p.id); // graph nodes don't have to be project ids, but ensures presence
            for (auto &r: researchers) graph.addNode(r.first);
        }
    }

    void saveAll() {
        saveResearchers();
        saveProjects();
        saveDocuments();
        saveRequests();
        saveCollaborations();
    }

    bool loadResearchers() {
        ifstream in(rFile);
        if (!in.is_open()) return false;
        researchers.clear();
        string line;
        while (getline(in, line)) {
            line = trim(line);
            if (line.empty()) continue;
            // format: id|name|department
            stringstream ss(line);
            string part;
            vector<string> parts;
            while (getline(ss, part, '|')) parts.push_back(part);
            if (parts.size() >= 3) {
                int id = stoi(parts[0]);
                researchers[id] = Researcher{id, parts[1], parts[2]};
            }
        }
        in.close();
        return true;
    }

    bool loadProjects() {
        ifstream in(pFile);
        if (!in.is_open()) return false;
        projects.clear();
        string line;
        while (getline(in, line)) {
            line = trim(line);
            if (line.empty()) continue;
            // format: id|title|priority|status
            stringstream ss(line);
            vector<string> parts;
            string part;
            while (getline(ss, part, '|')) parts.push_back(part);
            if (parts.size() >= 4) {
                Project p;
                p.id = stoi(parts[0]);
                p.title = parts[1];
                p.priority = parts[2];
                p.status = parts[3];
                projects.push_back(p);
                projectBST.insert(p.id);
            }
        }
        in.close();
        return true;
    }

    bool loadDocuments() {
        ifstream in(dFile);
        if (!in.is_open()) return false;
        revisions.clear();
        string line;
        while (getline(in, line)) {
            line = trim(line);
            if (line.empty()) continue;
            // format: projectId|rev1~rev2~rev3    (rev1 is bottom, last is top)
            stringstream ss(line);
            string idStr; getline(ss, idStr, '|');
            string rest; getline(ss, rest);
            int pid = stoi(idStr);
            stack<string> st;
            // parse revs
            vector<string> revs;
            string tmp;
            stringstream rs(rest);
            while (getline(rs, tmp, '~')) revs.push_back(tmp);
            // push in order so top is last element in file
            for (const string &r : revs) if (!r.empty()) st.push(r);
            revisions[pid] = st;
        }
        in.close();
        return true;
    }

    bool loadRequests() {
        ifstream in(reqFile);
        if (!in.is_open()) return false;
        while (!requests.empty()) requests.pop();
        string line;
        while (getline(in, line)) {
            line = trim(line);
            if (line.empty()) continue;
            // format: requesterId|projectId|message (message may contain | but we'll take after second |)
            stringstream ss(line);
            string rIdS, pIdS;
            getline(ss, rIdS, '|');
            getline(ss, pIdS, '|');
            string msg; getline(ss, msg);
            Request rq{stoi(rIdS), stoi(pIdS), msg};
            requests.push(rq);
        }
        in.close();
        return true;
    }

    bool loadCollaborations() {
        ifstream in(collabFile);
        if (!in.is_open()) return false;
        graph.clear();
        string line;
        while (getline(in, line)) {
            line = trim(line);
            if (line.empty()) continue;
            // format: a,b
            stringstream ss(line);
            string aS, bS;
            getline(ss, aS, ',');
            getline(ss, bS);
            if (!aS.empty() && !bS.empty()) {
                int a = stoi(aS), b = stoi(bS);
                graph.addEdge(a, b);
            }
        }
        in.close();
        return true;
    }

    void saveResearchers() {
        ofstream out(rFile, ios::trunc);
        for (auto &p : researchers) {
            out << p.second.id << "|" << p.second.name << "|" << p.second.department << "\n";
        }
        out.close();
    }

    void saveProjects() {
        ofstream out(pFile, ios::trunc);
        for (auto &pr : projects) {
            out << pr.id << "|" << pr.title << "|" << pr.priority << "|" << pr.status << "\n";
        }
        out.close();
    }

    void saveDocuments() {
        ofstream out(dFile, ios::trunc);
        for (auto &kv : revisions) {
            int pid = kv.first;
            // need to dump stack in bottom->top order, but stack only accessible top-first => copy
            stack<string> copy = kv.second;
            vector<string> items;
            while (!copy.empty()) {
                items.push_back(copy.top());
                copy.pop();
            }
            // items contains top->bottom; reverse to bottom->top
            reverse(items.begin(), items.end());
            out << pid << "|";
            for (size_t i = 0; i < items.size(); ++i) {
                out << items[i];
                if (i + 1 < items.size()) out << "~";
            }
            out << "\n";
        }
        out.close();
    }

    void saveRequests() {
        ofstream out(reqFile, ios::trunc);
        queue<Request> copy = requests;
        while (!copy.empty()) {
            Request r = copy.front(); copy.pop();
            out << r.requesterId << "|" << r.projectId << "|" << r.message << "\n";
        }
        out.close();
    }

    void saveCollaborations() {
        ofstream out(collabFile, ios::trunc);
        auto edges = graph.edges();
        for (auto &e : edges) out << e.first << "," << e.second << "\n";
        out.close();
    }

    // ----------------- Sample Data Seeding -----------------

    void seedSampleData() {
        researchers.clear();
        projects.clear();
        while (!requests.empty()) requests.pop();
        revisions.clear();
        graph.clear();
        projectBST = ProjectBST();

        // sample researchers
        for (int i = 1; i <= 6; ++i) {
            researchers[i] = Researcher{i, "Researcher_" + to_string(i), "Dept_" + to_string((i%3)+1)};
            graph.addNode(i);
        }

        // sample projects
        vector<string> prio = {"High","Medium","Low"};
        for (int i = 101; i <= 105; ++i) {
            Project p{i, "Project_" + to_string(i), prio[(i-101)%3], "Active"};
            projects.push_back(p);
            projectBST.insert(p.id);
        }

        // sample document revisions
        for (auto &p : projects) {
            stack<string> st;
            st.push("Initial draft for " + p.title);
            st.push("Added methodology");
            revisions[p.id] = st;
        }

        // sample requests
        requests.push(Request{1, 101, "Request to collaborate on methods"});
        requests.push(Request{3, 102, "Help requested for data preprocessing"});

        // sample collaborations
        graph.addEdge(1,2);
        graph.addEdge(2,3);
        graph.addEdge(3,4);
    }

    // ----------------- Researcher Module -----------------

    bool addResearcher(int id, const string &name, const string &dept) {
        if (researchers.find(id) != researchers.end()) {
            cout << "Duplicate researcher ID. Aborting.\n";
            return false;
        }
        researchers[id] = Researcher{id, name, dept};
        graph.addNode(id);
        saveResearchers();
        saveCollaborations();
        cout << "Researcher Added\n";
        return true;
    }

    void displayResearchers() {
        if (researchers.empty()) { cout << "No researchers.\n"; return; }
        cout << "Researchers:\n";
        for (auto &p : researchers) {
            cout << "ID: " << p.second.id << " | Name: " << p.second.name << " | Dept: " << p.second.department << "\n";
        }
    }

    void searchResearcherByID(int id) {
        auto it = researchers.find(id);
        if (it == researchers.end()) cout << "Researcher not found.\n";
        else cout << "Found: " << it->second.id << " " << it->second.name << " (" << it->second.department << ")\n";
    }

    void searchResearcherByName(const string &name) {
        bool found = false;
        for (auto &p: researchers) {
            if (p.second.name.find(name) != string::npos) {
                cout << "ID: " << p.second.id << " | " << p.second.name << "\n";
                found = true;
            }
        }
        if (!found) cout << "No researcher matched.\n";
    }

    bool deleteResearcher(int id) {
        auto it = researchers.find(id);
        if (it == researchers.end()) { cout << "Not found.\n"; return false; }
        researchers.erase(it);
        // Remove from graph adjacency lists by rebuilding graph edges except this node
        CollaborationGraph newG;
        for (auto &r : researchers) newG.addNode(r.first);
        // keep edges from old graph except involving deleted id
        auto edges = graph.edges();
        for (auto &e: edges) {
            if (e.first == id || e.second == id) continue;
            newG.addEdge(e.first, e.second);
        }
        graph = newG;
        saveResearchers();
        saveCollaborations();
        cout << "Deleted researcher " << id << "\n";
        return true;
    }

    // ----------------- Project Module -----------------

    bool addProject(int id, const string &title, const string &priority, const string &status) {
        for (auto &p : projects) if (p.id == id) { cout << "Duplicate project ID.\n"; return false; }
        Project pr{id, title, priority, status};
        projects.push_back(pr);
        projectBST.insert(id);
        saveProjects();
        saveDocuments();
        cout << "Project Added\n";
        return true;
    }

    void displayProjects() {
        if (projects.empty()) { cout << "No projects.\n"; return; }
        cout << "Projects:\n";
        for (auto &p : projects) {
            cout << "ID: " << p.id << " | " << p.title << " | " << p.priority << " | " << p.status << "\n";
        }
    }

    void searchProjectByID_linear(int id) {
        for (auto &p : projects) if (p.id == id) { cout << "Project Found: " << p.title << "\n"; return; }
        cout << "Project not found.\n";
    }

    // Requires projects sorted by id ascending for binary search
    int searchProjectByID_binary(int id) {
        vector<int> ids;
        for (auto &p: projects) ids.push_back(p.id);
        sort(ids.begin(), ids.end());
        int l = 0, r = (int)ids.size()-1;
        while (l <= r) {
            int m = (l+r)/2;
            if (ids[m] == id) return ids[m];
            if (ids[m] < id) l = m + 1; else r = m - 1;
        }
        return -1;
    }

    void searchProjectByTitle(const string &q) {
        bool found = false;
        for (auto &p : projects) {
            if (p.title.find(q) != string::npos) {
                cout << "Found: " << p.id << " | " << p.title << "\n";
                found = true;
            }
        }
        if (!found) cout << "No matching project.\n";
    }

    bool deleteProject(int id) {
        for (auto it = projects.begin(); it != projects.end(); ++it) {
            if (it->id == id) {
                projects.erase(it);
                // remove revisions, remove from BST not implemented removal (BST object simpler to recreate)
                // rebuild BST
                projectBST = ProjectBST();
                for (auto &p: projects) projectBST.insert(p.id);
                revisions.erase(id);
                saveProjects();
                saveDocuments();
                cout << "Project Deleted\n";
                return true;
            }
        }
        cout << "Project not found.\n";
        return false;
    }

    // ----------------- Sorting (QuickSort & MergeSort) -----------------

    // Priority mapping: High > Medium > Low
    static int priorityValue(const string &p) {
        if (p == "High") return 3;
        if (p == "Medium") return 2;
        return 1;
    }

    // QuickSort by priority descending
    void quickSortProjectsByPriority() {
        function<void(int,int)> quick = [&](int l, int r) {
            if (l >= r) return;
            int i = l, j = r;
            Project pivot = projects[(l + r) / 2];
            while (i <= j) {
                while (priorityValue(projects[i].priority) > priorityValue(pivot.priority)) i++;
                while (priorityValue(projects[j].priority) < priorityValue(pivot.priority)) j--;
                if (i <= j) {
                    swap(projects[i], projects[j]);
                    i++; j--;
                }
            }
            if (l < j) quick(l, j);
            if (i < r) quick(i, r);
        };
        quick(0, (int)projects.size() - 1);
        cout << "QuickSort by Priority (time complexity: average O(n log n), worst O(n^2)) applied.\n";
        saveProjects();
    }

    // MergeSort by title ascending
    void mergeSortProjectsByTitle() {
        function<void(int,int)> mergeSort = [&](int l, int r) {
            if (l >= r) return;
            int m = (l + r) / 2;
            mergeSort(l, m);
            mergeSort(m+1, r);
            vector<Project> tmp;
            int i = l, j = m+1;
            while (i <= m && j <= r) {
                if (projects[i].title <= projects[j].title) tmp.push_back(projects[i++]);
                else tmp.push_back(projects[j++]);
            }
            while (i <= m) tmp.push_back(projects[i++]);
            while (j <= r) tmp.push_back(projects[j++]);
            for (int k = 0; k < (int)tmp.size(); ++k) projects[l+k] = tmp[k];
        };
        if (!projects.empty()) mergeSort(0, (int)projects.size()-1);
        cout << "MergeSort by Title (time complexity: O(n log n)) applied.\n";
        saveProjects();
    }

    // ----------------- Document Module (Stack) -----------------

    void addRevision(int projectId, const string &content) {
        bool exists = false;
        for (auto &p : projects) if (p.id == projectId) { exists = true; break; }
        if (!exists) { cout << "Project not found.\n"; return; }
        revisions[projectId].push(content);
        saveDocuments();
        cout << "Revision added.\n";
    }

    void undoRevision(int projectId) {
        auto it = revisions.find(projectId);
        if (it == revisions.end() || it->second.empty()) { cout << "No revisions to undo.\n"; return; }
        it->second.pop();
        saveDocuments();
        cout << "Revision removed.\n";
    }

    void showRevisions(int projectId) {
        auto it = revisions.find(projectId);
        if (it == revisions.end() || it->second.empty()) { cout << "No revisions.\n"; return; }
        // need to display from top -> down without destroying stack
        stack<string> copy = it->second;
        cout << "Revisions (top->bottom):\n";
        while (!copy.empty()) {
            cout << "- " << copy.top() << "\n";
            copy.pop();
        }
    }

    // ----------------- Collaboration Module (Queue) -----------------

    void sendRequest(const Request &r) {
        // Validate requester and project existence
        if (researchers.find(r.requesterId) == researchers.end()) { cout << "Requester not found.\n"; return; }
        bool projExists = false;
        for (auto &p : projects) if (p.id == r.projectId) { projExists = true; break; }
        if (!projExists) { cout << "Project not found.\n"; return; }
        requests.push(r);
        saveRequests();
        cout << "Request Sent\n";
    }

    void processRequest() {
        if (requests.empty()) { cout << "No pending requests.\n"; return; }
        Request r = requests.front(); requests.pop();
        // For demo, processing means automatically accept and create collaboration edge between requester and project's lead (choose first researcher present)
        int requester = r.requesterId;
        int projectId = r.projectId;
        // pick any researcher ID to connect with (e.g., researcher with id equal to projectId%max)
        int partner = -1;
        if (!researchers.empty()) partner = researchers.begin()->first;
        if (partner != -1) {
            graph.addEdge(requester, partner);
            saveCollaborations();
        }
        saveRequests();
        cout << "Request Processed: " << r.message << "\n";
    }

    void showPendingRequests() {
        if (requests.empty()) { cout << "No pending requests.\n"; return; }
        queue<Request> copy = requests;
        cout << "Pending Requests:\n";
        while (!copy.empty()) {
            Request r = copy.front(); copy.pop();
            cout << "- From " << r.requesterId << " for Project " << r.projectId << " : " << r.message << "\n";
        }
    }

    // ----------------- Database Module (BST) -----------------

    void insertProjectIDToBST(int id) {
        projectBST.insert(id);
        cout << "Inserted to BST.\n";
    }

    void displayBSTInorder() {
        auto v = projectBST.inorder();
        cout << "BST Inorder: ";
        for (int x: v) cout << x << " ";
        cout << "\n";
    }

    void displayBSTPreorder() {
        auto v = projectBST.preorder();
        cout << "BST Preorder: ";
        for (int x: v) cout << x << " ";
        cout << "\n";
    }

    void displayBSTPostorder() {
        auto v = projectBST.postorder();
        cout << "BST Postorder: ";
        for (int x: v) cout << x << " ";
        cout << "\n";
    }

    void searchBST(int id) {
        bool found = projectBST.search(id);
        cout << (found ? "ID found in BST.\n" : "ID not found in BST.\n");
    }

    // ----------------- Network Module (Graph, BFS, DFS) -----------------

    void addCollaboration(int a, int b) {
        if (researchers.find(a) == researchers.end() || researchers.find(b) == researchers.end()) {
            cout << "Invalid researcher ID(s) for collaboration.\n"; return;
        }
        graph.addEdge(a,b);
        saveCollaborations();
        cout << "Collaboration added between " << a << " and " << b << "\n";
    }

    void runBFS(int start) {
        if (!graph.hasNode(start)) { cout << "Start node not found in graph.\n"; return; }
        auto v = graph.bfs(start);
        cout << "BFS Traversal from " << start << ": ";
        for (int x: v) cout << x << " ";
        cout << "\n";
    }

    void runDFS(int start) {
        if (!graph.hasNode(start)) { cout << "Start node not found in graph.\n"; return; }
        auto v = graph.dfs(start);
        cout << "DFS Traversal from " << start << ": ";
        for (int x: v) cout << x << " ";
        cout << "\n";
    }

    // ----------------- Simple Tests/Utilities -----------------

    void showMenu() {
        cout << "\n--- ResearchHub Menu ---\n";
        cout << "1  Add Researcher\n";
        cout << "2  Display Researchers\n";
        cout << "3  Search Researcher\n";
        cout << "4  Add Project\n";
        cout << "5  Display Projects\n";
        cout << "6  Sort Projects (QuickSort by Priority)\n";
        cout << "7  Sort Projects (MergeSort by Title)\n";
        cout << "8  Search Project\n";
        cout << "9  Add Revision\n";
        cout << "10 Undo Revision\n";
        cout << "11 Show Revisions\n";
        cout << "12 Send Request\n";
        cout << "13 Process Request\n";
        cout << "14 Show Requests\n";
        cout << "15 Add Collaboration\n";
        cout << "16 BFS\n";
        cout << "17 DFS\n";
        cout << "18 Display BST Traversals\n";
        cout << "19 Insert Project ID to BST\n";
        cout << "20 Delete Project\n";
        cout << "0  Exit\n";
        cout << "Choose: ";
    }

    void run() {
        while (true) {
            showMenu();
            int choice;
            if (!(cin >> choice)) { cin.clear(); cin.ignore(numeric_limits<streamsize>::max(), '\n'); cout << "Invalid choice.\n"; continue; }
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            if (choice == 0) {
                cout << "Exiting. Saving data...\n";
                saveAll();
                break;
            }
            switch (choice) {
                case 1: {
                    int id = promptInt("Researcher ID: ");
                    cout << "Name: "; string name; getline(cin, name);
                    cout << "Department: "; string dept; getline(cin, dept);
                    addResearcher(id, trim(name), trim(dept));
                    break;
                }
                case 2: displayResearchers(); break;
                case 3: {
                    cout << "Search by (1) ID or (2) Name? ";
                    int t; cin >> t; cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    if (t == 1) {
                        int id = promptInt("ID: ");
                        searchResearcherByID(id);
                    } else {
                        cout << "Name substring: "; string q; getline(cin, q);
                        searchResearcherByName(trim(q));
                    }
                    break;
                }
                case 4: {
                    int id = promptInt("Project ID: ");
                    cout << "Title: "; string title; getline(cin, title);
                    cout << "Priority (Low/Medium/High): "; string pri; getline(cin, pri);
                    cout << "Status: "; string st; getline(cin, st);
                    addProject(id, trim(title), trim(pri), trim(st));
                    break;
                }
                case 5: displayProjects(); break;
                case 6: quickSortProjectsByPriority(); break;
                case 7: mergeSortProjectsByTitle(); break;
                case 8: {
                    cout << "Search by (1) ID (binary, requires sorting) or (2) ID (linear) or (3) Title: ";
                    int t; cin >> t; cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    if (t == 1) {
                        int id = promptInt("ID: ");
                        int found = searchProjectByID_binary(id);
                        if (found != -1) cout << "Project Found (binary): " << found << "\n";
                        else cout << "Not found.\n";
                    } else if (t == 2) {
                        int id = promptInt("ID: ");
                        searchProjectByID_linear(id);
                    } else {
                        cout << "Title substring: "; string q; getline(cin, q);
                        searchProjectByTitle(trim(q));
                    }
                    break;
                }
                case 9: {
                    int pid = promptInt("Project ID: ");
                    cout << "Revision text: "; string txt; getline(cin, txt);
                    addRevision(pid, trim(txt));
                    break;
                }
                case 10: {
                    int pid = promptInt("Project ID: ");
                    undoRevision(pid);
                    break;
                }
                case 11: {
                    int pid = promptInt("Project ID: ");
                    showRevisions(pid);
                    break;
                }
                case 12: {
                    int requester = promptInt("Requester ID: ");
                    int pid = promptInt("Project ID: ");
                    cout << "Message: "; string msg; getline(cin, msg);
                    sendRequest(Request{requester, pid, trim(msg)});
                    break;
                }
                case 13: processRequest(); break;
                case 14: showPendingRequests(); break;
                case 15: {
                    int a = promptInt("Researcher A ID: ");
                    int b = promptInt("Researcher B ID: ");
                    addCollaboration(a,b);
                    break;
                }
                case 16: {
                    int s = promptInt("Start researcher ID: ");
                    runBFS(s);
                    break;
                }
                case 17: {
                    int s = promptInt("Start researcher ID: ");
                    runDFS(s);
                    break;
                }
                case 18: {
                    displayBSTInorder();
                    displayBSTPreorder();
                    displayBSTPostorder();
                    break;
                }
                case 19: {
                    int id = promptInt("Project ID to insert in BST: ");
                    insertProjectIDToBST(id);
                    break;
                }
                case 20: {
                    int id = promptInt("Project ID to delete: ");
                    deleteProject(id);
                    break;
                }
                default:
                    cout << "Invalid menu choice.\n";
            }
        }
    }
};

// ----------------------------- Entry Point -----------------------------

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cout << "ResearchHub - Smart Research Project Collaboration & Knowledge Sharing Platform\n";
    cout << "Loading data...\n";

    ResearchHub app;
    // run main menu loop
    app.run();

    return 0;
}
