import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase = 'idle' | 'election' | 'replication' | 'partition' | 'partition-leader' | 'heal' | 'done'

const NODES = ['N1', 'N2', 'N3', 'N4', 'N5']

export function DistConsensus({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [leader, setLeader] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [committed, setCommitted] = useState(false)
  const [partitionSide, setPartitionSide] = useState<'small' | 'large' | null>(null)
  const [healDone, setHealDone] = useState(false)
  const [done, setDone] = useState(false)

  const phaseSeen = new Set<Phase>()

  const advance = () => {
    setPhase((p) => {
      if (p === 'idle') {
        // Start election
        setTimeout(() => {
          setVotes({ N2: 'N1', N3: 'N1', N4: 'N1', N5: 'N1' })
          setLeader('N1')
        }, 600)
        return 'election'
      }
      if (p === 'election') return 'replication'
      if (p === 'replication') {
        setTimeout(() => setCommitted(true), 800)
        return 'replication'
      }
      if (p === 'partition') return 'partition-leader'
      if (p === 'partition-leader') return 'heal'
      if (p === 'heal') {
        setHealDone(true)
        return 'done'
      }
      return p
    })
  }

  const startPartition = () => {
    setPhase('partition')
    setPartitionSide('small')
  }

  const showLargePartition = () => {
    setPartitionSide('large')
    setPhase('partition-leader')
    setTimeout(() => setLeader('N3'), 600)
  }

  const heal = () => {
    setPhase('heal')
    setTimeout(() => {
      setLeader('N3') // N3 remains leader, N1 demoted
      setHealDone(true)
      setPhase('done')
    }, 800)
  }

  const smallPartition = ['N1', 'N2']
  const largePartition = ['N3', 'N4', 'N5']

  const phaseLabel: Record<Phase, string> = {
    idle: 'Ready: 5 nodes, no leader yet',
    election: 'Phase 1: Leader election — N1 wins (first to get 3 votes)',
    replication: 'Phase 2: N1 proposes value "X", waits for majority (3/5)',
    partition: 'Phase 3: Network partition — N1+N2 isolated from N3+N4+N5',
    'partition-leader': 'Larger partition (N3+N4+N5) elects new leader N3',
    heal: 'Healing partition — N1+N2 rejoin',
    done: 'Healed. N1 becomes follower, catches up to N3\'s log.',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Raft consensus ensures a cluster agrees on a leader and a log — even when nodes fail or the network splits.
        Walk through election, replication, partition, and healing.
      </p>

      <div className="dist-cons-stage">
        <p className="micro">{phaseLabel[phase]}</p>

        <div className="dist-cons-nodes">
          {NODES.map((node) => {
            const isLeader = node === leader
            const isSmall = smallPartition.includes(node)
            const isLarge = largePartition.includes(node)
            const inSmallPartition = phase === 'partition' || phase === 'partition-leader'
            const isIsolated = inSmallPartition && isSmall
            const isActive = inSmallPartition && isLarge
            const voted = votes[node]

            return (
              <motion.div
                key={node}
                className={`dist-cons-node ${isLeader ? 'dist-cons-node--leader' : ''} ${isIsolated ? 'dist-cons-node--isolated' : ''}`}
                animate={{
                  opacity: isIsolated ? 0.4 : 1,
                  borderColor: isLeader ? '#f59e0b' : isIsolated ? '#ef4444' : '#334155',
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <span className="dist-rep-node-id">{node}</span>
                {isLeader && <span className="dist-rep-role" style={{ color: '#f59e0b' }}>LEADER</span>}
                {phase === 'election' && voted && (
                  <motion.span
                    className="micro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    voted {voted}
                  </motion.span>
                )}
                {phase === 'replication' && committed && !isLeader && (
                  <span className="db-acid-ok micro">✓ "X"</span>
                )}
                {isIsolated && <span className="micro" style={{ color: '#ef4444' }}>no majority</span>}
              </motion.div>
            )
          })}
        </div>

        {(phase === 'partition' || phase === 'partition-leader') && (
          <motion.div
            className="dist-cons-partition-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <span className="micro" style={{ color: '#ef4444' }}>── partition ──</span>
          </motion.div>
        )}

        {phase === 'partition' && partitionSide === 'small' && (
          <div className="dist-cons-info">
            <p className="micro" style={{ color: '#ef4444' }}>
              N1+N2 (2 nodes): cannot form majority (need 3/5). Refuses writes — stays safe.
            </p>
            <button type="button" className="btn primary" onClick={showLargePartition}>
              Show larger partition
            </button>
          </div>
        )}

        {phase === 'partition-leader' && (
          <div className="dist-cons-info">
            <p className="micro" style={{ color: '#10b981' }}>
              N3+N4+N5 (3 nodes): forms majority. Elects N3. Keeps serving writes.
            </p>
            <button type="button" className="btn primary" onClick={heal}>
              Heal partition
            </button>
          </div>
        )}

        {phase === 'done' && (
          <motion.p
            className="db-acid-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            N1 demoted to follower, catches up from N3's log. Cluster fully consistent again.
          </motion.p>
        )}
      </div>

      <div className="lesson-actions">
        {phase === 'idle' && (
          <button type="button" className="btn primary" onClick={advance}>
            Start leader election
          </button>
        )}
        {phase === 'election' && leader && (
          <button type="button" className="btn primary" onClick={advance}>
            Replicate value "X"
          </button>
        )}
        {phase === 'replication' && committed && (
          <button type="button" className="btn primary" onClick={startPartition}>
            Simulate network partition
          </button>
        )}
        {phase === 'done' && !done && (
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
        {phase === 'replication' && !committed && <span className="hint">Waiting for majority acknowledgment...</span>}
      </div>

      {phase === 'done' && (
        <ConnectionCard
          title="Raft powers etcd, which powers Kubernetes"
          body={
            <>
              etcd is the distributed key-value store at the heart of every Kubernetes cluster. It uses Raft to ensure
              the cluster state — what pods are running, on which nodes — is consistent even when control-plane nodes
              fail. Kubernetes runs the majority of the world's cloud infrastructure.
            </>
          }
          appearsIn={['etcd', 'Kubernetes control plane', 'CockroachDB', 'TiKV']}
          hook="Consensus prevents disagreement. CAP theorem says every distributed system must make a harder choice. Next."
        />
      )}
    </div>
  )
}
