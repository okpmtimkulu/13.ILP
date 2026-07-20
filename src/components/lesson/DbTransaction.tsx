import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase =
  | 'idle'
  | 'begin'
  | 'deduct'
  | 'credit'
  | 'crash'
  | 'corrupted'
  | 'replay-begin'
  | 'replay-deduct'
  | 'replay-credit'
  | 'replay-crash'
  | 'rollback'
  | 'commit-begin'
  | 'commit-deduct'
  | 'commit-credit'
  | 'commit-done'

const DELAY = 900

function AccountBox({ name, balance, highlight }: { name: string; balance: number; highlight?: boolean }) {
  return (
    <motion.div
      className="db-txn-account"
      animate={{ scale: highlight ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <span className="db-txn-account-name">{name}</span>
      <motion.span
        className="db-txn-account-balance"
        key={balance}
        initial={{ scale: 1.3, color: '#f59e0b' }}
        animate={{ scale: 1, color: '#e2e8f0' }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        ${balance}
      </motion.span>
    </motion.div>
  )
}

const WAL_LINES: Record<string, string> = {
  begin: '[BEGIN]',
  deduct: '[WRITE] users SET balance=800 WHERE id=1  (was 1000)',
  credit: '[WRITE] users SET balance=700 WHERE id=2  (was 500)',
  crash: '[CRASH — WAL incomplete]',
  rollback: '[ROLLBACK] restoring balance=1000 WHERE id=1\n[ROLLBACK] restoring balance=500 WHERE id=2\n[ABORT]',
  commit: '[COMMIT]',
}

export function DbTransaction({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [walLines, setWalLines] = useState<string[]>([])
  const [crashSeen, setCrashSeen] = useState(false)
  const [rollbackSeen, setRollbackSeen] = useState(false)
  const [commitSeen, setCommitSeen] = useState(false)
  const [done, setDone] = useState(false)

  const appendWal = (line: string) => setWalLines((prev) => [...prev, line])

  const runWithoutTxn = () => {
    setPhase('begin')
    setWalLines([])
    setTimeout(() => {
      setPhase('deduct')
      setTimeout(() => {
        setPhase('credit')
        setTimeout(() => {
          setPhase('crash')
          setCrashSeen(true)
          setTimeout(() => setPhase('corrupted'), DELAY)
        }, DELAY)
      }, DELAY)
    }, DELAY)
  }

  const runWithTxn = () => {
    setPhase('replay-begin')
    setWalLines([WAL_LINES.begin])
    setTimeout(() => {
      setPhase('replay-deduct')
      appendWal(WAL_LINES.deduct)
      setTimeout(() => {
        setPhase('replay-credit')
        appendWal(WAL_LINES.credit)
        setTimeout(() => {
          setPhase('replay-crash')
          appendWal(WAL_LINES.crash)
          setTimeout(() => {
            setPhase('rollback')
            appendWal(WAL_LINES.rollback)
            setRollbackSeen(true)
          }, DELAY)
        }, DELAY)
      }, DELAY)
    }, DELAY)
  }

  const runCommit = () => {
    setPhase('commit-begin')
    setWalLines([WAL_LINES.begin])
    setTimeout(() => {
      setPhase('commit-deduct')
      appendWal(WAL_LINES.deduct)
      setTimeout(() => {
        setPhase('commit-credit')
        appendWal(WAL_LINES.credit)
        setTimeout(() => {
          setPhase('commit-done')
          appendWal(WAL_LINES.commit)
          setCommitSeen(true)
        }, DELAY)
      }, DELAY)
    }, DELAY)
  }

  // Account balances per phase
  const alice = (() => {
    if (['deduct', 'corrupted'].includes(phase)) return 800
    if (['replay-deduct', 'replay-crash'].includes(phase)) return 800
    if (phase === 'commit-deduct' || phase === 'commit-credit' || phase === 'commit-done') return 800
    return 1000
  })()

  const bob = (() => {
    if (phase === 'corrupted') return 700
    if (phase === 'credit') return 700
    if (phase === 'replay-credit' || phase === 'replay-crash') return 700
    if (phase === 'commit-credit' || phase === 'commit-done') return 700
    return 500
  })()

  const isCrash = phase === 'crash' || phase === 'replay-crash'
  const isRollback = phase === 'rollback'

  return (
    <div className="lesson-panel">
      <p className="lede">
        Transfer $200 from Alice to Bob. Watch what happens when the database crashes halfway through — with and without
        a transaction.
      </p>

      <div className="db-txn-stage">
        <div className="db-txn-accounts">
          <AccountBox name="Alice" balance={alice} highlight={phase.includes('deduct')} />
          <div className="db-txn-arrow">→ $200 →</div>
          <AccountBox name="Bob" balance={bob} highlight={phase.includes('credit')} />
        </div>

        <AnimatePresence>
          {isCrash && (
            <motion.div
              className="db-txn-crash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              CRASH
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'corrupted' && (
          <motion.div
            className="db-txn-corrupt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Without transaction: Bob has $700, Alice has $800 — but total is $1500 (was $1500, OK here). However if crash happened after deduct only: Bob=$500, Alice=$800 — $200 vanished.
          </motion.div>
        )}

        {isRollback && (
          <motion.div
            className="db-txn-rollback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            ROLLBACK: both accounts restored to original values. No money created or lost.
          </motion.div>
        )}

        {walLines.length > 0 && (
          <div className="db-txn-wal">
            <p className="micro">Write-Ahead Log (WAL)</p>
            {walLines.map((line, i) => (
              <motion.div
                key={i}
                className="db-txn-wal-line"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        )}

        <div className="db-txn-status">
          {phase === 'idle' && <span className="micro">Click to begin the simulation</span>}
          {phase === 'begin' && <span>BEGIN (no transaction, direct writes)</span>}
          {phase === 'deduct' && <span>Deducting $200 from Alice...</span>}
          {phase === 'credit' && <span>Adding $200 to Bob...</span>}
          {phase === 'crash' && <span className="db-txn-status--error">CRASH during credit step!</span>}
          {phase === 'corrupted' && <span className="db-txn-status--error">Data inconsistent. No rollback possible.</span>}
          {phase === 'replay-begin' && <span>BEGIN TRANSACTION</span>}
          {phase === 'replay-deduct' && <span>Deducting $200 from Alice (WAL written)...</span>}
          {phase === 'replay-credit' && <span>Adding $200 to Bob (WAL written)...</span>}
          {phase === 'replay-crash' && <span className="db-txn-status--error">CRASH — but WAL exists!</span>}
          {phase === 'rollback' && <span className="db-txn-status--ok">ROLLBACK complete. Accounts restored.</span>}
          {phase === 'commit-begin' && <span>BEGIN TRANSACTION</span>}
          {phase === 'commit-deduct' && <span>Deducting $200 from Alice...</span>}
          {phase === 'commit-credit' && <span>Adding $200 to Bob...</span>}
          {phase === 'commit-done' && <span className="db-txn-status--ok">COMMIT. Transfer complete. Alice=$800, Bob=$700.</span>}
        </div>
      </div>

      <div className="lesson-actions">
        {phase === 'idle' && (
          <button type="button" className="btn primary" onClick={runWithoutTxn}>
            Run without transaction (crash)
          </button>
        )}
        {phase === 'corrupted' && !rollbackSeen && (
          <button type="button" className="btn primary" onClick={runWithTxn}>
            Replay with transaction (crash + rollback)
          </button>
        )}
        {phase === 'rollback' && !commitSeen && (
          <button type="button" className="btn primary" onClick={runCommit}>
            Replay with transaction (successful commit)
          </button>
        )}
        {phase === 'commit-done' && !done && (
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
        {!crashSeen && phase !== 'idle' && (
          <span className="hint">Simulation running...</span>
        )}
      </div>

      {commitSeen && (
        <ConnectionCard
          title="Every financial system relies on transactions"
          body={
            <>
              Without transactions, a crash between a debit and a credit creates or destroys money. Every bank transfer,
              e-commerce order, and inventory update uses the same BEGIN / write / COMMIT / ROLLBACK pattern you just
              watched.
            </>
          }
          appearsIn={['banking systems', 'e-commerce checkouts', 'inventory management']}
          hook="Transactions protect single-database writes. What properties make a transaction trustworthy? That is ACID."
        />
      )}
    </div>
  )
}
