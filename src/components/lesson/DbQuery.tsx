import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Row = { id: number; name: string; age: number; city: string }

const USERS: Row[] = [
  { id: 1, name: 'Alice', age: 28, city: 'London' },
  { id: 2, name: 'Bob', age: 35, city: 'Paris' },
  { id: 3, name: 'Carol', age: 22, city: 'London' },
  { id: 4, name: 'Dan', age: 41, city: 'Berlin' },
  { id: 5, name: 'Eve', age: 29, city: 'London' },
]

type ColKey = keyof Row

export function DbQuery({ onComplete }: { onComplete: () => void }) {
  const [selectCols, setSelectCols] = useState<Set<ColKey>>(new Set(['id', 'name', 'city']))
  const [whereCol, setWhereCol] = useState<ColKey>('city')
  const [whereVal, setWhereVal] = useState('London')
  const [scanIdx, setScanIdx] = useState<number | null>(null)
  const [scanDone, setScanDone] = useState(false)
  const [hasIndex, setHasIndex] = useState(false)
  const [indexRunDone, setIndexRunDone] = useState(false)
  const [done, setDone] = useState(false)

  const cols: ColKey[] = ['id', 'name', 'age', 'city']

  const toggleCol = (col: ColKey) => {
    setSelectCols((prev) => {
      const next = new Set(prev)
      if (next.has(col)) {
        if (next.size > 1) next.delete(col)
      } else {
        next.add(col)
      }
      return next
    })
  }

  const sqlText = `SELECT ${[...selectCols].join(', ')}\nFROM users\nWHERE ${String(whereCol)} = '${whereVal}'`

  const matchingRows = USERS.filter((r) => String(r[whereCol]) === whereVal)

  const runScan = () => {
    setScanIdx(0)
    setScanDone(false)
    const interval = setInterval(() => {
      setScanIdx((i) => {
        if (i === null || i >= USERS.length - 1) {
          clearInterval(interval)
          setScanDone(true)
          return USERS.length - 1
        }
        return i + 1
      })
    }, 350)
  }

  const runIndex = () => {
    setScanIdx(null)
    setTimeout(() => {
      setIndexRunDone(true)
    }, 600)
  }

  const canComplete = scanDone && (indexRunDone || !hasIndex)

  return (
    <div className="lesson-panel">
      <p className="lede">
        Build a SQL query using the checkboxes and dropdown, then watch how the database executes it — differently with
        and without an index.
      </p>

      <div className="db-query-builder">
        <div className="db-query-section">
          <span className="db-query-label">SELECT</span>
          {cols.map((col) => (
            <label key={col} className="db-query-checkbox">
              <input
                type="checkbox"
                checked={selectCols.has(col)}
                onChange={() => toggleCol(col)}
              />
              {col}
            </label>
          ))}
        </div>

        <div className="db-query-section">
          <span className="db-query-label">WHERE</span>
          <select
            className="db-query-select"
            value={whereCol}
            onChange={(e) => setWhereCol(e.target.value as ColKey)}
          >
            {cols.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span>=</span>
          <input
            className="db-query-input"
            value={whereVal}
            onChange={(e) => setWhereVal(e.target.value)}
          />
        </div>

        <pre className="db-query-sql">{sqlText}</pre>
      </div>

      <div className="db-query-table">
        <table>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c} className={selectCols.has(c) ? '' : 'db-query-col--dim'}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS.map((row, i) => {
              const isScanning = scanIdx !== null && i <= scanIdx && !indexRunDone
              const isMatch = String(row[whereCol]) === whereVal
              const isIndexHit = indexRunDone && isMatch
              return (
                <motion.tr
                  key={row.id}
                  animate={{
                    backgroundColor: isIndexHit
                      ? 'rgba(56, 189, 248, 0.25)'
                      : isScanning && isMatch
                      ? 'rgba(250, 204, 21, 0.25)'
                      : isScanning
                      ? 'rgba(148, 163, 184, 0.15)'
                      : 'transparent',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {cols.map((c) => (
                    <td key={c} className={selectCols.has(c) ? '' : 'db-query-col--dim'}>
                      {String(row[c])}
                    </td>
                  ))}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {scanDone && (
          <motion.div
            className="db-query-plan"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <strong>Query plan:</strong>{' '}
            {hasIndex && indexRunDone
              ? `Index lookup on ${String(whereCol)} → ${matchingRows.length} row${matchingRows.length !== 1 ? 's' : ''} found (${matchingRows.length + 1} reads)`
              : `Full scan: ${USERS.length} rows examined, ${matchingRows.length} matched`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lesson-actions">
        {!scanDone && (
          <button type="button" className="btn primary" onClick={runScan}>
            Run query (full scan)
          </button>
        )}
        {scanDone && !hasIndex && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setHasIndex(true)
              setScanDone(false)
              setScanIdx(null)
              setIndexRunDone(false)
            }}
          >
            Create index on {String(whereCol)}
          </button>
        )}
        {hasIndex && !indexRunDone && (
          <button type="button" className="btn primary" onClick={runIndex}>
            Run query (index lookup)
          </button>
        )}
        {indexRunDone && !done && (
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
        {!scanDone && <span className="hint">Press Run query to execute a full table scan</span>}
      </div>

      {indexRunDone && (
        <ConnectionCard
          title="Query optimizers run these decisions automatically"
          body={
            <>
              Every SELECT you write triggers a query optimizer that decides between full scans, index lookups, and join
              strategies. PostgreSQL's EXPLAIN ANALYZE shows exactly which path was chosen and why.
            </>
          }
          appearsIn={['database indexes', 'query planners', 'EXPLAIN ANALYZE output']}
          hook="Indexes make reads fast, but writes must update every index. Next: what happens when a write crashes halfway through?"
        />
      )}
    </div>
  )
}
