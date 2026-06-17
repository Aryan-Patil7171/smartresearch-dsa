import React from 'react'

export default function TaskCard({ task, onClick }){
  if(!task) return null
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-title">{task.title || `Task ${task.id || ''}`}</div>
      {task.priority && <div className="task-meta">{task.priority}</div>}
    </div>
  )
}
