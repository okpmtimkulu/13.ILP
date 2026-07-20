import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Commit = { id: string; msg: string; parent: string | null; branch: string; x: number; y: number }

const INITIAL_COMMITS: Commit[] = [
  { id: 'a1b2c3', msg: 'Initial commit', parent: null, branch: 'main', x: 60, y: 60 },
]

const PRESET_MESSAGES = ['Fix bug in login', 'Add search feature', 'Update styles']

function shortId(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function SweGit({ onComplete }: { onComplete: () => void }) {
  const [commits, setCommits] = useState<Commit[]>(INITIAL_COMMITS)
  const [currentBranch, setCurrentBranch] = useState('main')
  const [hasBranch, setHasBranch] = useState(false)
  const [merged, setMerged] = useState(false)
  const [conflictResolved, setConflictResolved] = useState(false)
  const [conflictChoice, setConflictChoice] = useState<'ours' | 'theirs' | null>(null)
  const [showLog, setShowLog] = useState(false)
  const [done, setDone] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)

  const mainCommits = commits.filter((c) => c.branch === 'main')
  const branchCommits = commits.filter((c) => c.branch === 'feature')

  const addCommit = () => {
    const parent = commits.filter((c) => c.branch === currentBranch).at(-1) ?? commits.at(-1)!
    const msg = currentBranch === 'main' ? PRESET_MESSAGES[msgIdx % PRESET_MESSAGES.length] : 'Feature work'
    const newCommit: Commit = {
      id: shortId(),
      msg,
      parent: parent.id,
      branch: currentBranch,
      x: currentBranch === 'main' ? parent.x + 80 : parent.x + 80,
      y: currentBranch === 'main' ? 60 : 130,
    }
    setCommits((prev) => [...prev, newCommit])
    if (currentBranch === 'main') setMsgIdx((i) => i + 1)
  }

  const createBranch = () => {
    setHasBranch(true)
    setCurrentBranch('feature')
  }

  const merge = () => {
    if (!conflictChoice) return
    const lastMain = commits.filter((c) => c.branch === 'main').at(-1)!
    const mergeCommit: Commit = {
      id: shortId(),
      msg: `Merge feature into main (kept ${conflictChoice === 'ours' ? 'main' : 'feature'} version)`,
      parent: lastMain.id,
      branch: 'main',
      x: lastMain.x + 80,
      y: 60,
    }
    setCommits((prev) => [...prev, mergeCommit])
    setMerged(true)
    setConflictResolved(true)
    setCurrentBranch('main')
  }

  const branchCommitsExist = branchCommits.length > 0
  const mainCommitsCount = mainCommits.length
  const readyToMerge = hasBranch && branchCommitsExist && mainCommitsCount >= 2 && !merged
  const canComplete = merged && conflictResolved

  // Layout: spread commits horizontally
  const sortedCommits = [...commits].sort((a, b) => {
    // Order by branch then creation
    const aIdx = commits.indexOf(a)
    const bIdx = commits.indexOf(b)
    return aIdx - bIdx
  })

  return (
    <div className="lesson-panel">
      <p className="lede">
        Git tracks changes as a <strong>directed acyclic graph</strong> (DAG) of commits — the same data structure from
        the DSA chapter. Each commit points to its parent.
      </p>

      <div className="swe-git-stage">
        <div className="swe-git-graph-wrap">
          <svg className="swe-git-graph" viewBox="0 0 600 200" aria-label="Commit graph">
            {/* Branch line */}
            {hasBranch && (
              <line x1="140" y1="60" x2="140" y2="130" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
            )}
            {/* Merge line */}
            {merged && branchCommits.length > 0 && (
              <line
                x1={branchCommits.at(-1)!.x}
                y1="130"
                x2={commits.at(-1)!.x}
                y2="60"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
            )}
            {/* Commit edges */}
            {commits.map((c) => {
              if (!c.parent) return null
              const parent = commits.find((p) => p.id === c.parent)
              if (!parent) return null
              return (
                <line
                  key={`edge-${c.id}`}
                  x1={parent.x}
                  y1={parent.y}
                  x2={c.x}
                  y2={c.y}
                  stroke={c.branch === 'feature' ? '#6366f1' : '#38bdf8'}
                  strokeWidth="2"
                />
              )
            })}
            {/* Commit nodes */}
            {commits.map((c) => (
              <g key={c.id}>
                <motion.circle
                  cx={c.x}
                  cy={c.y}
                  r={12}
                  fill={c.branch === 'feature' ? '#6366f1' : '#38bdf8'}
                  initial={{ r: 0 }}
                  animate={{ r: 12 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
                <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="7" fill="white" fontFamily="monospace">
                  {c.id.slice(0, 4)}
                </text>
                <text x={c.x} y={c.y + 22} textAnchor="middle" fontSize="7" fill="#94a3b8">
                  {c.msg.slice(0, 14)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="swe-git-actions">
          <div className="swe-git-branch-info">
            <span className="micro">Current branch: <strong>{currentBranch}</strong></span>
          </div>

          <button type="button" className="btn primary" onClick={addCommit}>
            Commit: "{currentBranch === 'main' ? PRESET_MESSAGES[msgIdx % PRESET_MESSAGES.length] : 'Feature work'}"
          </button>

          {!hasBranch && mainCommitsCount >= 2 && (
            <button type="button" className="btn primary" onClick={createBranch}>
              Create feature branch
            </button>
          )}

          {hasBranch && currentBranch === 'feature' && branchCommitsExist && !merged && (
            <button type="button" className="btn primary" onClick={() => setCurrentBranch('main')}>
              Switch to main
            </button>
          )}
        </div>

        {readyToMerge && !conflictChoice && (
          <motion.div
            className="swe-git-conflict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Conflict: both branches modified styles.css line 42. Choose version to keep:</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn primary" onClick={() => setConflictChoice('ours')}>
                Keep main version
              </button>
              <button type="button" className="btn primary" onClick={() => setConflictChoice('theirs')}>
                Keep feature version
              </button>
            </div>
          </motion.div>
        )}

        {conflictChoice && !merged && (
          <button type="button" className="btn primary" onClick={merge}>
            Merge feature into main
          </button>
        )}

        <button
          type="button"
          className="btn primary"
          style={{ background: 'var(--surface-3)' }}
          onClick={() => setShowLog((v) => !v)}
        >
          {showLog ? 'Hide' : 'Show'} git log
        </button>

        <AnimatePresence>
          {showLog && (
            <motion.div
              className="swe-git-log"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {[...commits].reverse().map((c) => (
                <div key={c.id} className="swe-git-log-entry">
                  <code className="swe-git-log-hash">{c.id}</code>
                  <span className="swe-git-log-branch">[{c.branch}]</span>
                  <span>{c.msg}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lesson-actions">
        {canComplete && !done && (
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
        {!canComplete && (
          <span className="hint">
            {mainCommitsCount < 2
              ? 'Make at least 2 commits on main'
              : !hasBranch
              ? 'Create a feature branch'
              : !branchCommitsExist
              ? 'Make a commit on the feature branch'
              : !conflictResolved
              ? 'Resolve the conflict and merge'
              : ''}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="Git's commit graph is a DAG — the same data structure from the DSA chapter"
          body={
            <>
              Every commit is a node, every parent pointer is a directed edge, and merges create nodes with two parents.
              Git uses SHA-256 hashes (from the Security chapter) to identify commits — changing one byte changes the
              entire hash and invalidates every descendant.
            </>
          }
          appearsIn={['every software project', 'GitHub/GitLab pull requests', 'continuous integration']}
          hook="Git tracks history. Tests prove behavior. Without tests, you cannot know if the history is correct."
        />
      )}
    </div>
  )
}
