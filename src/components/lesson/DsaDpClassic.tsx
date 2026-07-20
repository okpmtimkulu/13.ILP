import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

// Knapsack
const KS_ITEMS = [
  { w: 2, v: 3, label: 'A' },
  { w: 3, v: 4, label: 'B' },
  { w: 4, v: 5, label: 'C' },
  { w: 5, v: 8, label: 'D' },
  { w: 2, v: 4, label: 'E' },
]
const KS_W = 10

function buildKSTable(): number[][] {
  const n = KS_ITEMS.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(KS_W + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    const { w, v } = KS_ITEMS[i - 1]
    for (let j = 0; j <= KS_W; j++) {
      dp[i][j] = dp[i - 1][j]
      if (w <= j) dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - w] + v)
    }
  }
  return dp
}

// LCS
const S1 = 'ABCBDAB'
const S2 = 'BDCAB'

function buildLCSTable(): number[][] {
  const m = S1.length, n = S2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (S1[i - 1] === S2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp
}

function traceLCS(dp: number[][]): string {
  let i = S1.length, j = S2.length
  const result: string[] = []
  while (i > 0 && j > 0) {
    if (S1[i - 1] === S2[j - 1]) {
      result.unshift(S1[i - 1])
      i--; j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  return result.join('')
}

type Tab = 'knapsack' | 'lcs'

export function DsaDpClassic({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = useState<Tab>('knapsack')
  const [ksCellsFilled, setKsCellsFilled] = useState<Set<string>>(new Set())
  const [ksTraceDone, setKsTraceDone] = useState(false)
  const [lcsCellsFilled, setLcsCellsFilled] = useState<Set<string>>(new Set())
  const [lcsTraceDone, setLcsTraceDone] = useState(false)

  const ksTable = buildKSTable()
  const lcsTable = buildLCSTable()
  const lcsResult = traceLCS(lcsTable)

  const ksComplete = ksCellsFilled.size >= (KS_ITEMS.length + 1) * (KS_W + 1) / 2 && ksTraceDone
  const lcsComplete = lcsCellsFilled.size >= (S1.length + 1) * (S2.length + 1) / 2 && lcsTraceDone

  const fillKsAll = () => {
    const s = new Set<string>()
    for (let i = 0; i <= KS_ITEMS.length; i++)
      for (let j = 0; j <= KS_W; j++)
        s.add(`${i}-${j}`)
    setKsCellsFilled(s)
  }

  const fillLcsAll = () => {
    const s = new Set<string>()
    for (let i = 0; i <= S1.length; i++)
      for (let j = 0; j <= S2.length; j++)
        s.add(`${i}-${j}`)
    setLcsCellsFilled(s)
  }

  const isDone = ksComplete && lcsComplete

  return (
    <div className="lesson-panel">
      <p className="lede">
        Two classic DP problems: <strong>0/1 Knapsack</strong> and <strong>Longest Common Subsequence</strong>.
        Each fills a 2D table bottom-up, then traces back the solution.
      </p>

      <div className="dsa-dp-tabs">
        <button
          type="button"
          className={`btn ${tab === 'knapsack' ? 'primary' : ''}`}
          onClick={() => setTab('knapsack')}
        >
          Knapsack
        </button>
        <button
          type="button"
          className={`btn ${tab === 'lcs' ? 'primary' : ''}`}
          onClick={() => setTab('lcs')}
        >
          LCS
        </button>
      </div>

      {tab === 'knapsack' && (
        <div className="dsa-dpc-problem">
          <div className="dsa-dpc-items micro">
            Items: {KS_ITEMS.map((it) => `${it.label}(w:${it.w},v:${it.v})`).join(' · ')} — Capacity: {KS_W}
          </div>

          <div className="dsa-dpc-table-wrap">
            <span className="micro">dp[i][w] = max value using first i items with capacity w:</span>
            <div className="dsa-dpc-table-scroll">
              <table className="dsa-dpc-table">
                <thead>
                  <tr>
                    <th>i\w</th>
                    {Array.from({ length: KS_W + 1 }, (_, j) => <th key={j}>{j}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ksTable.map((row, i) => (
                    <tr key={i}>
                      <td className="micro">{i === 0 ? '∅' : KS_ITEMS[i - 1].label}</td>
                      {row.map((val, j) => {
                        const key = `${i}-${j}`
                        const filled = ksCellsFilled.has(key)
                        return (
                          <motion.td
                            key={j}
                            className={`dsa-dpc-cell ${filled ? 'is-filled' : ''}`}
                            onClick={() => {
                              setKsCellsFilled((prev) => new Set([...prev, key]))
                            }}
                            animate={{ backgroundColor: filled ? 'var(--signal-dim, rgba(99,102,241,0.15))' : 'transparent' }}
                            transition={{ duration: 0.15 }}
                          >
                            {filled ? val : '?'}
                          </motion.td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dsa-dpc-actions">
            <button type="button" className="btn" onClick={fillKsAll}>Fill all cells</button>
            <button type="button" className="btn primary" onClick={() => setKsTraceDone(true)} disabled={ksTraceDone || ksCellsFilled.size < 10}>
              {ksTraceDone ? 'Traceback done ✓' : 'Traceback → find selected items'}
            </button>
          </div>

          {ksTraceDone && (
            <motion.div
              className="dsa-dpc-result micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Optimal value: <strong>{ksTable[KS_ITEMS.length][KS_W]}</strong>
            </motion.div>
          )}
        </div>
      )}

      {tab === 'lcs' && (
        <div className="dsa-dpc-problem">
          <div className="dsa-dpc-items micro">
            S1 = "{S1}" · S2 = "{S2}"
          </div>

          <div className="dsa-dpc-table-wrap">
            <span className="micro">dp[i][j] = LCS length of S1[0..i] and S2[0..j]:</span>
            <div className="dsa-dpc-table-scroll">
              <table className="dsa-dpc-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>∅</th>
                    {S2.split('').map((c, j) => <th key={j}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {lcsTable.map((row, i) => (
                    <tr key={i}>
                      <td className="micro">{i === 0 ? '∅' : S1[i - 1]}</td>
                      {row.map((val, j) => {
                        const key = `${i}-${j}`
                        const filled = lcsCellsFilled.has(key)
                        return (
                          <motion.td
                            key={j}
                            className={`dsa-dpc-cell ${filled ? 'is-filled' : ''}`}
                            onClick={() => setLcsCellsFilled((prev) => new Set([...prev, key]))}
                            animate={{ backgroundColor: filled ? 'var(--signal-dim, rgba(99,102,241,0.15))' : 'transparent' }}
                            transition={{ duration: 0.15 }}
                          >
                            {filled ? val : '?'}
                          </motion.td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dsa-dpc-actions">
            <button type="button" className="btn" onClick={fillLcsAll}>Fill all cells</button>
            <button type="button" className="btn primary" onClick={() => setLcsTraceDone(true)} disabled={lcsTraceDone || lcsCellsFilled.size < 10}>
              {lcsTraceDone ? 'Traceback done ✓' : 'Traceback → find LCS'}
            </button>
          </div>

          {lcsTraceDone && (
            <motion.div
              className="dsa-dpc-result micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              LCS = "<strong>{lcsResult}</strong>" (length {lcsResult.length})
            </motion.div>
          )}
        </div>
      )}

      <ConnectionCard
        title="Git's diff algorithm is LCS. DNA sequence alignment uses DP. Spell-checkers use edit distance"
        body={
          <>
            Git diff finds the LCS between two file versions and shows what was added or removed. BLAST, the
            tool biologists use to find similar DNA sequences, is DP on strings. Your spell-checker computes
            Levenshtein distance (minimum edits to transform one word into another) — also a DP table.
          </>
        }
        appearsIn={['swe chapter git operations', 'bioinformatics tools', 'compiler error recovery']}
        hook="You have the tools to analyze algorithms. But what does O(n²) actually mean in practice? Next: Big-O notation."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to Big-O
        </button>
        {!isDone && (
          <span className="hint">
            Complete both the Knapsack and LCS tables with tracebacks.
          </span>
        )}
      </div>
    </div>
  )
}
