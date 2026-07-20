import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Tab = 'document' | 'graph' | 'kv'

type GraphNode = { id: string; x: number; y: number }
type GraphEdge = { from: string; to: string }

const GRAPH_NODES: GraphNode[] = [
  { id: 'Alice', x: 50, y: 50 },
  { id: 'Bob', x: 80, y: 20 },
  { id: 'Carol', x: 80, y: 80 },
  { id: 'Dan', x: 120, y: 30 },
  { id: 'Eve', x: 120, y: 70 },
]

const GRAPH_EDGES: GraphEdge[] = [
  { from: 'Alice', to: 'Bob' },
  { from: 'Alice', to: 'Carol' },
  { from: 'Bob', to: 'Dan' },
  { from: 'Carol', to: 'Eve' },
  { from: 'Dan', to: 'Eve' },
]

function getNode(id: string): GraphNode {
  return GRAPH_NODES.find((n) => n.id === id)!
}

const FRIENDS_OF_FRIENDS = ['Dan', 'Eve']

export function DbNosql({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = useState<Tab>('document')
  const [docField, setDocField] = useState('')
  const [docAdded, setDocAdded] = useState(false)
  const [graphQuery, setGraphQuery] = useState(false)
  const [kvSet, setKvSet] = useState(false)
  const [kvGet, setKvGet] = useState(false)
  const [seen, setSeen] = useState<Set<Tab>>(new Set(['document']))
  const [done, setDone] = useState(false)

  const switchTab = (t: Tab) => {
    setTab(t)
    setSeen((prev) => new Set([...prev, t]))
  }

  const allSeen = seen.size === 3

  return (
    <div className="lesson-panel">
      <p className="lede">
        Not all data fits neatly in tables. Document stores, graph databases, and key-value stores each win in different
        situations.
      </p>

      <div className="db-nosql-tabs">
        {(['document', 'graph', 'kv'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`db-nosql-tab ${tab === t ? 'db-nosql-tab--active' : ''} ${seen.has(t) ? 'db-nosql-tab--seen' : ''}`}
            onClick={() => switchTab(t)}
          >
            {t === 'document' ? 'Document Store' : t === 'graph' ? 'Graph Database' : 'Key-Value Store'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'document' && (
          <motion.div
            key="document"
            className="db-nosql-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Each document can have different fields — no schema migration needed</p>
            <div className="db-nosql-docs">
              <div className="db-nosql-doc">
                <span className="db-nosql-doc-id">laptop_001</span>
                <pre>{JSON.stringify({ name: 'ThinkPad X1', processor: 'i7-1270P', ram_gb: 32, ...(docAdded ? { battery_hours: 12 } : {}) }, null, 2)}</pre>
              </div>
              <div className="db-nosql-doc">
                <span className="db-nosql-doc-id">phone_001</span>
                <pre>{JSON.stringify({ name: 'Pixel 9', battery_life: '24h', os: 'Android 15' }, null, 2)}</pre>
              </div>
            </div>
            <div className="db-nosql-add-field">
              <input
                className="db-query-input"
                placeholder='Add field (e.g., "battery_hours")'
                value={docField}
                onChange={(e) => setDocField(e.target.value)}
              />
              <button
                type="button"
                className="btn primary"
                disabled={!docField}
                onClick={() => {
                  setDocAdded(true)
                  setDocField('')
                }}
              >
                Add to laptop_001
              </button>
            </div>
            {docAdded && (
              <div className="db-nosql-compare">
                <span className="db-nosql-compare-nosql">MongoDB: field added instantly, no migration</span>
                <span className="db-nosql-compare-sql">SQL: ALTER TABLE — locks table, copies all rows, 30 min on 10M rows</span>
              </div>
            )}
          </motion.div>
        )}

        {tab === 'graph' && (
          <motion.div
            key="graph"
            className="db-nosql-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Social network: 5 nodes, friendship edges. "Friends of friends of Alice" = 2 hops.</p>
            <svg className="db-nosql-graph" viewBox="0 0 170 100">
              {GRAPH_EDGES.map((e) => {
                const a = getNode(e.from)
                const b = getNode(e.to)
                const isAliceFriend = e.from === 'Alice' || e.to === 'Alice'
                const isFoF =
                  graphQuery &&
                  (FRIENDS_OF_FRIENDS.includes(e.from) || FRIENDS_OF_FRIENDS.includes(e.to))
                return (
                  <motion.line
                    key={`${e.from}-${e.to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isFoF ? '#38bdf8' : isAliceFriend ? '#fbbf24' : '#475569'}
                    strokeWidth={isFoF ? 2 : 1.5}
                    animate={{ opacity: 1 }}
                  />
                )
              })}
              {GRAPH_NODES.map((node) => {
                const isFoF = graphQuery && FRIENDS_OF_FRIENDS.includes(node.id)
                const isAlice = node.id === 'Alice'
                return (
                  <g key={node.id}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={8}
                      fill={isFoF ? '#38bdf8' : isAlice ? '#fbbf24' : '#334155'}
                      stroke={isFoF ? '#0ea5e9' : '#64748b'}
                      strokeWidth={1.5}
                      animate={{ r: isFoF ? 10 : 8 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    />
                    <text x={node.x} y={node.y + 18} textAnchor="middle" fontSize="7" fill="#94a3b8">
                      {node.id}
                    </text>
                  </g>
                )
              })}
            </svg>
            <button type="button" className="btn primary" onClick={() => setGraphQuery(true)} disabled={graphQuery}>
              Friends of friends of Alice
            </button>
            {graphQuery && (
              <div className="db-nosql-compare">
                <span className="db-nosql-compare-nosql">Neo4j: 2-hop traversal, pointer chasing — O(k²) where k=avg degree</span>
                <span className="db-nosql-compare-sql">SQL: 2 JOINs on indexed user_id — similar cost but harder to express</span>
              </div>
            )}
          </motion.div>
        )}

        {tab === 'kv' && (
          <motion.div
            key="kv"
            className="db-nosql-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Key-value store: O(1) hash lookup. Perfect for sessions, caches, rate limiting.</p>
            <div className="db-nosql-kv">
              <div className="db-nosql-kv-op">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setKvSet(true)}
                  disabled={kvSet}
                >
                  SET session:abc123
                </button>
                {kvSet && (
                  <motion.pre
                    className="db-nosql-kv-val"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    {JSON.stringify({ user_id: 42, role: 'user', cart: [101, 207] }, null, 2)}
                    {'\n'}TTL: 86400s (24h)
                  </motion.pre>
                )}
              </div>
              {kvSet && (
                <div className="db-nosql-kv-op">
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => setKvGet(true)}
                    disabled={kvGet}
                  >
                    GET session:abc123
                  </button>
                  {kvGet && (
                    <motion.div
                      className="db-nosql-kv-result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    >
                      <span className="db-acid-ok">HIT — 0.1ms (O(1) hash lookup)</span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            {kvGet && (
              <div className="db-nosql-compare">
                <span className="db-nosql-compare-nosql">Redis: sub-millisecond, no query parsing, no disk I/O</span>
                <span className="db-nosql-compare-sql">SQL: parse query, plan, scan index, disk I/O — 5-20ms minimum</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lesson-actions">
        {allSeen && !done && (
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
        {!allSeen && (
          <span className="hint">Explore all 3 models to continue ({seen.size}/3 seen)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="MongoDB, Neo4j, and Redis solve the same problem PostgreSQL does"
          body={
            <>
              They all store data — but for different shapes of it. Choosing the wrong database for your data shape means
              fighting the tool every day. The right choice depends on whether your data is tabular, document-like,
              highly connected, or needs sub-millisecond access.
            </>
          }
          appearsIn={['application architecture', 'data modeling', 'polyglot persistence']}
          hook="Databases are reliable because of transactions and ACID. Security is reliable for a different reason: math."
        />
      )}
    </div>
  )
}
