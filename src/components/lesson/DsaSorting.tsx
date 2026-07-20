import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const N = 20

function generateBars(): number[] {
  return Array.from({ length: N }, () => Math.floor(Math.random() * 90) + 10)
}

function bubbleSortSteps(arr: number[]): number[][] {
  const steps: number[][] = []
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push([...a])
      }
    }
  }
  return steps
}

function mergeSortSteps(arr: number[]): number[][] {
  const steps: number[][] = []
  const a = [...arr]

  function merge(left: number, mid: number, right: number) {
    const L = a.slice(left, mid + 1)
    const R = a.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left
    while (i < L.length && j < R.length) {
      if (L[i] <= R[j]) a[k++] = L[i++]
      else a[k++] = R[j++]
    }
    while (i < L.length) a[k++] = L[i++]
    while (j < R.length) a[k++] = R[j++]
    steps.push([...a])
  }

  function sort(left: number, right: number) {
    if (left >= right) return
    const mid = Math.floor((left + right) / 2)
    sort(left, mid)
    sort(mid + 1, right)
    merge(left, mid, right)
  }

  sort(0, a.length - 1)
  return steps
}

export function DsaSorting({ onComplete }: { onComplete: () => void }) {
  const [bars, setBars] = useState(generateBars)
  const [bubbleState, setBubbleState] = useState<number[]>(() => [...bars])
  const [mergeState, setMergeState] = useState<number[]>(() => [...bars])
  const [bubbleStep, setBubbleStep] = useState(0)
  const [mergeStep, setMergeStep] = useState(0)
  const [sorting, setSorting] = useState(false)
  const [done, setDone] = useState(false)
  const [speed, setSpeed] = useState(60)

  const bubbleStepsRef = useRef<number[][]>([])
  const mergeStepsRef = useRef<number[][]>([])
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const regenerate = () => {
    clearTimer()
    const newBars = generateBars()
    setBars(newBars)
    setBubbleState([...newBars])
    setMergeState([...newBars])
    setBubbleStep(0)
    setMergeStep(0)
    setSorting(false)
    setDone(false)
  }

  const startSort = () => {
    setSorting(true)
    bubbleStepsRef.current = bubbleSortSteps(bars)
    mergeStepsRef.current = mergeSortSteps(bars)
    setBubbleStep(0)
    setMergeStep(0)

    let bi = 0
    let mi = 0
    const bSteps = bubbleStepsRef.current
    const mSteps = mergeStepsRef.current
    const total = Math.max(bSteps.length, mSteps.length)

    timerRef.current = window.setInterval(() => {
      if (bi < bSteps.length) {
        setBubbleState([...bSteps[bi]])
        setBubbleStep(bi + 1)
        bi++
      }
      if (mi < mSteps.length) {
        setMergeState([...mSteps[mi]])
        setMergeStep(mi + 1)
        mi++
      }
      if (bi >= bSteps.length && mi >= mSteps.length) {
        clearTimer()
        setSorting(false)
        setDone(true)
      }
    }, speed)
  }

  const pause = () => {
    clearTimer()
    setSorting(false)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Watch <strong>Bubble Sort O(n²)</strong> and <strong>Merge Sort O(n log n)</strong> race on the same 20-bar
        dataset. The comparison count difference is dramatic.
      </p>

      <div className="dsa-sort-controls">
        <label className="dsa-sort-speed-label micro">
          Speed:
          <input
            type="range"
            min={10}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="dsa-sort-speed"
            disabled={sorting}
          />
          {speed}ms/step
        </label>
        <div className="dsa-sort-btn-row">
          <button type="button" className="btn primary" onClick={startSort} disabled={sorting || done}>
            Sort!
          </button>
          <button type="button" className="btn" onClick={pause} disabled={!sorting}>
            Pause
          </button>
          <button type="button" className="btn" onClick={regenerate}>
            Regenerate
          </button>
        </div>
      </div>

      <div className="dsa-sort-columns">
        <div className="dsa-sort-col">
          <span className="micro">Bubble Sort — steps: {bubbleStep} / {bubbleStepsRef.current.length || '?'}</span>
          <div className="dsa-sort-bars" aria-label="Bubble sort visualization">
            {bubbleState.map((v, i) => (
              <motion.div
                key={i}
                className="dsa-sort-bar"
                animate={{ height: `${v}%` }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                title={`${v}`}
              />
            ))}
          </div>
          <span className="micro dsa-sort-complexity dsa-sort-complexity--slow">O(n²)</span>
        </div>

        <div className="dsa-sort-col">
          <span className="micro">Merge Sort — steps: {mergeStep} / {mergeStepsRef.current.length || '?'}</span>
          <div className="dsa-sort-bars" aria-label="Merge sort visualization">
            {mergeState.map((v, i) => (
              <motion.div
                key={i}
                className="dsa-sort-bar dsa-sort-bar--merge"
                animate={{ height: `${v}%` }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                title={`${v}`}
              />
            ))}
          </div>
          <span className="micro dsa-sort-complexity dsa-sort-complexity--fast">O(n log n)</span>
        </div>
      </div>

      {done && (
        <motion.div
          className="dsa-sort-summary micro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Bubble: {bubbleStepsRef.current.length} swaps. Merge: {mergeStepsRef.current.length} merges.{' '}
          <strong>Merge required {Math.round(bubbleStepsRef.current.length / Math.max(mergeStepsRef.current.length, 1))}× fewer operations</strong>.
        </motion.div>
      )}

      <ConnectionCard
        title="Arrays.sort() in Java and Python's sorted() use Timsort"
        body={
          <>
            Timsort is a hybrid of merge sort and insertion sort. It exploits "runs" of already-sorted data
            (common in real datasets) and achieves O(n) best case, O(n log n) worst case. Both languages made
            the same choice because the algorithmic analysis pointed there.
          </>
        }
        appearsIn={['DsaBigO step', 'every production sort in every language', 'DsaComplexity P vs NP discussion']}
        hook="You can sort. But what about finding the minimum repeatedly? That is a heap — next."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to heaps
        </button>
        {!done && (
          <span className="hint">Run a full sort animation to continue.</span>
        )}
      </div>
    </div>
  )
}
