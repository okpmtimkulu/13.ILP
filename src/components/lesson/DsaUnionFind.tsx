import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const N = 8

interface UFState {
  parent: number[]
  rank: number[]
}

function makeUF(): UFState {
  return {
    parent: Array.from({ length: N }, (_, i) => i),
    rank: new Array(N).fill(0),
  }
}

function find(uf: UFState, x: number): { root: number; path: number[] } {
  const path: number[] = [x]
  let cur = x
  while (uf.parent[cur] !== cur) {
    cur = uf.parent[cur]
    path.push(cur)
  }
  return { root: cur, path }
}

function union(uf: UFState, x: number, y: number): UFState {
  const { root: rx } = find(uf, x)
  const { root: ry } = find(uf, y)
  if (rx === ry) return uf

  const newParent = [...uf.parent]
  const newRank = [...uf.rank]

  if (newRank[rx] < newRank[ry]) {
    newParent[rx] = ry
  } else if (newRank[rx] > newRank[ry]) {
    newParent[ry] = rx
  } else {
    newParent[ry] = rx
    newRank[rx]++
  }

  return { parent: newParent, rank: newRank }
}

function pathCompress(uf: UFState, x: number): UFState {
  const { root, path } = find(uf, x)
  const newParent = [...uf.parent]
  for (const node of path) newParent[node] = root
  return { ...uf, parent: newParent }
}

const NODE_POS: [number, number][] = [
  [50, 50], [150, 50], [250, 50], [350, 50],
  [50, 160], [150, 160], [250, 160], [350, 160],
]

export function DsaUnionFind({ onComplete }: { onComplete: () => void }) {
  const [uf, setUF] = useState<UFState>(makeUF)
  const [nodeA, setNodeA] = useState<number | null>(null)
  const [nodeB, setNodeB] = useState<number | null>(null)
  const [unionCount, setUnionCount] = useState(0)
  const [pathCompressSeen, setPathCompressSeen] = useState(false)
  const [findHighlight, setFindHighlight] = useState<number[]>([])
  const [findQuery, setFindQuery] = useState<number | null>(null)
  const [findResult, setFindResult] = useState<string>('')

  const doUnion = () => {
    if (nodeA === null || nodeB === null) return
    setUF((prev) => union(prev, nodeA, nodeB))
    setUnionCount((c) => c + 1)
    setNodeA(null)
    setNodeB(null)
    setFindHighlight([])
    setFindResult('')
  }

  const doFind = (n: number) => {
    setFindQuery(n)
    const { root, path } = find(uf, n)
    setFindHighlight(path)
    setFindResult(`Node ${n} → root ${root}`)

    if (path.length > 1) {
      setUF((prev) => pathCompress(prev, n))
      setPathCompressSeen(true)
    }
  }

  const doConnected = () => {
    if (nodeA === null || nodeB === null) return
    const { root: ra } = find(uf, nodeA)
    const { root: rb } = find(uf, nodeB)
    setFindResult(ra === rb ? `✓ ${nodeA} and ${nodeB} are connected (same root: ${ra})` : `✗ ${nodeA} and ${nodeB} are not connected`)
    setFindHighlight([])
  }

  const reset = () => {
    setUF(makeUF())
    setNodeA(null)
    setNodeB(null)
    setUnionCount(0)
    setFindHighlight([])
    setFindResult('')
    setFindQuery(null)
  }

  const isDone = unionCount >= 4 && pathCompressSeen

  const toggleSelect = (n: number) => {
    if (nodeA === n) { setNodeA(null); return }
    if (nodeB === n) { setNodeB(null); return }
    if (nodeA === null) setNodeA(n)
    else if (nodeB === null) setNodeB(n)
    else { setNodeA(n); setNodeB(null) }
  }

  // Determine component colors
  const roots = new Set(Array.from({ length: N }, (_, i) => find(uf, i).root))
  const rootList = [...roots]
  const colors = ['#6366f1', '#3ecf8e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  const rootColor = (n: number) => {
    const { root } = find(uf, n)
    const idx = rootList.indexOf(root)
    return colors[idx % colors.length]
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Union-Find</strong> tracks which nodes are in the same connected component. Union by rank and path
        compression make both operations nearly O(1) amortized.
      </p>

      <div className="dsa-uf-viz">
        <svg width={400} height={220} className="dsa-uf-svg">
          {NODE_POS.map(([x, y], i) => {
            const p = uf.parent[i]
            const isRoot = p === i
            const [px, py] = NODE_POS[p]
            const isSelected = i === nodeA || i === nodeB
            const isInPath = findHighlight.includes(i)

            return (
              <g key={i}>
                {!isRoot && (
                  <line
                    x1={x} y1={y} x2={px} y2={py}
                    stroke="var(--border)" strokeWidth="1.5"
                    strokeDasharray={isInPath ? '4 2' : undefined}
                  />
                )}
                <motion.circle
                  cx={x} cy={y} r={18}
                  onClick={() => toggleSelect(i)}
                  style={{ cursor: 'pointer' }}
                  animate={{
                    fill: isInPath
                      ? 'var(--signal)'
                      : isSelected
                      ? 'var(--warn, #f59e0b)'
                      : rootColor(i),
                    scale: isSelected ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="#fff" style={{ pointerEvents: 'none' }}>
                  {i}
                </text>
                {isRoot && (
                  <text x={x} y={y - 24} textAnchor="middle" fontSize="8" fill="var(--text-muted)">
                    root
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="dsa-uf-controls">
        <p className="micro">
          Selected: {nodeA !== null ? nodeA : '—'} and {nodeB !== null ? nodeB : '—'}
        </p>
        <div className="dsa-uf-btn-row">
          <button type="button" className="btn primary" onClick={doUnion} disabled={nodeA === null || nodeB === null}>
            Union ({nodeA ?? '?'}, {nodeB ?? '?'})
          </button>
          <button type="button" className="btn" onClick={doConnected} disabled={nodeA === null || nodeB === null}>
            Are {nodeA ?? '?'} and {nodeB ?? '?'} connected?
          </button>
        </div>
        <div className="dsa-uf-find-row">
          <span className="micro">Click node on canvas then Find:</span>
          {Array.from({ length: N }, (_, i) => (
            <button key={i} type="button" className="btn" onClick={() => doFind(i)} style={{ padding: '2px 8px' }}>
              Find {i}
            </button>
          ))}
        </div>
        <button type="button" className="btn" onClick={reset}>Reset</button>
      </div>

      <AnimatePresence>
        {findResult && (
          <motion.div
            className="dsa-uf-result micro"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {findResult}
            {pathCompressSeen && ' (path compressed — nodes now point directly to root)'}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="micro" role="status">
        Unions: {unionCount}/4. Path compression seen: {pathCompressSeen ? 'yes ✓' : 'no (Find a node with intermediate parents)'}
      </p>

      <ConnectionCard
        title="Kruskal's minimum spanning tree algorithm uses Union-Find for cycle detection"
        body={
          <>
            Kruskal processes edges in order of weight, adding each if it does not create a cycle. "Does this
            edge create a cycle?" is answered in nearly O(1) with Union-Find: if both endpoints have the same
            root, adding the edge would close a cycle. Road network planning and electrical grid design use this.
          </>
        }
        appearsIn={["Kruskal's MST", 'network topology planning', 'image segmentation algorithms']}
        hook="You can query connectivity instantly. What about making locally optimal choices to reach a global optimum? Next: greedy algorithms."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to greedy algorithms
        </button>
        {!isDone && (
          <span className="hint">
            {unionCount < 4 ? `Perform ${4 - unionCount} more union operations. ` : ''}
            {!pathCompressSeen ? 'Trigger path compression by calling Find on a non-root node with depth > 1. ' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
