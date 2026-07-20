import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface Task {
  id: string
  label: string
  start: number
  end: number
}

const TASKS: Task[] = [
  { id: 't1', label: 'A', start: 0, end: 3 },
  { id: 't2', label: 'B', start: 1, end: 5 },
  { id: 't3', label: 'C', start: 3, end: 6 },
  { id: 't4', label: 'D', start: 2, end: 4 },
  { id: 't5', label: 'E', start: 5, end: 8 },
  { id: 't6', label: 'F', start: 6, end: 9 },
  { id: 't7', label: 'G', start: 7, end: 10 },
  { id: 't8', label: 'H', start: 4, end: 7 },
]

const TOTAL_TIME = 11

function greedySelect(tasks: Task[]): Task[] {
  const sorted = [...tasks].sort((a, b) => a.end - b.end)
  const selected: Task[] = []
  let lastEnd = -Infinity
  for (const t of sorted) {
    if (t.start >= lastEnd) {
      selected.push(t)
      lastEnd = t.end
    }
  }
  return selected
}

function overlaps(t: Task, selected: Task[]): boolean {
  return selected.some((s) => s.id !== t.id && s.start < t.end && t.start < s.end)
}

interface KnapsackItem {
  id: number
  label: string
  weight: number
  value: number
}

const KNAPSACK_ITEMS: KnapsackItem[] = [
  { id: 1, label: 'Gold coin', weight: 2, value: 6 },
  { id: 2, label: 'Silver bar', weight: 3, value: 5 },
  { id: 3, label: 'Gem', weight: 5, value: 10 },
  { id: 4, label: 'Necklace', weight: 1, value: 3 },
  { id: 5, label: 'Scroll', weight: 4, value: 7 },
]

const CAPACITY = 10

function dpKnapsack(items: KnapsackItem[], W: number): number {
  const n = items.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w]
      if (items[i - 1].weight <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - items[i - 1].weight] + items[i - 1].value)
      }
    }
  }
  return dp[n][W]
}

export function DsaGreedy({ onComplete }: { onComplete: () => void }) {
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])
  const [greedyRun, setGreedyRun] = useState(false)
  const [greedyResult, setGreedyResult] = useState<Task[]>([])

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [greedyItemsDone, setGreedyItemsDone] = useState(false)

  const toggleTask = (t: Task) => {
    if (greedyRun) return
    setSelectedTasks((prev) => {
      const next = prev.filter((x) => x.id !== t.id)
      if (next.length === prev.length) {
        // Not yet selected — try to add
        const newSel = [...prev, t]
        if (!overlaps(t, prev)) return newSel
        return prev // conflict
      }
      return next
    })
  }

  const runGreedy = () => {
    const result = greedySelect(TASKS)
    setGreedyResult(result)
    setGreedyRun(true)
  }

  const toggleItem = (id: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedWeight = [...selectedItems].reduce((s, id) => {
    const item = KNAPSACK_ITEMS.find((i) => i.id === id)!
    return s + item.weight
  }, 0)

  const selectedValue = [...selectedItems].reduce((s, id) => {
    const item = KNAPSACK_ITEMS.find((i) => i.id === id)!
    return s + item.value
  }, 0)

  const optimalValue = dpKnapsack(KNAPSACK_ITEMS, CAPACITY)

  // Greedy by value/weight ratio
  const greedyItems = [...KNAPSACK_ITEMS]
    .sort((a, b) => b.value / b.weight - a.value / a.weight)
  let remaining = CAPACITY
  const greedySelected: number[] = []
  for (const item of greedyItems) {
    if (item.weight <= remaining) {
      greedySelected.push(item.id)
      remaining -= item.weight
    }
  }
  const greedyValue = greedySelected.reduce((s, id) => {
    return s + KNAPSACK_ITEMS.find((i) => i.id === id)!.value
  }, 0)

  const isDone = greedyRun && greedyItemsDone

  return (
    <div className="lesson-panel">
      <p className="lede">
        Greedy algorithms make the locally optimal choice at each step. Sometimes that yields the global optimum
        — sometimes it doesn't. Two problems show both cases.
      </p>

      {/* Activity selection */}
      <div className="dsa-greedy-problem">
        <h3 className="micro">Problem 1: Activity selection (greedy is optimal here)</h3>
        <p className="micro">Select non-overlapping tasks. Click tasks to select, then compare with greedy.</p>

        <div className="dsa-greedy-timeline">
          {Array.from({ length: TOTAL_TIME }, (_, i) => (
            <div key={i} className="dsa-greedy-tick" style={{ left: `${(i / TOTAL_TIME) * 100}%` }}>
              <span className="micro">{i}</span>
            </div>
          ))}
          {TASKS.map((t, row) => {
            const isUserSel = selectedTasks.some((x) => x.id === t.id)
            const isGreedy = greedyResult.some((x) => x.id === t.id)
            return (
              <motion.button
                key={t.id}
                type="button"
                className={`dsa-greedy-task ${isUserSel ? 'is-selected' : ''} ${isGreedy ? 'is-greedy' : ''}`}
                style={{
                  left: `${(t.start / TOTAL_TIME) * 100}%`,
                  width: `${((t.end - t.start) / TOTAL_TIME) * 100}%`,
                  top: `${(row % 3) * 36 + 8}px`,
                }}
                onClick={() => toggleTask(t)}
                animate={{ opacity: isUserSel || isGreedy ? 1 : 0.7 }}
              >
                {t.label}
              </motion.button>
            )
          })}
        </div>

        <div className="dsa-greedy-compare micro">
          <span>Your selection: {selectedTasks.length} tasks</span>
          {greedyRun && <span> · Greedy optimal: <strong>{greedyResult.length} tasks</strong> ({greedyResult.map((t) => t.label).join(', ')})</span>}
        </div>

        <button type="button" className="btn primary" onClick={runGreedy} disabled={greedyRun}>
          Run greedy (earliest-finish-time)
        </button>
      </div>

      {/* Knapsack */}
      <div className="dsa-greedy-problem">
        <h3 className="micro">Problem 2: 0/1 Knapsack (greedy is NOT always optimal)</h3>
        <p className="micro">Capacity = {CAPACITY}. Select items to maximise value.</p>

        <div className="dsa-greedy-items">
          {KNAPSACK_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className={`dsa-greedy-item ${selectedItems.has(item.id) ? 'is-selected' : ''} ${selectedWeight + item.weight > CAPACITY && !selectedItems.has(item.id) ? 'is-overweight' : ''}`}
              onClick={() => toggleItem(item.id)}
              animate={{ scale: selectedItems.has(item.id) ? 1.04 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <span>{item.label}</span>
              <span className="micro">W:{item.weight} V:{item.value} (ratio:{(item.value / item.weight).toFixed(1)})</span>
            </motion.button>
          ))}
        </div>

        <div className="dsa-greedy-knapsack-stats micro">
          <span>Weight: {selectedWeight}/{CAPACITY}</span>
          <span> · Your value: {selectedValue}</span>
          <span> · Greedy (by ratio) value: {greedyValue}</span>
          <span> · DP optimal: <strong>{optimalValue}</strong></span>
        </div>

        {selectedWeight > CAPACITY && (
          <p className="micro dsa-greedy-overweight">Over capacity! Remove some items.</p>
        )}

        <button type="button" className="btn" onClick={() => setGreedyItemsDone(true)} disabled={greedyItemsDone}>
          {greedyItemsDone ? 'Understood ✓' : 'I see why greedy fails here (DP finds optimal)'}
        </button>
      </div>

      <ConnectionCard
        title="Airlines schedule flights, operating systems schedule jobs, and network routers select paths — all using greedy"
        body={
          <>
            Activity selection, Huffman coding, and Dijkstra are all greedy algorithms that happen to produce
            optimal results. But TSP, 0/1 Knapsack, and Vertex Cover are cases where greedy fails — you need
            DP or exact algorithms. Knowing which is which is the hard part.
          </>
        }
        appearsIn={['DsaDijkstra step (greedy on graphs)', 'DsaDpClassic step (knapsack with DP)', 'DsaComplexity NP-complete problems']}
        hook="Greedy + DP is the toolkit for optimization. Next: Dijkstra's shortest path — greedy on a weighted graph with a heap."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to Dijkstra
        </button>
        {!isDone && (
          <span className="hint">
            {!greedyRun ? 'Run the greedy activity selector. ' : ''}
            {!greedyItemsDone ? 'Acknowledge the knapsack result. ' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
