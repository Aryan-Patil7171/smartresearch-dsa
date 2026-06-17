import React from 'react'

export default function Board({ children, title }){
  return (
    <div className="board card">
      {title && <h3>{title}</h3>}
      <div className="board-inner">{children}</div>
    </div>
  )
}
