import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const KEYS_TO_INSERT = [5, 3, 7, 1, 9, 4, 6, 8]

type BNode = {
  keys: number[]
  children: BNode[]
  id: string
}

function buildBtreeSteps(): BNode[] {
  // Returns root after each insertion (simplified B-tree of order 3, max 2 keys)
  const snapshots: BNode[] = []
  let idCounter = 0

  const makeNode = (keys: number[] = [], children: BNode[] = []): BNode => ({
    keys,
    children,
    id: String(idCounter++),
  })

  // We'll represent the state as a flat root for visualization simplicity
  // For a real B-tree of order 3: max 2 keys, split when 3 keys
  let root = makeNode()

  for (const key of KEYS_TO_INSERT) {
    // Insert into sorted keys
    const newKeys = [...root.keys, key].sort((a, b) => a - b)
    if (newKeys.length <= 2) {
      root = makeNode(newKeys, root.children)
    } else {
      // Split: push middle key up (simplified: single level for visual clarity)
      const mid = newKeys[1]
      const leftKeys = [newKeys[0]]
      const rightKeys = [newKeys[2]]
      const left = makeNode(leftKeys)
      const right = makeNode(rightKeys)
      root = makeNode([mid], [left, right])
    }
    snapshots.push(root)
  }

  return snapshots
}

const snapshots = buildBtreeSteps()

function NodeBox({ node, highlight }: { node: BNode; highlight?: number }) {
  return (
    <div className="db-btree-node">
      <div className="db-btree-node-keys">
        {node.keys.map((k) => (
          <motion.span
            key={k}
            className={`db-btree-key ${k === highlight ? 'db-btree-key--highlight' : ''}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {k}
          </motion.span>
        ))}
      </div>
      {node.children.length > 0 && (
        <div className="db-btree-children">
          {node.children.map((child) => (
            <NodeBox key={child.id} node={child} highlight={highlight} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DbBtree({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(-1)
  const [searchDone, setSearchDone] = useState(false)
  const [searchPath, setSearchPath] = useState(false)
  const [showBST, setShowBST] = useState(false)
  const [done, setDone] = useState(false)

  const insertStep = () => {
    if (step < KEYS_TO_INSERT.length - 1) {
      setStep((s) => s + 1)
    }
  }

  const handleSearch = () => {
    setSearchPath(true)
    setTimeout(() => {
      setSearchDone(true)
    }, 800)
  }

  const handleComplete = () => {
    setDone(true)
    onComplete()
  }

  const currentRoot = step >= 0 ? snapshots[step] : null
  const allInserted = step === KEYS_TO_INSERT.length - 1

  return (
    <div className="lesson-panel">
      <p className="lede">
        A <strong>B-tree of order 3</strong> keeps at most 2 keys per node. When a node overflows, it splits — pushing
        the middle key up to its parent. Insert 8 keys and watch the tree stay balanced.
      </p>
      <p className="micro">Insert key: {step < KEYS_TO_INSERT.length - 1 ? KEYS_TO_INSERT[step + 1] : '—'}</p>

      <div className="db-btree-stage">
        <div className="db-btree-queue">
          {KEYS_TO_INSERT.map((k, i) => (
            <span key={k} className={`db-btree-queued ${i <= step ? 'db-btree-queued--done' : ''}`}>
              {k}
            </span>
          ))}
        </div>

        <div className="db-btree-tree">
          <AnimatePresence mode="wait">
            {currentRoot ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <NodeBox node={currentRoot} highlight={searchPath ? 4 : undefined} />
              </motion.div>
            ) : (
              <p className="micro" style={{ textAlign: 'center', marginTop: '2rem' }}>
                Press Insert to add the first key
              </p>
            )}
          </AnimatePresence>
        </div>

        {searchDone && (
          <motion.div
            className="db-btree-search-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <strong>Search for 4:</strong> found in <strong>2 disk reads</strong> (root + child node).
            <br />
            <span className="micro">A degenerate BST with same data: up to 8 reads (linear scan).</span>
          </motion.div>
        )}

        {showBST && (
          <motion.div
            className="db-btree-bst-compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="db-btree-compare-row">
              <div className="db-btree-compare-col">
                <strong>Degenerate BST</strong>
                <p className="micro">1→3→4→5→6→7→8→9 (linked list)</p>
                <span className="db-btree-reads db-btree-reads--bad">8 reads to find 9</span>
              </div>
              <div className="db-btree-compare-col">
                <strong>B-tree (order 3)</strong>
                <p className="micro">Balanced at all times</p>
                <span className="db-btree-reads db-btree-reads--good">2 reads to find any key</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {!allInserted && (
          <button type="button" className="btn primary" onClick={insertStep}>
            Insert {KEYS_TO_INSERT[step + 1]}
          </button>
        )}
        {allInserted && !searchDone && (
          <button type="button" className="btn primary" onClick={handleSearch}>
            Search for key 4
          </button>
        )}
        {searchDone && !showBST && (
          <button type="button" className="btn primary" onClick={() => setShowBST(true)}>
            Compare to BST
          </button>
        )}
        {showBST && !done && (
          <button type="button" className="btn primary" onClick={handleComplete}>
            Continue
          </button>
        )}
        {!allInserted && (
          <span className="hint">
            {KEYS_TO_INSERT.length - 1 - step} keys remaining
          </span>
        )}
      </div>

      {searchDone && (
        <ConnectionCard
          title="Every relational database uses B-trees"
          body={
            <>
              PostgreSQL, MySQL, SQLite, and file systems like NTFS and ext4 all use B-trees for their main index.
              A table with 1 billion rows still takes at most 30 reads to find any record — because log base 1000 of 1B is 3.
            </>
          }
          appearsIn={['database indexes', 'file systems', 'PostgreSQL heap files']}
          hook="Now that data is stored, how does the database decide which rows to return?"
        />
      )}
    </div>
  )
}
