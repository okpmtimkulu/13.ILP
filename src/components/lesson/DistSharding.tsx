import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type ShardKey = 'id-mod' | 'name-letter' | 'hash'

const NUM_SHARDS = 4

function getShardByIdMod(id: number): number {
  return id % NUM_SHARDS
}

function getShardByNameLetter(name: string): number {
  const c = name[0].toLowerCase()
  if (c <= 'f') return 0
  if (c <= 'l') return 1
  if (c <= 'r') return 2
  return 3
}

function getShardByHash(id: number): number {
  // Simple hash distribution
  return (id * 2654435761) % NUM_SHARDS
}

const SAMPLE_USERS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
  { id: 4, name: 'Dan' },
  { id: 5, name: 'Zara' },
  { id: 6, name: 'Frank' },
  { id: 7, name: 'Grace' },
  { id: 8, name: 'Heidi' },
]

export function DistSharding({ onComplete }: { onComplete: () => void }) {
  const [shardKey, setShardKey] = useState<ShardKey>('id-mod')
  const [queryFilter, setQueryFilter] = useState('')
  const [queryRan, setQueryRan] = useState(false)
  const [rebalancing, setRebalancing] = useState(false)
  const [rebalanced, setRebalanced] = useState(false)
  const [hotShardShown, setHotShardShown] = useState(false)
  const [done, setDone] = useState(false)

  const getShard = (user: typeof SAMPLE_USERS[0]): number => {
    if (shardKey === 'id-mod') return getShardByIdMod(user.id)
    if (shardKey === 'name-letter') return getShardByNameLetter(user.name)
    return getShardByHash(user.id)
  }

  const shards: Array<Array<(typeof SAMPLE_USERS)[number]>> = [[], [], [], []]
  for (const u of SAMPLE_USERS) {
    shards[getShard(u)].push(u)
  }

  // Hot shard: for name-letter, Z users go to shard 3
  const shard3 = shards[3]
  const isHotShard = shardKey === 'name-letter' && shard3.length > 2

  // Query routing
  const filteredById = queryFilter !== '' && !isNaN(Number(queryFilter))
  const filterShard = filteredById ? getShardByIdMod(Number(queryFilter)) : null

  const runQuery = () => {
    setQueryRan(true)
  }

  const doRebalance = () => {
    setRebalancing(true)
    setTimeout(() => {
      setRebalancing(false)
      setRebalanced(true)
      setShardKey('hash')
    }, 1200)
  }

  const canComplete = queryRan && (hotShardShown || rebalanced)

  return (
    <div className="lesson-panel">
      <p className="lede">
        Sharding splits a large dataset across multiple database nodes. The shard key determines which node stores
        which rows — and which node must handle each query.
      </p>

      <div className="dist-shard-stage">
        <div className="dist-shard-key-select">
          <span className="micro">Shard key:</span>
          {(['id-mod', 'name-letter', 'hash'] as ShardKey[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`db-acid-tab ${shardKey === k ? 'db-acid-tab--active' : ''}`}
              onClick={() => { setShardKey(k); setQueryRan(false); setHotShardShown(k === 'name-letter') }}
            >
              {k === 'id-mod' ? 'id % 4' : k === 'name-letter' ? 'first letter of name' : 'hash(id) % 4'}
            </button>
          ))}
        </div>

        <div className="dist-shard-nodes">
          {shards.map((shardRows, i) => (
            <motion.div
              key={i}
              className={`dist-shard-node ${isHotShard && i === 3 ? 'dist-shard-node--hot' : ''}`}
              animate={{ borderColor: isHotShard && i === 3 ? '#ef4444' : '#334155' }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <span className="dist-rep-node-id">
                Shard {i}
                {filterShard === i && queryRan && <span className="db-acid-ok"> ← query</span>}
              </span>
              {isHotShard && i === 3 && <span className="micro" style={{ color: '#ef4444' }}>HOT SHARD</span>}
              <div className="dist-shard-rows">
                {shardRows.map((u) => (
                  <motion.div
                    key={u.id}
                    className="dist-shard-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    #{u.id} {u.name}
                  </motion.div>
                ))}
              </div>
              <span className="micro">{shardRows.length} rows</span>
            </motion.div>
          ))}
        </div>

        <div className="dist-shard-query">
          <input
            className="db-query-input"
            value={queryFilter}
            onChange={(e) => { setQueryFilter(e.target.value); setQueryRan(false) }}
            placeholder="Filter by id (e.g. 3)"
          />
          <button type="button" className="btn primary" onClick={runQuery} disabled={!queryFilter}>
            Run query
          </button>
          {queryRan && filterShard !== null && (
            <motion.p
              className="micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              Routes to Shard {filterShard} only (1 shard read).
            </motion.p>
          )}
          {queryRan && !filteredById && (
            <motion.p
              className="micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              No shard key in filter → scatter-gather: reads all {NUM_SHARDS} shards.
            </motion.p>
          )}
        </div>

        {isHotShard && !rebalanced && (
          <motion.div
            className="dist-shard-hot-warn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro" style={{ color: '#ef4444' }}>
              Hot shard: users with names starting Z-Z all route to Shard 3. It handles more load than others.
            </p>
            <button type="button" className="btn primary" onClick={doRebalance} disabled={rebalancing}>
              {rebalancing ? 'Rebalancing (migrating data)...' : 'Fix: switch to hash-based sharding'}
            </button>
          </motion.div>
        )}

        {rebalanced && (
          <motion.p
            className="db-acid-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Hash-based sharding distributes evenly. Each shard has ~2 rows.
          </motion.p>
        )}
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
            {!queryRan ? 'Run a query to see scatter-gather vs direct routing' : 'Show the hot shard problem and fix it'}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="Instagram shards by user_id, Twitter by tweet_id — the choice is irreversible"
          body={
            <>
              Resharding a production database while it is serving traffic is one of the most difficult operations in
              distributed systems. Choosing the wrong shard key is nearly impossible to fix later. Choose based on your
              most common query pattern — before you have the traffic that makes it painful.
            </>
          }
          appearsIn={['Instagram database architecture', 'Twitter timelines', 'Vitess/MySQL sharding']}
          hook="Sharding splits data. Message queues decouple the services that produce and consume it. Next."
        />
      )}
    </div>
  )
}
