import { motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Strategy = 'round-robin' | 'least-connections'
type ServerState = 'up' | 'slow' | 'down'

type Server = { id: string; queue: number; state: ServerState }

const INITIAL_SERVERS: Server[] = [
  { id: 'S1', queue: 0, state: 'up' },
  { id: 'S2', queue: 0, state: 'up' },
  { id: 'S3', queue: 0, state: 'up' },
  { id: 'S4', queue: 0, state: 'up' },
]

export function DistLoadbalance({ onComplete }: { onComplete: () => void }) {
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS)
  const [strategy, setStrategy] = useState<Strategy>('round-robin')
  const [speed, setSpeed] = useState(1)
  const [rrIdx, setRrIdx] = useState(0)
  const [healthChecks, setHealthChecks] = useState(false)
  const [overloadDone, setOverloadDone] = useState(false)
  const [switchDone, setSwitchDone] = useState(false)
  const [spiked, setSpiked] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [requestsTotal, setRequestsTotal] = useState(0)

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setServers((prev) => {
        const up = prev.filter((s) => s.state !== 'down' && (healthChecks || s.state !== 'slow' || s.queue < 20))
        if (up.length === 0) return prev
        let targetIdx: number
        if (strategy === 'round-robin') {
          setRrIdx((ri) => {
            const upIds = prev.map((s, i) => (s.state !== 'down' ? i : -1)).filter((i) => i >= 0)
            if (upIds.length === 0) return ri
            const next = upIds[ri % upIds.length]
            return (ri + 1) % upIds.length
          })
          const upServers = prev.filter((s) => s.state !== 'down')
          targetIdx = prev.indexOf(upServers[rrIdx % Math.max(upServers.length, 1)])
        } else {
          // Least connections: pick server with fewest queued
          const upServers = prev.filter((s) => s.state !== 'down')
          const minQueue = Math.min(...upServers.map((s) => s.queue))
          const bestServer = upServers.find((s) => s.queue === minQueue) ?? upServers[0]
          targetIdx = prev.indexOf(bestServer)
        }
        return prev.map((s, i) => {
          if (i === targetIdx) return { ...s, queue: Math.min(s.queue + speed, 30) }
          // Drain queues slowly
          return { ...s, queue: Math.max(0, s.queue - 1) }
        })
      })
      setRequestsTotal((t) => t + speed)
    }, 400)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [strategy, speed, healthChecks, rrIdx])

  const overloadServer = (id: string) => {
    setServers((prev) => prev.map((s) => s.id === id ? { ...s, state: 'slow' } : s))
    setOverloadDone(true)
  }

  const killServer = (id: string) => {
    setServers((prev) => prev.map((s) => s.id === id ? { ...s, state: 'down', queue: 0 } : s))
  }

  const spike = () => {
    setSpeed(10)
    setSpiked(true)
    setTimeout(() => setSpeed(1), 3000)
  }

  const canComplete = overloadDone && switchDone && spiked

  const stateColor: Record<ServerState, string> = {
    up: '#10b981',
    slow: '#f59e0b',
    down: '#ef4444',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        A load balancer distributes incoming requests across servers. The distribution strategy and health checking
        determine whether a failure cascades or is absorbed.
      </p>

      <div className="dist-lb-stage">
        <div className="dist-lb-header">
          <div className="dist-lb-lb">
            <span className="swe-pat-node">Load Balancer</span>
            <div className="dist-lb-strategy-toggle">
              <button
                type="button"
                className={`db-acid-tab ${strategy === 'round-robin' ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setStrategy('round-robin'); setSwitchDone(true) }}
              >
                Round-robin
              </button>
              <button
                type="button"
                className={`db-acid-tab ${strategy === 'least-connections' ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setStrategy('least-connections'); setSwitchDone(true) }}
              >
                Least connections
              </button>
            </div>
          </div>
          <span className="micro">Total requests: {requestsTotal}</span>
        </div>

        <div className="dist-lb-servers">
          {servers.map((s) => (
            <motion.div
              key={s.id}
              className={`dist-rep-node ${s.state === 'down' ? 'dist-rep-node--down' : ''}`}
              animate={{ opacity: s.state === 'down' ? 0.4 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <span className="dist-rep-node-id">{s.id}</span>
              <motion.div
                className="dist-rep-node-dot"
                animate={{ backgroundColor: stateColor[s.state] }}
                transition={{ duration: 0.3 }}
              />
              <span className="micro">{s.state}</span>
              <div className="dist-lb-queue-bar">
                <motion.div
                  className={`dist-lb-queue-fill ${s.queue > 20 ? 'dist-lb-queue-fill--danger' : ''}`}
                  animate={{ height: `${(s.queue / 30) * 60}px` }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
              </div>
              <span className="micro">{s.queue} req</span>
              {s.state === 'up' && (
                <button type="button" className="btn primary" onClick={() => overloadServer(s.id)} style={{ fontSize: '0.65rem' }}>
                  Overload
                </button>
              )}
              {s.state !== 'down' && (
                <button type="button" className="btn primary" onClick={() => killServer(s.id)} style={{ fontSize: '0.65rem', background: 'var(--error)' }}>
                  Kill
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="dist-lb-controls">
          <label className="sec-xor-label">
            Request speed: {speed}x
            <input
              type="range"
              min={1}
              max={8}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: '120px' }}
            />
          </label>
          <label className="db-acid-toggle">
            <input
              type="checkbox"
              checked={healthChecks}
              onChange={(e) => setHealthChecks(e.target.checked)}
            />
            <span className="micro">Health checks (avoid slow/down servers)</span>
          </label>
          <button type="button" className="btn primary" onClick={spike} disabled={spiked && speed > 1}>
            Spike: 10x traffic (3s)
          </button>
        </div>
      </div>

      <div className="lesson-actions">
        {canComplete && !done && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(true)
              onComplete()
            }}
          >
            Continue
          </button>
        )}
        {!canComplete && (
          <span className="hint">
            {!overloadDone
              ? 'Overload a server, then switch strategies'
              : !switchDone
              ? 'Switch to least-connections to see it avoid the slow server'
              : !spiked
              ? 'Trigger the traffic spike'
              : ''}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="nginx, AWS ALB, and Cloudflare make these decisions millions of times per second"
          body={
            <>
              Round-robin is stateless and fast but blind to server load. Least-connections is smarter but requires
              tracking state. Health checks are essential — without them, a load balancer happily sends traffic to a
              crashed server. All three are configurable in any production load balancer.
            </>
          }
          appearsIn={['nginx upstream configuration', 'AWS Application Load Balancer', 'Kubernetes Service']}
          hook="Load balancers distribute work across machines. MapReduce distributes computation across machines. Next."
        />
      )}
    </div>
  )
}
