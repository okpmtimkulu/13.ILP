import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type NodeState = 'up' | 'down' | 'syncing'
type NodeRole = 'leader' | 'replica'

type DbNode = {
  id: string
  role: NodeRole
  state: NodeState
  value: string
}

const INITIAL_NODES: DbNode[] = [
  { id: 'N1', role: 'leader', state: 'up', value: '' },
  { id: 'N2', role: 'replica', state: 'up', value: '' },
  { id: 'N3', role: 'replica', state: 'up', value: '' },
]

export function DistReplication({ onComplete }: { onComplete: () => void }) {
  const [nodes, setNodes] = useState<DbNode[]>(INITIAL_NODES)
  const [writeValue, setWriteValue] = useState('hello')
  const [replicating, setReplicating] = useState(false)
  const [killDone, setKillDone] = useState(false)
  const [reviveDone, setReviveDone] = useState(false)
  const [leaderFailover, setLeaderFailover] = useState(false)
  const [done, setDone] = useState(false)

  const leader = nodes.find((n) => n.role === 'leader' && n.state === 'up')
  const upReplicas = nodes.filter((n) => n.role === 'replica' && n.state === 'up')

  const sendWrite = () => {
    if (!leader) return
    setReplicating(true)
    // Write to leader
    setNodes((prev) => prev.map((n) => n.id === leader.id ? { ...n, value: writeValue } : n))
    // Replicate to up replicas after delay
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.role === 'replica' && n.state === 'up') ? { ...n, value: writeValue } : n)
      )
      setReplicating(false)
    }, 800)
  }

  const killNode = (id: string) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, state: 'down' } : n))
    setKillDone(true)
  }

  const reviveNode = (id: string) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, state: 'syncing' } : n))
    setTimeout(() => {
      const currentValue = nodes.find((n) => n.role === 'leader')?.value ?? ''
      setNodes((prev) =>
        prev.map((n) => n.id === id ? { ...n, state: 'up', value: currentValue } : n)
      )
      setReviveDone(true)
    }, 1000)
  }

  const killLeader = () => {
    const currentLeader = nodes.find((n) => n.role === 'leader')
    if (!currentLeader) return
    // First replica becomes leader
    const firstReplica = nodes.find((n) => n.role === 'replica' && n.state === 'up')
    if (!firstReplica) return
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === currentLeader.id) return { ...n, state: 'down' }
        if (n.id === firstReplica.id) return { ...n, role: 'leader' }
        return n
      })
    )
    setLeaderFailover(true)
  }

  const canComplete = killDone && reviveDone && leaderFailover

  const stateColor: Record<NodeState, string> = {
    up: '#10b981',
    down: '#ef4444',
    syncing: '#f59e0b',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Replication means the same data exists in multiple places. When one node fails, others continue serving.
        Watch a write propagate, a replica fail and recover, and a leader fail over.
      </p>

      <div className="dist-rep-stage">
        <div className="dist-rep-nodes">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={`dist-rep-node ${node.state === 'down' ? 'dist-rep-node--down' : ''}`}
              animate={{ opacity: node.state === 'down' ? 0.45 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <div className="dist-rep-node-header">
                <span className="dist-rep-node-id">{node.id}</span>
                <span
                  className="dist-rep-role"
                  style={{ color: node.role === 'leader' ? '#f59e0b' : '#94a3b8' }}
                >
                  {node.role}
                </span>
              </div>
              <motion.div
                className="dist-rep-node-dot"
                animate={{ backgroundColor: stateColor[node.state] }}
                transition={{ duration: 0.3 }}
              />
              <span className="micro">{node.state}</span>
              <div className="dist-rep-value">
                {node.value ? (
                  <motion.code
                    key={node.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    {node.value}
                  </motion.code>
                ) : (
                  <span className="micro" style={{ color: 'var(--text-3)' }}>empty</span>
                )}
              </div>
              {node.role === 'replica' && node.state === 'up' && (
                <button type="button" className="btn primary" onClick={() => killNode(node.id)} style={{ fontSize: '0.7rem' }}>
                  Kill
                </button>
              )}
              {node.state === 'down' && node.role === 'replica' && (
                <button type="button" className="btn primary" onClick={() => reviveNode(node.id)} style={{ fontSize: '0.7rem' }}>
                  Revive
                </button>
              )}
              {node.role === 'leader' && node.state === 'up' && killDone && (
                <button type="button" className="btn primary" onClick={killLeader} style={{ fontSize: '0.7rem', background: 'var(--error)' }}>
                  Kill leader
                </button>
              )}
              {node.state === 'syncing' && <span className="micro" style={{ color: '#f59e0b' }}>catching up...</span>}
            </motion.div>
          ))}
        </div>

        {replicating && (
          <motion.p
            className="micro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Replicating to {upReplicas.length} replica{upReplicas.length !== 1 ? 's' : ''}...
          </motion.p>
        )}

        {leaderFailover && (
          <motion.p
            className="db-acid-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Leader failed. New leader elected. Reads and writes continue.
          </motion.p>
        )}

        <div className="dist-rep-write">
          <input
            className="db-query-input"
            value={writeValue}
            onChange={(e) => setWriteValue(e.target.value)}
            placeholder="Value to write"
          />
          <button type="button" className="btn primary" onClick={sendWrite} disabled={!leader || replicating}>
            Write to leader
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
            {!killDone
              ? 'Kill a replica to see fault tolerance'
              : !reviveDone
              ? 'Revive the replica — it catches up via replication log'
              : !leaderFailover
              ? 'Kill the leader to see leader election'
              : ''}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="iCloud, GitHub, and every major database run exactly this"
          body={
            <>
              Data survives because it exists in multiple places. iCloud replicates to multiple data centers.
              GitHub replicates each repository across servers. PostgreSQL streaming replication uses the same
              Write-Ahead Log from the transactions chapter.
            </>
          }
          appearsIn={['PostgreSQL streaming replication', 'MongoDB replica sets', 'iCloud', 'GitHub']}
          hook="Replication keeps data available. But what if replicas disagree? Consensus prevents that. Next."
        />
      )}
    </div>
  )
}
