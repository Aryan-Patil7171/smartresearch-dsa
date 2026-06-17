import React, { useEffect, useState } from 'react'
import useAutoRefresh from '../hooks/useAutoRefresh'

export default function Collaborations() {
  const [researchers, setResearchers] = useState([])
  const [edges, setEdges] = useState([])
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [output, setOutput] = useState('')

  const tick = useAutoRefresh(4500)
  useEffect(() => { load() }, [tick])
  async function load() {
    const [rRes, cRes] = await Promise.all([fetch('/api/researchers'), fetch('/api/collaborations')])
    setResearchers(await rRes.json())
    setEdges(await cRes.json())
  }

  function buildAdj() {
    const adj = new Map()
    for (const r of researchers) adj.set(r.id, [])
    for (const e of edges) {
      if (!adj.has(e.a)) adj.set(e.a, [])
      if (!adj.has(e.b)) adj.set(e.b, [])
      adj.get(e.a).push(e.b)
      adj.get(e.b).push(e.a)
    }
    return adj
  }

  async function addEdge() {
    const na = Number(a), nb = Number(b)
    if (Number.isNaN(na) || Number.isNaN(nb)) return
    await fetch('/api/collaborations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ a: na, b: nb }) })
    setA(''); setB(''); load()
  }

  function bfs(start) {
    const adj = buildAdj()
    if (!adj.has(start)) { setOutput('Start node not found'); return }
    const q = [start]
    const vis = new Set([start])
    const out = []
    while (q.length) {
      const u = q.shift()
      out.push(u)
      for (const v of adj.get(u) || []) if (!vis.has(v)) { vis.add(v); q.push(v) }
    }
    setOutput('BFS: ' + out.join(' -> '))
  }

  function dfs(start) {
    const adj = buildAdj()
    if (!adj.has(start)) { setOutput('Start node not found'); return }
    const vis = new Set()
    const out = []
    function rec(u) { vis.add(u); out.push(u); for (const v of adj.get(u) || []) if (!vis.has(v)) rec(v) }
    rec(start)
    setOutput('DFS: ' + out.join(' -> '))
  }

  return (
    <div>
      <div className="card">
        <h2>Collaborations</h2>
        <div className="controls">
          <input className="input" placeholder="A (researcher id)" value={a} onChange={e => setA(e.target.value)} />
          <input className="input" placeholder="B (researcher id)" value={b} onChange={e => setB(e.target.value)} />
          <button className="btn" onClick={addEdge}>Add Collaboration</button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ flex: 1 }} className="card">
            <h4>Researchers</h4>
            <div className="vertical-list">
              {researchers.map(r => <div key={r.id}>{r.id} — {r.name}</div>)}
            </div>
          </div>
          <div style={{ flex: 1 }} className="card">
            <h4>Adjacency</h4>
            <div className="graph-adj">
              {(() => {
                const adj = buildAdj();
                let s = '';
                for (const [k, v] of Array.from(adj.entries()).sort((a, b) => a[0] - b[0])) s += `${k}: [${(v || []).join(', ')}]\n`;
                return s
              })()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <input className="input" placeholder="Start node for traversal" id="startNode" style={{ width: 160 }} />
          <button className="btn" onClick={() => { const s = Number(document.getElementById('startNode').value); bfs(s) }}>BFS</button>
          <button className="btn" onClick={() => { const s = Number(document.getElementById('startNode').value); dfs(s) }} style={{ marginLeft: 8 }}>DFS</button>
        </div>

        <div className="small muted" style={{ marginTop: 12 }}>{output}</div>
      </div>
    </div>
  )
}
