import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type SystemId = 'mongodb' | 'cassandra' | 'postgres'

const SYSTEMS: {
  id: SystemId
  name: string
  type: 'CP' | 'AP' | 'CA'
  desc: string
  partitionBehavior: string
  color: string
}[] = [
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'CP',
    desc: 'Consistent + Partition tolerant',
    partitionBehavior: 'Becomes unavailable — refuses writes until partition heals.',
    color: '#10b981',
  },
  {
    id: 'cassandra',
    name: 'Cassandra',
    type: 'AP',
    desc: 'Available + Partition tolerant',
    partitionBehavior: 'Stays available — may return stale data from isolated nodes.',
    color: '#f59e0b',
  },
  {
    id: 'postgres',
    name: 'Single PostgreSQL',
    type: 'CA',
    desc: 'Consistent + Available (no partition)',
    partitionBehavior: 'Cannot operate under partition — single node, no distribution.',
    color: '#6366f1',
  },
]

// Triangle vertex positions (in %)
const VERTICES: Record<string, { x: number; y: number }> = {
  C: { x: 50, y: 5 },
  A: { x: 5, y: 90 },
  P: { x: 95, y: 90 },
}

const SYSTEM_POSITIONS: Record<SystemId, { x: number; y: number }> = {
  mongodb: { x: 50, y: 45 },  // CP — between C and P
  cassandra: { x: 50, y: 75 }, // AP — between A and P
  postgres: { x: 20, y: 50 }, // CA — between C and A
}

export function DistCap({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<Set<SystemId>>(new Set())
  const [partitioned, setPartitioned] = useState(false)
  const [done, setDone] = useState(false)

  const placeSystem = (id: SystemId) => {
    setPlaced((prev) => new Set([...prev, id]))
  }

  const allPlaced = placed.size === 3

  return (
    <div className="lesson-panel">
      <p className="lede">
        The CAP theorem says a distributed system can guarantee at most two of: Consistency, Availability, and Partition
        tolerance. Since network partitions are inevitable, you really choose between CP and AP.
      </p>

      <div className="dist-cap-stage">
        <div className="dist-cap-triangle-wrap">
          <svg className="dist-cap-triangle" viewBox="0 0 100 100">
            <polygon
              points={`${VERTICES.C.x},${VERTICES.C.y} ${VERTICES.A.x},${VERTICES.A.y} ${VERTICES.P.x},${VERTICES.P.y}`}
              fill="rgba(51,65,85,0.4)"
              stroke="#475569"
              strokeWidth="0.8"
            />
            {/* Vertex labels */}
            {Object.entries(VERTICES).map(([k, v]) => (
              <text key={k} x={v.x} y={v.y - 2} textAnchor="middle" fontSize="5" fill="#e2e8f0" fontWeight="bold">
                {k === 'C' ? 'Consistency' : k === 'A' ? 'Availability' : 'Partition tolerance'}
              </text>
            ))}
            {/* Placed systems */}
            {SYSTEMS.filter((s) => placed.has(s.id)).map((s) => {
              const pos = SYSTEM_POSITIONS[s.id]
              return (
                <motion.g key={s.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                  <circle cx={pos.x} cy={pos.y} r={5} fill={s.color} />
                  <text x={pos.x} y={pos.y + 9} textAnchor="middle" fontSize="4" fill={s.color}>
                    {s.name}
                  </text>
                  <text x={pos.x} y={pos.y + 14} textAnchor="middle" fontSize="3.5" fill="#94a3b8">
                    {s.type}
                  </text>
                </motion.g>
              )
            })}
          </svg>
        </div>

        <div className="dist-cap-systems">
          {SYSTEMS.map((s) => (
            <div key={s.id} className={`dist-cap-card ${placed.has(s.id) ? 'dist-cap-card--placed' : ''}`} style={{ borderColor: s.color }}>
              <div className="dist-cap-card-header">
                <span className="dist-cap-card-name">{s.name}</span>
                <span className="dist-cap-badge" style={{ backgroundColor: s.color }}>
                  {s.type}
                </span>
              </div>
              <p className="micro">{s.desc}</p>
              {!placed.has(s.id) && (
                <button type="button" className="btn primary" onClick={() => placeSystem(s.id)}>
                  Place on triangle
                </button>
              )}
              {placed.has(s.id) && <span className="db-acid-ok micro">✓ placed</span>}
            </div>
          ))}
        </div>

        {allPlaced && !partitioned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <button type="button" className="btn primary" onClick={() => setPartitioned(true)}>
              Simulate network partition
            </button>
          </motion.div>
        )}

        {partitioned && (
          <motion.div
            className="dist-cap-partition-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro" style={{ color: '#ef4444' }}>Network partition active:</p>
            {SYSTEMS.map((s) => (
              <div key={s.id} className="dist-cap-partition-row">
                <span style={{ color: s.color }}>{s.name} ({s.type}):</span>
                <span className="micro">{s.partitionBehavior}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {partitioned && !done && (
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
        {!allPlaced && (
          <span className="hint">Place all 3 systems on the triangle ({placed.size}/3)</span>
        )}
        {allPlaced && !partitioned && (
          <span className="hint">Simulate a partition to see what each system does</span>
        )}
      </div>

      {partitioned && (
        <ConnectionCard
          title="Every distributed database sits on this triangle — the choice is made before you write a line of code"
          body={
            <>
              Instagram chose AP (Cassandra) for the feed — stale data is acceptable. Banks choose CP
              (PostgreSQL/MSSQL) — stale balance data is not acceptable. The choice is architectural and largely
              irreversible.
            </>
          }
          appearsIn={['database selection', 'system design interviews', 'microservices architecture']}
          hook="CAP describes tradeoffs in how data is stored. Load balancing describes tradeoffs in how traffic is directed. Next."
        />
      )}
    </div>
  )
}
