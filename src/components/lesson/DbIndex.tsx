import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const TOTAL_ROWS = 1000
const LONDON_COUNT = 47
const PAGE_SIZE = 12

function generateRows(): { id: number; city: string }[] {
  const rows: { id: number; city: string }[] = []
  const cities = ['London', 'Paris', 'Berlin', 'Tokyo', 'Sydney', 'New York', 'Lagos', 'Mumbai']
  for (let i = 1; i <= TOTAL_ROWS; i++) {
    const city = i === 5 || i === 83 ? 'London' : cities[i % cities.length]
    rows.push({ id: i, city })
  }
  return rows
}

const ALL_ROWS = generateRows()
const LONDON_IDS = ALL_ROWS.filter((r) => r.city === 'London').map((r) => r.id).slice(0, LONDON_COUNT)

export function DbIndex({ onComplete }: { onComplete: () => void }) {
  const [scanning, setScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const [scanDone, setScanDone] = useState(false)
  const [hasIndex, setHasIndex] = useState(false)
  const [indexRun, setIndexRun] = useState(false)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)

  const totalPages = Math.ceil(TOTAL_ROWS / PAGE_SIZE)

  const runFullScan = () => {
    setScanning(true)
    setScanCount(0)
    setScanDone(false)
    let count = 0
    const tick = setInterval(() => {
      count += 40
      if (count >= TOTAL_ROWS) {
        clearInterval(tick)
        setScanCount(TOTAL_ROWS)
        setScanDone(true)
        setScanning(false)
      } else {
        setScanCount(count)
      }
    }, 50)
  }

  const runIndexQuery = () => {
    setScanCount(0)
    setScanDone(false)
    setTimeout(() => {
      setScanCount(LONDON_COUNT + 1)
      setScanDone(true)
      setIndexRun(true)
    }, 600)
  }

  const deleteIndex = () => {
    setHasIndex(false)
    setIndexRun(false)
    setScanCount(0)
    setScanDone(false)
  }

  const displayRows = ALL_ROWS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="lesson-panel">
      <p className="lede">
        A table of <strong>1,000 users</strong>. Query: find all users in <strong>London</strong>. Without an index,
        every row must be examined. With one, the database jumps directly.
      </p>

      <div className="db-index-stage">
        <div className="db-index-counter-row">
          <div className="db-index-counter">
            <span className="db-index-counter-label">Rows examined</span>
            <motion.span
              className={`db-index-counter-value ${scanCount === TOTAL_ROWS ? 'db-index-counter-value--bad' : scanCount > 0 && !scanning ? 'db-index-counter-value--good' : ''}`}
              key={scanCount}
              animate={{ scale: [1.1, 1] }}
              transition={{ duration: 0.15 }}
            >
              {scanCount}
            </motion.span>
          </div>
          {hasIndex && (
            <div className="db-index-storage">
              <span className="db-index-counter-label">Index storage</span>
              <div className="db-index-storage-bar">
                <motion.div
                  className="db-index-storage-fill"
                  initial={{ width: 0 }}
                  animate={{ width: '18%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
              </div>
              <span className="micro">~18% of table size</span>
            </div>
          )}
        </div>

        <div className="db-index-table-wrap">
          <div className="db-index-table">
            {displayRows.map((row) => {
              const isLondon = row.city === 'London'
              const isScanned = scanning && row.id <= scanCount
              const isHit = indexRun && isLondon
              return (
                <motion.div
                  key={row.id}
                  className={`db-index-row ${isHit ? 'db-index-row--hit' : isScanned ? 'db-index-row--scan' : ''}`}
                  animate={{
                    backgroundColor: isHit
                      ? 'rgba(56, 189, 248, 0.3)'
                      : isScanned
                      ? 'rgba(148, 163, 184, 0.15)'
                      : 'transparent',
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <span className="db-index-row-id">#{row.id}</span>
                  <span className="db-index-row-city">{row.city}</span>
                </motion.div>
              )
            })}
          </div>
          <div className="db-index-pagination">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              &larr;
            </button>
            <span className="micro">
              Page {page + 1}/{totalPages}
            </span>
            <button type="button" disabled={page === totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              &rarr;
            </button>
          </div>
        </div>

        <AnimatePresence>
          {scanDone && (
            <motion.div
              className="db-index-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {indexRun
                ? `Index lookup: ${LONDON_COUNT + 1} reads (1 index read + ${LONDON_COUNT} matching rows)`
                : `Full scan: ${TOTAL_ROWS} rows examined, ${LONDON_COUNT} matched`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lesson-actions">
        {!scanDone && !scanning && !hasIndex && (
          <button type="button" className="btn primary" onClick={runFullScan}>
            Run query (full scan)
          </button>
        )}
        {scanDone && !hasIndex && (
          <button type="button" className="btn primary" onClick={() => setHasIndex(true)}>
            Create index on city
          </button>
        )}
        {hasIndex && !indexRun && (
          <>
            <button type="button" className="btn primary" onClick={runIndexQuery}>
              Run query (index lookup)
            </button>
            <button type="button" className="btn primary" style={{ background: 'var(--surface-3)' }} onClick={deleteIndex}>
              Delete index and rescan
            </button>
          </>
        )}
        {indexRun && !done && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(true)
              onComplete()
            }}
          >
            Continue
          </button>
        )}
        {scanning && <span className="hint">Scanning... {scanCount}/{TOTAL_ROWS}</span>}
      </div>

      {indexRun && (
        <ConnectionCard
          title="Over-indexing slows writes; under-indexing slows reads"
          body={
            <>
              Every index must be updated on every INSERT, UPDATE, and DELETE. A table with 20 indexes may be fast to
              read but painfully slow to write to. This is the DBA's daily tradeoff.
            </>
          }
          appearsIn={['PostgreSQL EXPLAIN', 'MySQL query analyzer', 'database performance tuning']}
          hook="Indexes optimize reads. Normalization optimizes writes. Next: how to structure tables to avoid redundancy."
        />
      )}
    </div>
  )
}
