import React, { useEffect, useState } from 'react'
import useAutoRefresh from '../hooks/useAutoRefresh'

export default function Researchers() {
  const [list, setList] = useState([])
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [dept, setDept] = useState('')

  const tick = useAutoRefresh(5000)
  useEffect(() => { load() }, [tick])
  async function load() {
    const res = await fetch('/api/researchers')
    setList(await res.json())
  }

  async function add() {
    await fetch('/api/researchers', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: Number(id), name, department: dept }) })
    setId(''); setName(''); setDept(''); load()
  }

  return (
    <div>
      <div className="card">
        <h2>Researchers</h2>
        <div className="list">
          {list.map(r => <div key={r.id}>{r.id} — {r.name} ({r.department})</div>)}
        </div>
      </div>
      <div className="card">
        <h3>Add Researcher</h3>
        <input placeholder="ID" value={id} onChange={e => setId(e.target.value)} />
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Dept" value={dept} onChange={e => setDept(e.target.value)} />
        <button className="btn" onClick={add}>Add</button>
      </div>
    </div>
  )
}
