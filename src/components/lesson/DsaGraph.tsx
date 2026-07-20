import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const NODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
type NodeId = (typeof NODES)[number]

const EDGES: [NodeId, NodeId][] = [
  ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'],
  ['C', 'F'], ['D', 'G'], ['E', 'G'], ['F', 'G'], ['C', 'E'],
]

const ADJ: Record<NodeId, NodeId[]> = {
  A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F', 'E'],
  D: ['B', 'G'], E: ['B', 'C', 'G'], F: ['C', 'G'], G: ['D', 'E', 'F'],
}

// Pre-computed positions
const POS: Record<NodeId, [number, number]> = {
  A: [150, 30], B: [70, 90], C: [230, 90],
  D: [30, 160], E: [140, 155], F: [270, 160],
  G: [150, 225],
}

function bfsOrder(start: NodeId): NodeId[] {
  const visited: NodeId[] = []
  const queue: NodeId[] = [start]
  const seen = new Set<NodeId>([start])
  while (queue.length) {
    const cur = queue.shift()!
    visited.push(cur)
    for (const nb of ADJ[cur]) {
      if (!seen.has(nb)) {
        seen.add(nb)
        queue.push(nb)
      }
    }
  }
  return visited
}

function dfsOrder(start: NodeId): NodeId[] {
  const visited: NodeId[] = []
  const seen = new Set<NodeId>()
  function dfs(n: NodeId) {
    if (seen.has(n)) return
    seen.add(n)
    visited.push(n)
    for (const nb of ADJ[n]) dfs(nb)
  }
  dfs(start)
  return visited
}

type AlgoMode = 'none' | 'bfs' | 'dfs'

export function DsaGraph({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<AlgoMode>('none')
  const [visitOrder, setVisitOrder] = useState<NodeId[]>([])
  const [visitStep, setVisitStep] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [bfsDone, setBfsDone] = useState(false)
  const [dfsDone, setDfsDone] = useState(false)

  const runAlgo = (algo: AlgoMode) => {
    if (animating) return
    const order = algo === 'bfs' ? bfsOrder('A') : dfsOrder('A')
    setMode(algo)
    setVisitOrder(order)
    setVisitStep(0)
    setAnimating(true)

    let step = 0
    const tick = () => {
      if (step < order.length) {
        setVisitStep(step + 1)
        step++
        window.setTimeout(tick, 500)
      } else {
        setAnimating(false)
        if (algo === 'bfs') setBfsDone(true)
        else setDfsDone(true)
      }
    }
    window.setTimeout(tick, 300)
  }

  const visitedSet = new Set(visitOrder.slice(0, visitStep))
  const isDone = bfsDone && dfsDone

  return (
    <div className="lesson-panel">
      <p className="lede">
        Graphs connect nodes with edges. <strong>BFS</strong> explores level by level — shortest first.{' '}
        <strong>DFS</strong> dives deep along one path before backtracking.
      </p>

      <div className="dsa-graph-controls">
        <button type="button" className="btn primary" onClick={() => runAlgo('bfs')} disabled={animating}>
          Run BFS from A
        </button>
        <button type="button" className="btn primary" onClick={() => runAlgo('dfs')} disabled={animating}>
          Run DFS from A
        </button>
      </div>

      <div className="dsa-graph-viz">
        <svg width={300} height={260} className="dsa-graph-svg">
          {EDGES.map(([a, b]) => {
            const [ax, ay] = POS[a]
            const [bx, by] = POS[b]
            return (
              <line
                key={`${a}-${b}`}
                x1={ax} y1={ay} x2={bx} y2={by}
                className="dsa-graph-edge"
              />
            )
          })}
          {NODES.map((n) => {
            const [x, y] = POS[n]
            const isVisited = visitedSet.has(n)
            const visitIdx = visitOrder.indexOf(n)
            const isCurrent = visitStep > 0 && visitOrder[visitStep - 1] === n

            return (
              <g key={n}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={18}
                  className="dsa-graph-node"
                  animate={{
                    fill: isCurrent
                      ? 'var(--signal)'
                      : isVisited && mode === 'bfs'
                      ? 'var(--success, #3ecf8e)'
                      : isVisited && mode === 'dfs'
                      ? '#f59e0b'
                      : 'var(--surface-2)',
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                  className="dsa-graph-label" fontSize="11">
                  {n}
                </text>
                {isVisited && (
                  <text x={x + 14} y={y - 10} fontSize="8" fill="var(--text-muted)">
                    {visitIdx + 1}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {visitOrder.length > 0 && (
        <div className="dsa-graph-order micro">
          <strong>{mode === 'bfs' ? 'BFS' : 'DFS'} visit order: </strong>
          {visitOrder.slice(0, visitStep).join(' → ')}
        </div>
      )}

      <div className="dsa-graph-status micro" role="status">
        {bfsDone && !dfsDone && 'BFS done. Now run DFS to compare.'}
        {!bfsDone && dfsDone && 'DFS done. Now run BFS to compare.'}
        {bfsDone && dfsDone && 'Both algorithms complete. Notice how they explore different paths first.'}
      </div>

      <ConnectionCard
        title="Maps use BFS for shortest routes. Compilers use DFS for dependency resolution"
        body={
          <>
            Google Maps finds the shortest route with BFS (or Dijkstra, which is BFS with weighted edges).
            The Node.js module resolver uses DFS to walk the dependency tree. Social networks use BFS to find
            friends-of-friends within N degrees of connection.
          </>
        }
        appearsIn={['DsaDijkstra step (weighted BFS)', 'compilers chapter dependency analysis', 'databases chapter query planning']}
        hook="You can traverse. What about efficiently finding the smallest or largest element repeatedly? Next: heaps."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to heaps
        </button>
        {!isDone && (
          <span className="hint">Run both BFS and DFS to continue.</span>
        )}
      </div>
    </div>
  )
}
