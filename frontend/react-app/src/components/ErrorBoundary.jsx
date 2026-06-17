import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null } }
  static getDerivedStateFromError(error){ return { error } }
  componentDidCatch(err, info){ console.error('ErrorBoundary caught', err, info) }
  render(){
    if(this.state.error) return <div className="error">An error occurred: {String(this.state.error)}</div>
    return this.props.children
  }
}
