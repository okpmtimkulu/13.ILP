import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface Process {
  id: number
  name: string
  color: string
  pagesNeeded: number
  pagesPlaced: number[]  // indices into FRAMES
}

interface Frame {
  owner: number | null  // process id or null
  pageNum: number | null
}

interface TlbEntry {
  vpage: string
  frame: number
  highlight: boolean
}

const PROCESSES: Process[] = [
  { id: 1, name: 'P1', color: '#60a5fa', pagesNeeded: 4, pagesPlaced: [] },
  { id: 2, name: 'P2', color: '#f97316', pagesNeeded: 4, pagesPlaced: [] },
  { id: 3, name: 'P3', color: '#4ade80', pagesNeeded: 4, pagesPlaced: [] },
]

function makeFrames(): Frame[] {
  return Array.from({ length: 16 }, () => ({ owner: null, pageNum: null }))
}

export function MemPaging({ onComplete }: { onComplete: () => void }) {
  const [processes, setProcesses] = useState<Process[]>(PROCESSES)
  const [frames, setFrames] = useState<Frame[]>(makeFrames())
  const [pageFaults, setPageFaults] = useState(0)
  const [tlb, setTlb] = useState<TlbEntry[]>([])
  const [selected, setSelected] = useState<{ procId: number; pageNum: number } | null>(null)
  const [evictTarget, setEvictTarget] = useState<number | null>(null)
  const [showCard, setShowCard] = useState(false)

  const allPlaced = processes.every((p) => p.pagesPlaced.length >= p.pagesNeeded)

  const freeFrames = frames.reduce((acc, f, i) => {
    if (f.owner === null) acc.push(i)
    return acc
  }, [] as number[])

  const selectNextPage = (procId: number) => {
    const proc = processes.find((p) => p.id === procId)!
    if (proc.pagesPlaced.length >= proc.pagesNeeded) return
    const pageNum = proc.pagesPlaced.length
    setSelected({ procId, pageNum })
    setEvictTarget(null)
  }

  const placeInFrame = (frameIdx: number) => {
    if (!selected) return
    const { procId, pageNum } = selected
    const frame = frames[frameIdx]

    let newFaults = pageFaults
    if (frame.owner !== null) {
      // Eviction needed
      newFaults++
      setPageFaults(newFaults)
      setProcesses((prev) =>
        prev.map((p) =>
          p.id === frame.owner
            ? { ...p, pagesPlaced: p.pagesPlaced.filter((fi) => fi !== frameIdx) }
            : p,
        ),
      )
    }

    const newFrames = frames.map((f, i) =>
      i === frameIdx ? { owner: procId, pageNum } : f,
    )
    setFrames(newFrames)

    setProcesses((prev) =>
      prev.map((p) =>
        p.id === procId
          ? { ...p, pagesPlaced: [...p.pagesPlaced.filter((fi) => fi !== frameIdx), frameIdx] }
          : p,
      ),
    )

    // Update TLB
    const vpage = `P${procId}:${pageNum}`
    const newTlb: TlbEntry[] = [
      { vpage, frame: frameIdx, highlight: true },
      ...tlb.filter((e) => e.vpage !== vpage).slice(0, 3),
    ]
    setTlb(newTlb)
    setTimeout(() => setTlb((prev) => prev.map((e) => ({ ...e, highlight: false }))), 800)

    setSelected(null)
    if (allPlaced || processes.every((p) => (p.id === procId ? p.pagesPlaced.length + 1 : p.pagesPlaced.length) >= p.pagesNeeded)) {
      setShowCard(true)
    }
  }

  const proc = selected ? processes.find((p) => p.id === selected.procId)! : null

  return (
    <div className="lesson-panel">
      <p className="lede">
        Physical memory is divided into 16 fixed-size frames. Three processes each need 4 pages. Select a process
        to pick its next page, then click a frame to place it. If the frame is occupied, the existing page is
        evicted — which counts as a page fault.
      </p>
      <p className="micro">
        TLB (4-slot translation cache) shows the most recent virtual→physical mappings for fast lookup.
      </p>

      <div className="mem-paging-board">
        <div className="mem-paging-processes">
          {processes.map((p) => {
            const remaining = p.pagesNeeded - p.pagesPlaced.length
            return (
              <motion.button
                key={p.id}
                type="button"
                className={`mem-paging-proc ${selected?.procId === p.id ? 'mem-paging-proc--selected' : ''}`}
                style={{ borderColor: p.color }}
                onClick={() => selectNextPage(p.id)}
                disabled={remaining === 0}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <span className="mem-paging-proc-name" style={{ color: p.color }}>{p.name}</span>
                <span className="mem-paging-proc-status">
                  {p.pagesPlaced.length}/{p.pagesNeeded} pages placed
                </span>
                {remaining > 0 && (
                  <span className="mem-paging-proc-next">page {p.pagesPlaced.length} needs a frame</span>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="mem-paging-frames">
          {frames.map((frame, i) => {
            const owner = processes.find((p) => p.id === frame.owner)
            const row = Math.floor(i / 4)
            const col = i % 4
            return (
              <motion.button
                key={i}
                type="button"
                className={`mem-paging-frame ${selected && frame.owner === null ? 'mem-paging-frame--target' : ''} ${
                  selected && frame.owner !== null ? 'mem-paging-frame--evict' : ''
                }`}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  backgroundColor: owner ? `${owner.color}33` : undefined,
                  borderColor: owner ? owner.color : undefined,
                }}
                onClick={() => selected && placeInFrame(i)}
                disabled={!selected}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <span className="mem-paging-frame-num">{i}</span>
                {frame.owner !== null && (
                  <span className="mem-paging-frame-content" style={{ color: owner?.color }}>
                    {owner?.name}:{frame.pageNum}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {selected && (
        <motion.p
          className="mem-paging-prompt"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          Placing <strong style={{ color: proc?.color }}>{proc?.name} page {selected.pageNum}</strong> — click a
          frame. Empty frames are free. Occupied frames cause an eviction (page fault).
        </motion.p>
      )}

      <div className="mem-paging-stats">
        <span className="mem-paging-stat">
          Page faults: <strong>{pageFaults}</strong>
        </span>
        <span className="mem-paging-stat">
          Free frames: <strong>{freeFrames.length}</strong>
        </span>
      </div>

      <div className="mem-paging-tlb">
        <span className="mem-paging-tlb-label">TLB (4 slots)</span>
        {tlb.length === 0 && <span className="micro">Empty — fills as you place pages</span>}
        {tlb.map((entry) => (
          <motion.div
            key={entry.vpage}
            className="mem-paging-tlb-entry"
            animate={{
              backgroundColor: entry.highlight ? 'rgba(52,211,153,0.2)' : 'transparent',
              outline: entry.highlight ? '1px solid #34d399' : '1px solid transparent',
            }}
            transition={{ duration: 0.3 }}
          >
            <span>{entry.vpage}</span>
            <span>→</span>
            <span>frame {entry.frame}</span>
          </motion.div>
        ))}
      </div>

      {showCard && (
        <ConnectionCard
          title="Modern OSes do this for every memory access — the TLB makes it fast enough to be invisible"
          body={
            <>
              Without the TLB, every memory access would require a page-table walk — two memory reads for the price
              of one. The TLB caches the last few translations so that the common case costs nothing extra. A TLB
              miss is rare; a page fault is rarer still. That rarity is what makes virtual memory practical.
            </>
          }
          appearsIn={['OS design courses', 'hypervisor and container memory', 'ARM and x86 architecture manuals']}
          hook="You placed every page. You now understand the full memory hierarchy from registers to page tables."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!allPlaced}>
          Finish memory chapter
        </button>
        {!allPlaced && <span className="hint">Place all {processes.reduce((s, p) => s + p.pagesNeeded, 0)} pages to continue.</span>}
      </div>
    </div>
  )
}
