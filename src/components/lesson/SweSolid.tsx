import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Principle = 'S' | 'O' | 'L' | 'I' | 'D'

const PRINCIPLES = [
  {
    id: 'S' as Principle,
    name: 'Single Responsibility',
    desc: 'A class should have one reason to change.',
    before: `class UserManager {
  login(user) { ... }
  sendWelcomeEmail(user) { ... }
  generatePDF(user) { ... }
  // 3 reasons to change!
}`,
    after: `class AuthService   { login(user) { ... } }
class EmailService  { sendWelcome(user) { ... } }
class PDFService    { generate(user) { ... } }
// Each has exactly one reason to change`,
    insight: 'Split into 3 classes. Each has exactly one reason to change.',
  },
  {
    id: 'O' as Principle,
    name: 'Open / Closed',
    desc: 'Open for extension, closed for modification.',
    before: `function area(shape) {
  if (shape.type === 'circle') return Math.PI * r*r
  if (shape.type === 'rect')   return w * h
  // Add triangle → MODIFY this function
}`,
    after: `class Circle    { area() { return Math.PI * r*r } }
class Rectangle { area() { return w * h } }
class Triangle  { area() { return 0.5 * b * h } }
// Add new shape → new class, no existing code touched`,
    insight: 'New shapes extend the system without touching existing code.',
  },
  {
    id: 'L' as Principle,
    name: 'Liskov Substitution',
    desc: 'Subtypes must be substitutable for their base type.',
    before: `class Rectangle { setWidth(w)  { this.w = w } }
class Square extends Rectangle {
  setWidth(w) {
    this.w = w; this.h = w // breaks Rectangle!
  }
}
// rect.setWidth(5) → area = 5*5 = 25 (expected 5*10=50)`,
    after: `// Square should NOT extend Rectangle — different behavior.
// Both should implement a Shape interface with area().
// LSP: a caller using Rectangle must be able to use
// any subtype without knowing — Square violates this.`,
    insight: 'Square violates LSP by changing the contract of Rectangle.setWidth().',
  },
  {
    id: 'I' as Principle,
    name: 'Interface Segregation',
    desc: 'Clients should not be forced to depend on interfaces they do not use.',
    before: `interface IAnimal {
  eat(): void
  fly(): void   // Dog is forced to implement this
  swim(): void  // Eagle is forced to implement this
}`,
    after: `interface IEater   { eat(): void }
interface IFlyer   { fly(): void }
interface ISwimmer { swim(): void }
// Dog implements IEater + ISwimmer — not IFlyer
// Eagle implements IEater + IFlyer — not ISwimmer`,
    insight: 'Narrow interfaces: each animal only implements what it actually does.',
  },
  {
    id: 'D' as Principle,
    name: 'Dependency Inversion',
    desc: 'Depend on abstractions, not concretions.',
    before: `class OrderController {
  db = new MySQLDatabase() // concrete dependency
  save(order) { this.db.save(order) }
  // Switching to PostgreSQL = rewrite this class
}`,
    after: `interface IDatabase { save(data): void }
class MySQLDB implements IDatabase { ... }
class PostgresDB implements IDatabase { ... }

class OrderController {
  constructor(private db: IDatabase) {} // injected
  // Works with any IDatabase — MySQL, Postgres, mock
}`,
    insight: 'Controller depends on the interface, not the MySQL class. Swap databases without touching controller.',
  },
]

export function SweSolid({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState<Principle>('S')
  const [seen, setSeen] = useState<Set<Principle>>(new Set(['S']))
  const [showAfter, setShowAfter] = useState<Set<Principle>>(new Set())
  const [done, setDone] = useState(false)

  const switchTab = (p: Principle) => {
    setActive(p)
    setSeen((prev) => new Set([...prev, p]))
  }

  const toggleAfter = (p: Principle) => {
    setShowAfter((prev) => {
      const next = new Set(prev)
      if (next.has(p)) next.delete(p)
      else next.add(p)
      return next
    })
  }

  const allSeen = seen.size === 5
  const principle = PRINCIPLES.find((p) => p.id === active)!
  const isAfter = showAfter.has(active)

  return (
    <div className="lesson-panel">
      <p className="lede">
        SOLID is five principles that keep large codebases maintainable. Each principle prevents a specific class of
        design mistake.
      </p>

      <div className="swe-solid-tabs">
        {PRINCIPLES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`db-acid-tab ${active === p.id ? 'db-acid-tab--active' : ''} ${seen.has(p.id) ? 'db-acid-tab--seen' : ''}`}
            onClick={() => switchTab(p.id)}
          >
            <span className="swe-solid-letter">{p.id}</span>
            <span className="micro">{p.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="swe-solid-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <p className="lede">{principle.desc}</p>

          <div className="swe-solid-toggle">
            <button
              type="button"
              className={`db-acid-tab ${!isAfter ? 'db-acid-tab--active' : ''}`}
              onClick={() => { if (isAfter) toggleAfter(active) }}
            >
              Before
            </button>
            <button
              type="button"
              className={`db-acid-tab ${isAfter ? 'db-acid-tab--active' : ''}`}
              onClick={() => toggleAfter(active)}
            >
              After
            </button>
          </div>

          <pre className="par-types-code">
            {isAfter ? principle.after : principle.before}
          </pre>

          {isAfter && (
            <motion.p
              className="swe-solid-insight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {principle.insight}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="lesson-actions">
        {allSeen && !done && (
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
        {!allSeen && (
          <span className="hint">View all 5 principles to continue ({seen.size}/5 seen)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="SOLID makes codebases survivable at 100K+ lines"
          body={
            <>
              Without SOLID, every change breaks something else. The principles are not rules — they are descriptions of
              how software that has survived at scale tends to be organized. Violate them knowingly, not ignorantly.
            </>
          }
          appearsIn={['object-oriented design', 'clean architecture', 'enterprise software']}
          hook="SOLID shapes classes. Design patterns solve recurring problems between classes. Three of the most important: next."
        />
      )}
    </div>
  )
}
