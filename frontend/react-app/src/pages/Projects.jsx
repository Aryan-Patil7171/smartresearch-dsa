import React, { useEffect, useState } from 'react'
import useAutoRefresh from '../hooks/useAutoRefresh'

export default function Projects() {
  const [list, setList] = useState([])
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Low')
  const [status, setStatus] = useState('Active')
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState('')

  const tick = useAutoRefresh(3000)
  useEffect(() => { load() }, [tick])
  async function load() {
    const res = await fetch('/api/projects')
    setList(await res.json())
  }

  async function add() {
    await fetch('/api/projects', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: Number(id), title, priority, status }) })
    setId(''); setTitle(''); load()
  }

  function quickSortByPriority(arr) {
    function pval(p){ return p==='High'?3:(p==='Medium'?2:1) }
    function quick(a,b){
      if(a>=b) return
      let i=a,j=b; const pivot = arr[Math.floor((a+b)/2)];
      while(i<=j){
        while(pval(arr[i].priority) > pval(pivot.priority)) i++
        while(pval(arr[j].priority) < pval(pivot.priority)) j--
        if(i<=j){ [arr[i],arr[j]] = [arr[j],arr[i]]; i++; j-- }
      }
      if(a<j) quick(a,j)
      if(i<b) quick(i,b)
    }
    quick(0, arr.length-1)
    return arr
  }

  function mergeSortByTitle(arr) {
    function mergeSort(l,r){
      if(l>=r) return
      const m = Math.floor((l+r)/2)
      mergeSort(l,m); mergeSort(m+1,r)
      const tmp = []
      let i=l,j=m+1
      while(i<=m && j<=r){
        if(arr[i].title <= arr[j].title) tmp.push(arr[i++])
        else tmp.push(arr[j++])
      }
      while(i<=m) tmp.push(arr[i++])
      while(j<=r) tmp.push(arr[j++])
      for(let k=0;k<tmp.length;k++) arr[l+k]=tmp[k]
    }
    if(arr.length) mergeSort(0,arr.length-1)
    return arr
  }

  function doQuickSort() { const copy = [...list]; setList(quickSortByPriority(copy)) }
  function doMergeSort() { const copy = [...list]; setList(mergeSortByTitle(copy)) }

  function linearSearchById(val){
    for(const p of list) if(p.id===val) return p
    return null
  }

  function binarySearchById(val){
    const ids = list.map(p=>p.id).sort((a,b)=>a-b)
    let l=0,r=ids.length-1
    while(l<=r){ const m=Math.floor((l+r)/2); if(ids[m]===val) return ids[m]; if(ids[m]<val) l=m+1; else r=m-1 }
    return null
  }

  async function doDelete(id){ await fetch('/api/projects/'+id, { method:'DELETE' }); load() }

  function doSearch(){
    setSearchResult('')
    if(!query) return load()
    const num = Number(query)
    if(!Number.isNaN(num)){
      const lin = linearSearchById(num)
      if(lin){ setSearchResult(`Found: ${lin.id} — ${lin.title}`); return }
      const bin = binarySearchById(num)
      if(bin) { setSearchResult(`Found (binary): ${bin}`); return }
      setSearchResult('Not found')
    } else {
      const matches = list.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
      setSearchResult(matches.length ? matches.map(m=>`${m.id}:${m.title}`).join(' | ') : 'No matches')
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Projects</h2>
        <div className="controls">
          <input className="input" placeholder="Search by ID or title" value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn alt" onClick={doSearch}>Search</button>
          <button className="btn alt" onClick={()=>{ setQuery(''); setSearchResult(''); load() }}>Clear</button>
          <div style={{marginLeft:'auto'}}>
            <button className="btn alt" onClick={doQuickSort}>QuickSort Priority</button>
            <button className="btn" onClick={doMergeSort} style={{marginLeft:8}}>MergeSort Title</button>
          </div>
        </div>
        {searchResult && <div className="small muted">{searchResult}</div>}
        <div className="list vertical-list">
          {list.map(p => (
            <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>{p.id} — <strong>{p.title}</strong> <span className="small">[{p.priority}]</span> <span className="muted">({p.status})</span></div>
              <div>
                <button className="btn alt" onClick={()=>doDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Add Project</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input className="input" placeholder="ID" value={id} onChange={e => setId(e.target.value)} style={{width:80}} />
          <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{flex:1}} />
          <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input className="input" placeholder="Status" value={status} onChange={e => setStatus(e.target.value)} style={{width:120}} />
          <button className="btn" onClick={add}>Add</button>
        </div>
      </div>
    </div>
  )
}
