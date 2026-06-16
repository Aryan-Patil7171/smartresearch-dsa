import { Component } from 'react';

/**
 * Generic Error Boundary – wraps individual Task Cards and Columns.
 * If one child crashes, it shows a fallback instead of crashing the whole board.
 */
export class CardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[CardErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 flex items-center gap-3 min-h-[72px]">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-400 font-semibold text-sm">Task Failed To Load</p>
            <p className="text-red-400/60 text-xs mt-0.5">This card encountered an error.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-xs text-red-400 underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export class ColumnErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ColumnErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-500/40 rounded-2xl p-6 min-w-[280px] flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">⚠️</span>
          <p className="text-red-400 font-semibold">Column Failed To Load</p>
          <p className="text-red-400/60 text-sm text-center">Other columns continue working.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-sm text-red-400 border border-red-500/40 rounded-lg px-3 py-1 hover:bg-red-500/10 transition"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
