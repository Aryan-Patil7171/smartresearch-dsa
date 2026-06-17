import React from 'react'

export default function ActivityPanel({ items = [] }){
  return (
    <div className="activity-panel card">
      <h4>Activity</h4>
      <div className="list">
        {items.length === 0 ? <div className="muted">No activity</div> : items.map((it,i) => <div key={i}>{it}</div>)}
      </div>
    </div>
  )
}
