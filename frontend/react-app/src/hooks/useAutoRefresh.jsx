import { useEffect, useState, useRef } from 'react'

// Returns a tick counter that increments every `ms`. Use in components to trigger reloads.
export default function useAutoRefresh(ms = 3000) {
  const [tick, setTick] = useState(0)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    const id = setInterval(() => { if (mounted.current) setTick(t => t + 1) }, ms)
    return () => { mounted.current = false; clearInterval(id) }
  }, [ms])
  return tick
}
