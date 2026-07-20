import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  height: number
}

function nodeHeight(n: TreeNode | null): number {
  return n ? n.height : 0
}

function updateHeight(n: TreeNode): TreeNode {
  return { ...n, height: 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right)) }
}

function balanceFactor(n: TreeNode): number {
  return nodeHeight(n.left) - nodeHeight(n.right)
}

function rotateRight(y: TreeNode): TreeNode {
  const x = y.left!
  const T2 = x.right
  const newY = updateHeight({ ...y, left: T2 })
  return updateHeight({ ...x, right: newY })
}

function rotateLeft(x: TreeNode): TreeNode {
  const y = x.right!
  const T2 = y.left
  const newX = updateHeight({ ...x, right: T2 })
  return updateHeight({ ...y, left: newX })
}

function avlInsert(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null, height: 1 }
  if (value < root.value) root = { ...root, left: avlInsert(root.left, value) }
  else if (value > root.value) root = { ...root, right: avlInsert(root.right, value) }
  else return root

  root = updateHeight(root)
  const bf = balanceFactor(root)

  if (bf > 1 && root.left && value < root.left.value) return rotateRight(root)
  if (bf < -1 && root.right && value > root.right.value) return rotateLeft(root)
  if (bf > 1 && root.left && value > root.left.value) {
    return rotateRight({ ...root, left: rotateLeft(root.left) })
  }
  if (bf < -1 && root.right && value < root.right.value) {
    return rotateLeft({ ...root, right: rotateRight(root.right) })
  }
  return root
}

function bstInsert(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null, height: 1 }
  if (value < root.value) return updateHeight({ ...root, left: bstInsert(root.left, value) })
  if (value > root.value) return updateHeight({ ...root, right: bstInsert(root.right, value) })
  return root
}

function renderTree(node: TreeNode | null, x: number, y: number, spread: number): ReactNode {
  if (!node) return null
  const lx = x - spread
  const rx = x + spread
  const cy = y + 44

  return (
    <g key={`${node.value}-${x}`}>
      {node.left && <line x1={x} y1={y} x2={lx} y2={cy} stroke="var(--border)" strokeWidth="1.5" />}
      {node.right && <line x1={x} y1={y} x2={rx} y2={cy} stroke="var(--border)" strokeWidth="1.5" />}
      <motion.circle
        cx={x} cy={y} r={15}
        animate={{ fill: 'var(--surface-2)' }}
        transition={{ duration: 0.3 }}
      />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="var(--text)">{node.value}</text>
      {renderTree(node.left, lx, cy, spread * 0.55)}
      {renderTree(node.right, rx, cy, spread * 0.55)}
    </g>
  )
}

const SEQUENCE = [1, 2, 3, 4, 5]

export function DsaAVL({ onComplete }: { onComplete: () => void }) {
  const [bstRoot, setBstRoot] = useState<TreeNode | null>(null)
  const [avlRoot, setAvlRoot] = useState<TreeNode | null>(null)
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
  }, [])

  const runSequence = () => {
    setRunning(true)
    setStep(0)
    setBstRoot(null)
    setAvlRoot(null)
    setDone(false)

    let bst: TreeNode | null = null
    let avl: TreeNode | null = null
    let i = 0

    const tick = () => {
      if (i < SEQUENCE.length) {
        const v = SEQUENCE[i]
        bst = bstInsert(bst, v)
        avl = avlInsert(avl, v)
        setBstRoot({ ...bst })
        setAvlRoot({ ...avl })
        setStep(i + 1)
        i++
        timerRef.current = window.setTimeout(tick, 900)
      } else {
        setRunning(false)
        setDone(true)
      }
    }
    timerRef.current = window.setTimeout(tick, 400)
  }

  const bstH = nodeHeight(bstRoot)
  const avlH = nodeHeight(avlRoot)

  return (
    <div className="lesson-panel">
      <p className="lede">
        Inserting sorted values into a plain BST creates a linked list (worst case). An <strong>AVL tree</strong>{' '}
        rotates after each insert to keep the height O(log n). Watch them diverge.
      </p>

      <button type="button" className="btn primary" onClick={runSequence} disabled={running}>
        {done ? 'Run again' : 'Insert 1, 2, 3, 4, 5'}
      </button>

      <div className="dsa-avl-columns">
        <div className="dsa-avl-col">
          <span className="micro">Plain BST (height = {bstH})</span>
          <svg width={180} height={240} className="dsa-avl-svg">
            {bstRoot ? renderTree(bstRoot, 90, 20, 50) : (
              <text x={90} y={120} textAnchor="middle" fill="var(--text-muted)" fontSize="11">Empty</text>
            )}
          </svg>
          {done && (
            <motion.p className="dsa-avl-warn micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Height {bstH} with {SEQUENCE.length} nodes = O(n) search
            </motion.p>
          )}
        </div>

        <div className="dsa-avl-col">
          <span className="micro">AVL tree (height = {avlH})</span>
          <svg width={180} height={240} className="dsa-avl-svg">
            {avlRoot ? renderTree(avlRoot, 90, 20, 50) : (
              <text x={90} y={120} textAnchor="middle" fill="var(--text-muted)" fontSize="11">Empty</text>
            )}
          </svg>
          {done && (
            <motion.p className="dsa-avl-good micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Height {avlH} with {SEQUENCE.length} nodes ≈ log₂({SEQUENCE.length}) = O(log n) search ✓
            </motion.p>
          )}
        </div>
      </div>

      {done && (
        <motion.div
          className="dsa-avl-summary micro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          BST height: <strong>{bstH}</strong> (degenerated). AVL height: <strong>{avlH}</strong> (balanced).
          AVL rotated {bstH - avlH} time{bstH - avlH !== 1 ? 's' : ''} to stay balanced.
        </motion.div>
      )}

      <ConnectionCard
        title="PostgreSQL's B-tree index and Java's TreeMap use balanced trees"
        body={
          <>
            The B-tree (not binary tree) in PostgreSQL is a generalization that keeps hundreds of keys per
            node, reducing tree height further. Java's TreeMap uses a Red-Black tree, another self-balancing
            variant. In both cases, O(log n) operations are guaranteed, not hoped for.
          </>
        }
        appearsIn={['databases chapter B-tree index', 'DsaDijkstra which needs O(log n) extracts', 'Java TreeMap / C++ std::map']}
        hook="Balanced trees for ordering. What about prefix search — matching all strings starting with 'ap'? Next: tries."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to tries
        </button>
        {!done && (
          <span className="hint">Run the insert sequence to see the divergence.</span>
        )}
      </div>
    </div>
  )
}
