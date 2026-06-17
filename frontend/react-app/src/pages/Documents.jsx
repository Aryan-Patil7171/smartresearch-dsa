import React, { useState, useEffect } from 'react'
import useAutoRefresh from '../hooks/useAutoRefresh'

export default function Documents() {
  const [pid, setPid] = useState('')
  const [revs, setRevs] = useState([])
  const [text, setText] = useState('')

  const tick = useAutoRefresh(4000)
  async function load() {
    const res = await fetch('/api/documents/' + Number(pid))
    setRevs(await res.json())
  }
  useEffect(() => { if (pid) load() }, [tick])

  async function add() {
    await fetch('/api/documents/' + Number(pid), { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: text }) })
    setText(''); load()
  }

  async function undo() {
    await fetch('/api/documents/' + Number(pid), { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="card">
        <h2>Documents / Revisions</h2>
        <input placeholder="Project ID" value={pid} onChange={e => setPid(e.target.value)} />
        <button className="btn" onClick={load}>Load</button>
        <div className="list">
          {revs.map((r,i) => <div key={i}>{r}</div>)}
        </div>
      </div>
      <div className="card">
        <h3>Add Revision</h3>
        <input placeholder="Text" value={text} onChange={e => setText(e.target.value)} style={{width:'60%'}} />
        <button className="btn" onClick={add}>Add</button>
        <button className="btn alt" onClick={undo}>Undo</button>
      </div>
    </div>
  )
}
