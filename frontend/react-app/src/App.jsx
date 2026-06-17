import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Researchers from './pages/Researchers.jsx'
import Projects from './pages/Projects.jsx'
import Documents from './pages/Documents.jsx'
import Requests from './pages/Requests.jsx'
import Collaborations from './pages/Collaborations.jsx'

export default function App() {
  return (
    <div className="container">
      <div className="app">
        <header className="header">
          <h1>ResearchHub (React)</h1>
          <nav>
            <Link to="/">Researchers</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/documents">Documents</Link>
            <Link to="/requests">Requests</Link>
            <Link to="/collaborations">Collaborations</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Researchers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/collaborations" element={<Collaborations />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
