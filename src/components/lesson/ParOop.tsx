import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type ClassDef = {
  name: string
  attributes: string[]
  methods: string[]
  parent?: string
}

type Instance = {
  id: string
  owner: string
  balance: number
  type: 'BankAccount' | 'SavingsAccount'
  interestRate?: number
}

export function ParOop({ onComplete }: { onComplete: () => void }) {
  const [className, setClassName] = useState('')
  const [attributesDone, setAttributesDone] = useState(false)
  const [methodsDone, setMethodsDone] = useState(false)
  const [instances, setInstances] = useState<Instance[]>([])
  const [inheritanceDone, setInheritanceDone] = useState(false)
  const [polyDone, setPolyDone] = useState(false)
  const [done, setDone] = useState(false)

  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null)

  const classNameCorrect = className.trim() === 'BankAccount'

  const addInstance = (type: 'BankAccount' | 'SavingsAccount') => {
    const names = ['alice_acct', 'bob_acct', 'carol_savings']
    const owner = type === 'SavingsAccount' ? 'carol' : instances.length === 0 ? 'alice' : 'bob'
    setInstances((prev) => [
      ...prev,
      {
        id: names[prev.length] ?? `acct_${prev.length}`,
        owner,
        balance: type === 'SavingsAccount' ? 5000 : 1000,
        type,
        interestRate: type === 'SavingsAccount' ? 0.03 : undefined,
      },
    ])
  }

  const withdraw = (id: string, amount: number) => {
    setInstances((prev) =>
      prev.map((inst) => {
        if (inst.id !== id) return inst
        if (inst.type === 'SavingsAccount' && inst.balance - amount < 500) {
          return { ...inst }
        }
        if (inst.balance >= amount) {
          return { ...inst, balance: inst.balance - amount }
        }
        return inst
      })
    )
    setWithdrawTarget(id)
    setTimeout(() => setWithdrawTarget(null), 800)
    setPolyDone(true)
  }

  const twoInstancesExist = instances.filter((i) => i.type === 'BankAccount').length >= 2
  const savingsExists = instances.some((i) => i.type === 'SavingsAccount')
  const readyToContinue = polyDone && savingsExists && twoInstancesExist

  return (
    <div className="lesson-panel">
      <p className="lede">
        Object-oriented programming bundles data and behavior together into <strong>classes</strong>. Each instance has
        its own state. Subclasses inherit and extend behavior.
      </p>

      <div className="par-oop-stage">
        {/* Step 1: Name the class */}
        <div className="par-oop-step">
          <h4>1. Name the class</h4>
          <div className="par-imp-line">
            <code>class </code>
            <input
              className="par-imp-blank"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="BankAccount"
              style={{ width: '10rem' }}
            />
            {classNameCorrect && <span className="db-acid-ok"> ✓</span>}
          </div>
        </div>

        {classNameCorrect && (
          <motion.div
            className="par-oop-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h4>2. Define attributes and methods</h4>
            <div className="par-oop-class-box">
              <div className="par-oop-section">
                <strong>Attributes</strong>
                <div className="par-oop-attr">balance: number</div>
                <div className="par-oop-attr">owner: string</div>
                {!attributesDone && (
                  <button type="button" className="btn primary" onClick={() => setAttributesDone(true)}>
                    Confirm attributes
                  </button>
                )}
                {attributesDone && <span className="db-acid-ok">✓ confirmed</span>}
              </div>
              <div className="par-oop-section">
                <strong>Methods</strong>
                <div className="par-oop-method">deposit(amount: number)</div>
                <div className="par-oop-method">withdraw(amount: number)</div>
                <div className="par-oop-method">getBalance(): number</div>
                {!methodsDone && attributesDone && (
                  <button type="button" className="btn primary" onClick={() => setMethodsDone(true)}>
                    Confirm methods
                  </button>
                )}
                {methodsDone && <span className="db-acid-ok">✓ confirmed</span>}
              </div>
            </div>
          </motion.div>
        )}

        {methodsDone && (
          <motion.div
            className="par-oop-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h4>3. Create instances</h4>
            <div className="par-oop-instances">
              {instances.map((inst) => (
                <motion.div
                  key={inst.id}
                  className={`par-oop-instance ${inst.type === 'SavingsAccount' ? 'par-oop-instance--savings' : ''}`}
                  animate={{ scale: withdrawTarget === inst.id ? 1.04 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="par-oop-instance-id">{inst.id}</span>
                  <span className="micro">{inst.type}{inst.interestRate ? ` (rate: ${inst.interestRate * 100}%)` : ''}</span>
                  <span>Balance: <strong>${inst.balance}</strong></span>
                  <div className="par-oop-instance-actions">
                    <button type="button" className="btn primary" onClick={() => withdraw(inst.id, 200)}>
                      withdraw($200)
                    </button>
                  </div>
                </motion.div>
              ))}
              <div className="par-oop-new-btns">
                {instances.filter((i) => i.type === 'BankAccount').length < 2 && (
                  <button type="button" className="btn primary" onClick={() => addInstance('BankAccount')}>
                    new BankAccount()
                  </button>
                )}
                {!savingsExists && twoInstancesExist && (
                  <button type="button" className="btn primary" onClick={() => addInstance('SavingsAccount')}>
                    new SavingsAccount() (extends BankAccount)
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {savingsExists && !inheritanceDone && (
          <motion.div
            className="par-oop-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="par-oop-inheritance">
              <pre className="db-norm-sql">{`class SavingsAccount extends BankAccount {
  interestRate: number = 0.03

  // Override: disallow if balance would fall below $500
  withdraw(amount: number) {
    if (this.balance - amount < 500) {
      throw new Error("Minimum balance required")
    }
    super.withdraw(amount)
  }
}`}</pre>
              <button type="button" className="btn primary" onClick={() => setInheritanceDone(true)}>
                Understand inheritance
              </button>
            </div>
          </motion.div>
        )}

        {inheritanceDone && (
          <div className="par-oop-step">
            <p className="micro">
              Call <code>withdraw()</code> on both types — same method name, different behavior (polymorphism).
            </p>
          </div>
        )}
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
            {!classNameCorrect
              ? 'Name the class "BankAccount"'
              : !methodsDone
              ? 'Confirm attributes and methods'
              : !twoInstancesExist
              ? 'Create two BankAccount instances'
              : !savingsExists
              ? 'Create a SavingsAccount (inheritance)'
              : 'Call withdraw() on both instance types'}
          </span>
        )}
      </div>

      {readyToContinue && (
        <ConnectionCard
          title="Every professional language — Python, TypeScript, Java, C# — is built around this pattern"
          body={
            <>
              OOP organizes large codebases by grouping related data and behavior together. Inheritance and polymorphism
              let you extend behavior without rewriting it. The same class can be used in contexts the original author
              never anticipated.
            </>
          }
          appearsIn={['Python classes', 'TypeScript interfaces', 'Java inheritance hierarchies']}
          hook="Objects bundle state and behavior. But unrestricted access to that state breaks the guarantees. Next: encapsulation."
        />
      )}
    </div>
  )
}
