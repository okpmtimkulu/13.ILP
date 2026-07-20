import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
}

function insert(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null }
  if (value < root.value) return { ...root, left: insert(root.left, value) }
  if (value > root.value) return { ...root, right: insert(root.right, value) }
  return root
}

function height(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + Math.max(height(node.left), height(node.right))
}

function countNodes(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

function searchPath(root: TreeNode | null, target: number): number[] {
  const path: number[] = []
  let cur = root
  while (cur) {
    path.push(cur.value)
    if (target === cur.value) break
    cur = target < cur.value ? cur.left : cur.right
  }
  return path
}

interface NodeVizProps {
  node: TreeNode | null
  searchPath: number[]
  x: number
  y: number
  spread: number
}

function NodeViz({ node, searchPath, x, y, spread }: NodeVizProps) {
  if (!node) return null
  const inPath = searchPath.includes(node.value)
  const isTarget = searchPath.length > 0 && searchPath[searchPath.length - 1] === node.value

  const childY = y + 48
  const leftX = x - spread
  const rightX = x + spread

  return (
    <g>
      {node.left && (
        <line x1={x} y1={y} x2={leftX} y2={childY} stroke="var(--border)" strokeWidth="1.5" />
      )}
      {node.right && (
        <line x1={x} y1={y} x2={rightX} y2={childY} stroke="var(--border)" strokeWidth="1.5" />
      )}
      <motion.circle
        cx={x}
        cy={y}
        r="16"
        className={`dsa-tree-node ${isTarget ? 'is-found' : inPath ? 'is-path' : ''}`}
        animate={{
          fill: isTarget
            ? 'var(--success, #3ecf8e)'
            : inPath
            ? 'var(--signal)'
            : 'var(--surface-2)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      />
      <text x={x} y={y + 4} textAnchor="middle" className="dsa-tree-label" fontSize="10">
        {node.value}
      </text>
      <NodeViz node={node.left} searchPath={searchPath} x={leftX} y={childY} spread={spread * 0.55} />
      <NodeViz node={node.right} searchPath={searchPath} x={rightX} y={childY} spread={spread * 0.55} />
    </g>
  )
}

export function DsaTree({ onComplete }: { onComplete: () => void }) {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [inputVal, setInputVal] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [path, setPath] = useState<number[]>([])
  const [degenerate, setDegenerate] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  const doInsert = () => {
    const n = parseInt(inputVal, 10)
    if (isNaN(n) || n < 1 || n > 99) return
    setRoot((r) => insert(r, n))
    setInputVal('')
    setPath([])
  }

  const doSearch = () => {
    const n = parseInt(searchVal, 10)
    if (isNaN(n) || !root) return
    const p = searchPath(root, n)
    setPath(p)
    setSearchDone(true)
  }

  const insertSorted = () => {
    let r: TreeNode | null = null
    for (const v of [1, 2, 3, 4, 5]) r = insert(r, v)
    setRoot(r)
    setDegenerate(true)
    setPath([])
  }

  const reset = () => {
    setRoot(null)
    setPath([])
    setDegenerate(false)
    setSearchDone(false)
  }

  const nodeCount = countNodes(root)
  const treeHeight = height(root)
  const isDone = nodeCount >= 5 && searchDone

  const svgWidth = 300
  const svgHeight = 200

  return (
    <div className="lesson-panel">
      <p className="lede">
        A <strong>Binary Search Tree</strong> keeps elements sorted: left child &lt; parent &lt; right child.
        Search narrows the candidate half at every level — O(log n) if balanced.
      </p>

      <div className="dsa-tree-controls">
        <div className="dsa-tree-input-row">
          <input
            type="number"
            className="dsa-tree-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doInsert()}
            placeholder="1-99"
            min={1}
            max={99}
          />
          <button type="button" className="btn primary" onClick={doInsert} disabled={!inputVal}>
            Insert
          </button>
        </div>
        <div className="dsa-tree-input-row">
          <input
            type="number"
            className="dsa-tree-input"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="Search value"
          />
          <button type="button" className="btn" onClick={doSearch} disabled={!root || !searchVal}>
            Search
          </button>
        </div>
        <button type="button" className="btn" onClick={insertSorted}>
          Insert sorted (1-5) — degenerate case
        </button>
        <button type="button" className="btn" onClick={reset}>Reset</button>
      </div>

      <div className="dsa-tree-viz">
        <svg width={svgWidth} height={svgHeight} className="dsa-tree-svg">
          {root && (
            <NodeViz
              node={root}
              searchPath={path}
              x={svgWidth / 2}
              y={28}
              spread={80}
            />
          )}
          {!root && (
            <text x={svgWidth / 2} y={svgHeight / 2} textAnchor="middle" fill="var(--text-muted)" fontSize="12">
              Insert values to build the tree
            </text>
          )}
        </svg>
      </div>

      <div className="dsa-tree-stats micro">
        <span>Nodes: {nodeCount}</span>
        <span>Height: {treeHeight}</span>
        <span>{treeHeight > 0 && nodeCount > 0 ? `log₂(${nodeCount}) ≈ ${Math.log2(nodeCount).toFixed(1)}` : ''}</span>
      </div>

      <AnimatePresence>
        {degenerate && (
          <motion.div
            className="dsa-tree-warning"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Height {treeHeight} with {nodeCount} nodes = O(n). Inserting sorted data degenerates the BST into a
            linked list. This is why balanced variants (AVL, Red-Black) exist.
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectionCard
        title="Databases, file systems, and DNS all use balanced variants of this"
        body={
          <>
            PostgreSQL's B-tree index, the Linux kernel's ext4 directory entries, and DNS zone delegation all
            use tree structures that guarantee O(log n) operations by keeping the tree balanced. You just saw
            why that matters — sorted insertion breaks the unbalanced case.
          </>
        }
        appearsIn={['DsaAVL step (balanced trees)', 'databases chapter B-tree index', 'DsaDijkstra uses a heap tree']}
        hook="Trees are hierarchical. What about searching by key with O(1) average? Next: hash tables."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to hash tables
        </button>
        {!isDone && (
          <span className="hint">
            {nodeCount < 5 ? `Insert ${5 - nodeCount} more values. ` : ''}
            {!searchDone ? 'Search for a value. ' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
