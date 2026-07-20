import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

export function ParEncapsulation({ onComplete }: { onComplete: () => void }) {
  const [isPrivate, setIsPrivate] = useState(false)
  const [directValue, setDirectValue] = useState('')
  const [directError, setDirectError] = useState<string | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('200')
  const [balance, setBalance] = useState(1000)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)
  const [withdrawOk, setWithdrawOk] = useState(false)
  const [invariantViolated, setInvariantViolated] = useState(false)
  const [done, setDone] = useState(false)

  const seenPrivateRejection = directError !== null && isPrivate
  const seenInvariant = withdrawError !== null || withdrawOk

  const handleDirectAssign = () => {
    const val = Number(directValue)
    if (isPrivate) {
      setDirectError('TypeError: cannot set private field #balance outside of class BankAccount')
    } else {
      setBalance(val)
      setDirectError(null)
      if (val < 0) setInvariantViolated(true)
    }
  }

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount)
    if (amount > balance) {
      setWithdrawError(`Error: insufficient funds — balance is $${balance}, requested $${amount}`)
      setWithdrawOk(false)
    } else if (amount <= 0) {
      setWithdrawError('Error: amount must be positive')
      setWithdrawOk(false)
    } else {
      setBalance((b) => b - amount)
      setWithdrawError(null)
      setWithdrawOk(true)
    }
  }

  const readyToContinue = seenPrivateRejection && seenInvariant

  return (
    <div className="lesson-panel">
      <p className="lede">
        Encapsulation keeps an object's internal state valid by controlling how it is accessed. A{' '}
        <strong>private</strong> field can only be changed through methods that enforce rules — invariants.
      </p>

      <div className="par-enc-stage">
        <div className="par-enc-object">
          <div className="par-enc-header">
            <span className="par-oop-instance-id">alice_acct</span>
            <div className="par-enc-toggle">
              <button
                type="button"
                className={`db-acid-toggle-btn ${!isPrivate ? 'db-acid-toggle-btn--off' : 'db-acid-toggle-btn--on'}`}
                onClick={() => {
                  setIsPrivate((p) => !p)
                  setDirectError(null)
                  setWithdrawError(null)
                  setWithdrawOk(false)
                }}
              >
                balance: {isPrivate ? 'private' : 'public'}
              </button>
            </div>
          </div>

          <div className="par-enc-balance">
            <motion.span
              key={balance}
              className="par-enc-balance-val"
              animate={{ scale: [1.15, 1] }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              ${balance}
            </motion.span>
            {!isPrivate && invariantViolated && (
              <span className="sec-owasp-result--danger"> NEGATIVE BALANCE — invariant violated!</span>
            )}
          </div>
        </div>

        <div className="par-enc-panels">
          {/* Direct access */}
          <div className="par-enc-panel">
            <h4>Direct field access</h4>
            <code className="micro">alice_acct.balance = </code>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem' }}>
              <input
                className="par-imp-blank"
                value={directValue}
                onChange={(e) => setDirectValue(e.target.value)}
                placeholder="-1000"
                style={{ width: '6rem' }}
              />
              <button type="button" className="btn primary" onClick={handleDirectAssign} disabled={!directValue}>
                Assign
              </button>
            </div>

            <AnimatePresence>
              {directError && (
                <motion.p
                  className="par-enc-error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {directError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Method access */}
          <div className="par-enc-panel">
            <h4>Via withdraw() method</h4>
            <code className="micro">alice_acct.withdraw(</code>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem' }}>
              <input
                className="par-imp-blank"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{ width: '6rem' }}
              />
              <button type="button" className="btn primary" onClick={handleWithdraw}>
                Call withdraw()
              </button>
            </div>

            <AnimatePresence>
              {withdrawError && (
                <motion.p
                  className="par-enc-error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {withdrawError}
                </motion.p>
              )}
              {withdrawOk && (
                <motion.p
                  className="db-acid-ok"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  Withdrawal of ${withdrawAmount} succeeded. Balance is ${balance}.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="par-enc-invariant">
          <motion.div
            className={`par-enc-invariant-badge ${balance >= 0 && !invariantViolated ? 'par-enc-invariant-badge--ok' : 'par-enc-invariant-badge--fail'}`}
            animate={{ scale: invariantViolated ? [1.1, 1] : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Invariant: balance ≥ 0 — {balance >= 0 && !invariantViolated ? 'SATISFIED' : 'VIOLATED'}
          </motion.div>
          {isPrivate && (
            <p className="micro" style={{ marginTop: '0.35rem' }}>
              Private field: only <code>withdraw()</code> and <code>deposit()</code> can change balance —
              and they enforce the invariant. The object's state is always valid.
            </p>
          )}
        </div>
      </div>

      <div className="lesson-actions">
        {readyToContinue && !done && (
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
        {!readyToContinue && (
          <span className="hint">
            {!isPrivate
              ? 'Toggle balance to private, then try direct assignment'
              : !seenPrivateRejection
              ? 'Assign a value directly to see the private field error'
              : !seenInvariant
              ? 'Try withdrawing more than the balance'
              : ''}
          </span>
        )}
      </div>

      {readyToContinue && (
        <ConnectionCard
          title="Invariants are why you can trust APIs"
          body={
            <>
              If BankAccount guarantees balance ≥ 0, every piece of code using it can rely on that — without checking.
              Invariants reduce the mental load of programming by limiting what can go wrong inside a module.
              Breaking encapsulation breaks the invariant and breaks everyone who depends on it.
            </>
          }
          appearsIn={['TypeScript private fields', 'Java access modifiers', 'design by contract']}
          hook="OOP organizes around mutable objects. Functional programming takes the opposite approach: no mutation at all."
        />
      )}
    </div>
  )
}
