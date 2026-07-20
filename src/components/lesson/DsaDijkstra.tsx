import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const CITIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
type City = (typeof CITIES)[number]

const EDGES: [City, City, number][] = [
  ['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5],
  ['C', 'D', 8], ['C', 'E', 10], ['D', 'F', 2], ['E', 'F', 3],
  ['E', 'G', 7], ['F', 'G', 6],
]

const ADJ: Record<City, [City, number][]> = {
  A: [], B: [], C: [], D: [], E: [], F: [], G: [],
}
for (const [u, v, w] of EDGES) {
  ADJ[u].push([v, w])
  ADJ[v].push([u, w])
}

const POS: Record<City, [number, number]> = {
  A: [50, 140], B: [140, 60], C: [140, 220], D: [240, 60],
  E: [240, 220], F: [320, 120], G: [390, 180],
}

type DijkstraState = {
  dist: Record<City, number>
  prev: Record<City, City | null>
  visited: Set<City>
  queue: [City, number][]
  current: City | null
  done: boolean
}

function initDijkstra(): DijkstraState {
  const INF = Infinity
  const dist: Record<City, number> = { A: 0, B: INF, C: INF, D: INF, E: INF, F: INF, G: INF }
  const prev: Record<City, City | null> = { A: null, B: null, C: null, D: null, E: null, F: null, G: null }
  return { dist, prev, visited: new Set(), queue: [['A', 0]], current: null, done: false }
}

function stepDijkstra(state: DijkstraState): DijkstraState {
  if (state.done || state.queue.length === 0) return { ...state, done: true }

  // Extract min
  const sorted = [...state.queue].sort((a, b) => a[1] - b[1])
  const [cur, curDist] = sorted[0]
  const newQueue = sorted.slice(1)

  if (state.visited.has(cur)) return { ...state, queue: newQueue }

  const newVisited = new Set(state.visited)
  newVisited.add(cur)

  const newDist = { ...state.dist }
  const newPrev = { ...state.prev }
  const additions: [City, number][] = []

  for (const [nb, w] of ADJ[cur]) {
    if (!newVisited.has(nb)) {
      const alt = curDist + w
      if (alt < newDist[nb]) {
        newDist[nb] = alt
        newPrev[nb] = cur
        additions.push([nb, alt])
      }
    }
  }

  const finalQueue = [...newQueue, ...additions]
  const done = newVisited.size === CITIES.length || finalQueue.length === 0

  return { dist: newDist, prev: newPrev, visited: newVisited, queue: finalQueue, current: cur, done }
}

function getPath(prev: Record<City, City | null>, dest: City): City[] {
  const path: City[] = []
  let cur: City | null = dest
  while (cur !== null) {
    path.unshift(cur)
    cur = prev[cur]
  }
  return path
}

export function DsaDijkstra({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<DijkstraState>(initDijkstra)
  const [selectedDest, setSelectedDest] = useState<City | null>(null)
  const [stepCount, setStepCount] = useState(0)

  const step = () => {
    setState((s) => stepDijkstra(s))
    setStepCount((c) => c + 1)
  }

  const runAll = () => {
    let s = state
    while (!s.done) s = stepDijkstra(s)
    setState(s)
    setStepCount(CITIES.length)
  }

  const reset = () => {
    setState(initDijkstra())
    setStepCount(0)
    setSelectedDest(null)
  }

  const path = selectedDest && state.done ? getPath(state.prev, selectedDest) : []
  const pathEdges = new Set(path.slice(0, -1).map((c, i) => `${c}-${path[i + 1]}`))

  const edgeInPath = (u: City, v: City) =>
    pathEdges.has(`${u}-${v}`) || pathEdges.has(`${v}-${u}`)

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Dijkstra's algorithm</strong> finds shortest paths in a weighted graph. It always processes the
        nearest unvisited node — a greedy choice that works because edge weights are non-negative.
      </p>

      <div className="dsa-dijk-layout">
        <div className="dsa-dijk-graph-col">
          <svg width={440} height={270} className="dsa-dijk-svg">
            {EDGES.map(([u, v, w]) => {
              const [ux, uy] = POS[u]
              const [vx, vy] = POS[v]
              const inPath = edgeInPath(u, v)
              return (
                <g key={`${u}-${v}`}>
                  <line
                    x1={ux} y1={uy} x2={vx} y2={vy}
                    stroke={inPath ? 'var(--signal)' : 'var(--border)'}
                    strokeWidth={inPath ? 2.5 : 1.5}
                  />
                  <text
                    x={(ux + vx) / 2}
                    y={(uy + vy) / 2 - 4}
                    fontSize="9"
                    fill="var(--text-muted)"
                    textAnchor="middle"
                  >
                    {w}
                  </text>
                </g>
              )
            })}
            {CITIES.map((c) => {
              const [x, y] = POS[c]
              const isVisited = state.visited.has(c)
              const isCurrent = state.current === c
              const inPath = path.includes(c)

              return (
                <g key={c} onClick={() => state.done && setSelectedDest(c)} style={{ cursor: state.done ? 'pointer' : 'default' }}>
                  <motion.circle
                    cx={x} cy={y} r={20}
                    animate={{
                      fill: isCurrent
                        ? 'var(--signal)'
                        : inPath && state.done
                        ? 'var(--success, #3ecf8e)'
                        : isVisited
                        ? 'var(--surface-3, #2a2a3a)'
                        : 'var(--surface-2)',
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="var(--text)">{c}</text>
                  {state.dist[c] !== Infinity && (
                    <text x={x} y={y - 26} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                      {state.dist[c]}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        <div className="dsa-dijk-table-col">
          <span className="micro">Distance table:</span>
          <table className="dsa-dijk-table">
            <thead>
              <tr><th>City</th><th>Dist</th><th>Via</th></tr>
            </thead>
            <tbody>
              {CITIES.map((c) => (
                <tr key={c} className={state.visited.has(c) ? 'is-visited' : ''}>
                  <td>{c}</td>
                  <td>{state.dist[c] === Infinity ? '∞' : state.dist[c]}</td>
                  <td>{state.prev[c] ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="dsa-dijk-queue">
            <span className="micro">Priority queue: [{state.queue.map(([c, d]) => `${c}:${d}`).join(', ')}]</span>
          </div>

          {state.done && (
            <p className="micro">Click a city on the graph to show shortest path from A.</p>
          )}
          {path.length > 0 && (
            <p className="micro">
              Path A → {selectedDest}: <strong>{path.join(' → ')}</strong> (dist: {state.dist[selectedDest!]})
            </p>
          )}
        </div>
      </div>

      <div className="dsa-dijk-controls">
        <button type="button" className="btn" onClick={step} disabled={state.done}>
          Process next node
        </button>
        <button type="button" className="btn primary" onClick={runAll} disabled={state.done}>
          Run to completion
        </button>
        <button type="button" className="btn" onClick={reset}>Reset</button>
      </div>

      <ConnectionCard
        title="Google Maps runs a variant of Dijkstra (A*) on a graph with millions of nodes every second"
        body={
          <>
            A* adds a heuristic (straight-line distance to goal) to Dijkstra to skip exploring irrelevant
            nodes. With a good heuristic, A* explores far fewer nodes than vanilla Dijkstra. The underlying
            algorithm — priority queue + edge relaxation — is identical. You just ran it.
          </>
        }
        appearsIn={['navigation apps', 'network routing protocols (OSPF)', 'DsaHeap priority queue used here']}
        hook="Shortest paths on explicit graphs. What about problems where the graph of subproblems is implicit? Next: dynamic programming."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!state.done}>
          Continue to dynamic programming
        </button>
        {!state.done && (
          <span className="hint">Run Dijkstra to completion to continue.</span>
        )}
      </div>
    </div>
  )
}
