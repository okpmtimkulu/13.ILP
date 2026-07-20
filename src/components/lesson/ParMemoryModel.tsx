import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Lang = 'c' | 'java' | 'rust'

export function ParMemoryModel({ onComplete }: { onComplete: () => void }) {
  const [activeLang, setActiveLang] = useState<Lang>('c')
  const [seen, setSeen] = useState<Set<Lang>>(new Set(['c']))
  const [cStep, setCStep] = useState<'malloc' | 'use' | 'forget' | 'double-free'>('malloc')
  const [gcRunning, setGcRunning] = useState(false)
  const [gcDone, setGcDone] = useState(false)
  const [rustMoved, setRustMoved] = useState(false)
  const [done, setDone] = useState(false)

  const switchLang = (l: Lang) => {
    setActiveLang(l)
    setSeen((prev) => new Set([...prev, l]))
  }

  const allSeen = seen.size === 3

  const runGc = () => {
    setGcRunning(true)
    setTimeout(() => {
      setGcRunning(false)
      setGcDone(true)
    }, 1200)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Every language decides who is responsible for memory. C makes the programmer do it manually. Java and Python
        use a garbage collector. Rust uses compile-time ownership rules — no GC, no crashes.
      </p>

      <div className="par-mem-tabs">
        {(['c', 'java', 'rust'] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            className={`db-acid-tab ${activeLang === l ? 'db-acid-tab--active' : ''} ${seen.has(l) ? 'db-acid-tab--seen' : ''}`}
            onClick={() => switchLang(l)}
          >
            {l === 'c' ? 'C (manual)' : l === 'java' ? 'Java / Python (GC)' : 'Rust (ownership)'}
          </button>
        ))}
      </div>

      {activeLang === 'c' && (
        <motion.div
          key="c"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <pre className="par-types-code">{`int *list = malloc(10 * sizeof(int)); // allocate
list[0] = 42;                         // use
// ... later:
// forgot to call free(list) ← MEMORY LEAK`}</pre>

          <div className="par-mem-heap">
            <p className="micro">Heap:</p>
            <div className="par-mem-heap-bar">
              <motion.div
                className="par-mem-heap-used"
                animate={{ width: cStep === 'malloc' || cStep === 'use' || cStep === 'forget' ? '40px' : '0px' }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              />
              {cStep === 'forget' && (
                <motion.div
                  className="par-mem-heap-leak"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  leaked
                </motion.div>
              )}
            </div>
          </div>

          <div className="par-mem-steps">
            <button type="button" className="btn primary" disabled={cStep !== 'malloc'} onClick={() => setCStep('use')}>
              malloc()
            </button>
            <button type="button" className="btn primary" disabled={cStep !== 'use'} onClick={() => setCStep('forget')}>
              Use list[]
            </button>
            <button type="button" className="btn primary" disabled={cStep !== 'forget'} onClick={() => setCStep('double-free')}>
              Skip free() → LEAK
            </button>
            {cStep === 'double-free' && (
              <motion.p
                className="par-enc-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                If free() is called twice: double-free → undefined behavior → crash or security vulnerability.
              </motion.p>
            )}
          </div>
        </motion.div>
      )}

      {activeLang === 'java' && (
        <motion.div
          key="java"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <pre className="par-types-code">{`List<Integer> list = new ArrayList<>(); // allocated
list.add(42);
// list goes out of scope
// GC collects it automatically — no free() needed`}</pre>

          <div className="par-mem-heap">
            <p className="micro">Heap (GC-managed):</p>
            <div className="par-mem-heap-bar">
              <motion.div
                className="par-mem-heap-used"
                animate={{ width: gcDone ? '10px' : '60px' }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              />
              {gcRunning && (
                <motion.div
                  className="par-mem-gc-label"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  GC running (stop-the-world pause)
                </motion.div>
              )}
              {gcDone && <span className="db-acid-ok" style={{ marginLeft: '0.5rem' }}>collected</span>}
            </div>
          </div>

          <button type="button" className="btn primary" onClick={runGc} disabled={gcRunning || gcDone}>
            Trigger garbage collection
          </button>

          {gcDone && (
            <motion.p
              className="micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              GC complete. Heap reclaimed. But GC ran for 40ms — your app paused. This is "stop the world".
              (Python uses reference counting instead, but the tradeoff is similar.)
            </motion.p>
          )}
        </motion.div>
      )}

      {activeLang === 'rust' && (
        <motion.div
          key="rust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <pre className="par-types-code">{`let v = vec![1, 2, 3];  // v owns the vector
append_to(v);            // ownership MOVES to function
println!("{:?}", v);     // ERROR: value used after move`}</pre>

          <button type="button" className="btn primary" onClick={() => setRustMoved(true)} disabled={rustMoved}>
            Compile (attempt to use v after move)
          </button>

          {rustMoved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="par-enc-error">
                error[E0382]: borrow of moved value: `v`<br />
                → use of moved value: `v` — memory freed when `append_to` returned<br />
                — caught at compile time, no runtime cost
              </p>
              <p className="micro" style={{ marginTop: '0.5rem' }}>
                Rust's borrow checker enforces ownership at compile time. Memory is freed when the owner goes out of
                scope — no GC pause, no crash, no leak.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="par-mem-tradeoffs">
        <div className="par-mem-card">
          <strong>C</strong>
          <p className="micro">Fast. No overhead. Dangerous: memory leaks and use-after-free are your problem.</p>
        </div>
        <div className="par-mem-card">
          <strong>Java / Python</strong>
          <p className="micro">Safe. Convenient. GC pauses. Higher memory usage. Suitable for most applications.</p>
        </div>
        <div className="par-mem-card">
          <strong>Rust</strong>
          <p className="micro">Fast + safe. Ownership rules at compile time. Steep learning curve. No GC, no crashes.</p>
        </div>
      </div>

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
          <span className="hint">View all three memory models to continue ({seen.size}/3)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="C is fast but dangerous; Java/Python are safe but paused; Rust is both"
          body={
            <>
              These are not just language preferences — they are different tradeoffs for different domains. Linux kernel
              (C), Android runtime (Java), data science (Python), systems programming (Rust). Each choice shapes what
              failure modes are possible.
            </>
          }
          appearsIn={['Linux kernel', 'Android runtime', 'Python data science', 'Rust systems programming']}
          hook="Paradigms shape how you write code. Software engineering disciplines shape how teams write code together. Next: Git, testing, and shipping."
        />
      )}
    </div>
  )
}
