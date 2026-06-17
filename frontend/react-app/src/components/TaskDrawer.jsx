import React from 'react'

export default function TaskDrawer({ open, task, onClose }){
  if(!open) return null
  return (
    <div className="drawer">
      <div className="drawer-header">
        <h3>{task?.title || 'New Task'}</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="drawer-body">
        <pre>{JSON.stringify(task,null,2)}</pre>
      </div>
    </div>
  )
}
