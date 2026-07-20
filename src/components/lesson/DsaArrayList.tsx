import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Op = 'insert' | 'delete' | 'access'
type DS = 'array' | 'list'

const INITIAL_ARRAY = [10, 20, 30, 40, 50]
const INITIAL_LIST = [10, 20, 30, 40, 50]

interface OperationResult {
  op: Op
  ds: DS
  steps: number
  complexity: string
  description: string
}

export function DsaArrayList({ onComplete }: { onComplete: () => void }) {
  const [array, setArray] = useState([...INITIAL_ARRAY])
  const [list, setList] = useState([...INITIAL_LIST])
  const [result, setResult] = useState<OperationResult | null>(null)
  const [triedOps, setTriedOps] = useState<Set<string>>(new Set())
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null)

  const markOp = (op: Op, ds: DS) => setTriedOps((prev) => new Set([...prev, `${op}-${ds}`]))

  const allOps: string[] = ['insert-array', 'insert-list', 'delete-array', 'delete-list', 'access-array', 'access-list']
  const isDone = allOps.every((k) => triedOps.has(k))

  const runInsert = (ds: DS) => {
    const mid = 2
    if (ds === 'array') {
      setAnimatingIdx(mid)
      setTimeout(() => {
        setArray((prev) => [...prev.slice(0, mid), 99, ...prev.slice(mid)])
        setAnimatingIdx(null)
      }, 600)
      setResult({ op: 'insert', ds, steps: INITIAL_ARRAY.length, complexity: 'O(n)', description: `Shift ${INITIAL_ARRAY.length - mid} elements right to make room at position ${mid}.` })
    } else {
      setList((prev) => [...prev.slice(0, mid), 99, ...prev.slice(mid)])
      setResult({ op: 'insert', ds, steps: 1, complexity: 'O(1)', description: 'Re-link the pointer at position. No shifting needed.' })
    }
    markOp('insert', ds)
  }

  const runDelete = (ds: DS) => {
    const mid = 2
    if (ds === 'array') {
      setArray((prev) => [...prev.slice(0, mid), ...prev.slice(mid + 1)])
      setResult({ op: 'delete', ds, steps: array.length - mid, complexity: 'O(n)', description: `Shift ${array.length - mid - 1} elements left to fill the gap.` })
    } else {
      setList((prev) => [...prev.slice(0, mid), ...prev.slice(mid + 1)])
      setResult({ op: 'delete', ds, steps: 1, complexity: 'O(1)', description: 'Update the previous node pointer. No shifting.' })
    }
    markOp('delete', ds)
  }

  const runAccess = (ds: DS) => {
    if (ds === 'array') {
      setAnimatingIdx(3)
      setTimeout(() => setAnimatingIdx(null), 800)
      setResult({ op: 'access', ds, steps: 1, complexity: 'O(1)', description: 'Direct index jump: base_address + 3 × element_size. Instant.' })
    } else {
      setResult({ op: 'access', ds, steps: 4, complexity: 'O(n)', description: 'Must traverse from head: node 0 → 1 → 2 → 3. Count the hops.' })
    }
    markOp('access', ds)
  }

  const reset = () => {
    setArray([...INITIAL_ARRAY])
    setList([...INITIAL_LIST])
    setResult(null)
    setAnimatingIdx(null)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Arrays and linked lists store sequences — but they trade off <strong>insert speed vs access speed</strong>.
        Try all three operations on both structures to see the cost difference.
      </p>

      <div className="dsa-al-structures">
        <div className="dsa-al-col">
          <span className="micro">Array (fixed positions):</span>
          <div className="dsa-al-array">
            <AnimatePresence>
              {array.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  className={`dsa-al-cell ${animatingIdx === i ? 'is-active' : ''}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="dsa-al-cell-idx">[{i}]</span>
                  <span>{v}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="dsa-al-btns">
            <button type="button" className="btn" onClick={() => runInsert('array')}>Insert mid</button>
            <button type="button" className="btn" onClick={() => runDelete('array')} disabled={array.length <= 1}>Delete mid</button>
            <button type="button" className="btn" onClick={() => runAccess('array')} disabled={array.length < 4}>Access [3]</button>
          </div>
        </div>

        <div className="dsa-al-col">
          <span className="micro">Linked list (nodes + arrows):</span>
          <div className="dsa-al-list">
            <AnimatePresence>
              {list.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  className="dsa-al-list-node"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span>{v}</span>
                  {i < list.length - 1 && <span className="dsa-al-arrow">→</span>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="dsa-al-btns">
            <button type="button" className="btn" onClick={() => runInsert('list')}>Insert mid</button>
            <button type="button" className="btn" onClick={() => runDelete('list')} disabled={list.length <= 1}>Delete mid</button>
            <button type="button" className="btn" onClick={() => runAccess('list')} disabled={list.length < 4}>Access [3]</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="dsa-al-result"
            key={`${result.op}-${result.ds}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <span className="dsa-al-result-op">{result.op} on {result.ds}</span>
            <span className={`dsa-al-complexity ${result.complexity === 'O(1)' ? 'is-fast' : 'is-slow'}`}>
              {result.complexity}
            </span>
            <span className="micro">{result.description}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button type="button" className="btn" onClick={reset}>Reset structures</button>

      <p className="micro" role="status">Operations tried: {triedOps.size}/{allOps.length}</p>

      <ConnectionCard
        title="The choice of array vs linked list changes the cost of every operation"
        body={
          <>
            ArrayList in Java (backed by an array) has O(1) get but O(n) add-at-middle. LinkedList has O(1)
            add but O(n) get. Python's list is actually an array — so list[n] is instant, but insert(0, x) is
            slow. This is why Python's deque exists.
          </>
        }
        appearsIn={['DsaTree step', 'DsaHash step', 'every data structure decision in real code']}
        hook="Arrays and lists are the building blocks. Next: organize them into a hierarchy — binary search trees."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to trees
        </button>
        {!isDone && (
          <span className="hint">Try all 3 operations on both structures ({triedOps.size}/{allOps.length} done).</span>
        )}
      </div>
    </div>
  )
}
