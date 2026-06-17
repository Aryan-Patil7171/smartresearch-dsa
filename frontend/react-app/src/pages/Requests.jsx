import React, { useEffect, useState } from 'react'
import useAutoRefresh from '../hooks/useAutoRefresh'

export default function Requests() {
  const [list, setList] = useState([])
  const [reqId, setReqId] = useState('')
  const [projId, setProjId] = useState('')
  const [msg, setMsg] = useState('')

  const tick = useAutoRefresh(4500)
  useEffect(() => { load() }, [tick])
  async function load() {
    const res = await fetch('/api/requests')
    setList(await res.json())
  }

  async function send() {
    await fetch('/api/requests', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ requesterId: Number(reqId), projectId: Number(projId), message: msg }) })
    setReqId(''); setProjId(''); setMsg(''); load()
  }

  async function processNext() {
    await fetch('/api/requests/process', { method:'POST' })
    load()
  }

  return (
    <div>
      <div className="card">
        <h2>Pending Requests</h2>
        <div className="list">
          {list.map((r,i) => <div key={i}>{r.requesterId}{' → '}{r.projectId} : {r.message}</div>)}
        </div>
      </div>
      <div className="card">
        <h3>Send Request</h3>
        <input placeholder="Requester ID" value={reqId} onChange={e => setReqId(e.target.value)} />
        <input placeholder="Project ID" value={projId} onChange={e => setProjId(e.target.value)} />
        <input placeholder="Message" value={msg} onChange={e => setMsg(e.target.value)} />
        <button className="btn" onClick={send}>Send</button>
        <button className="btn alt" onClick={processNext}>Process Next</button>
      </div>
    </div>
  )
}
