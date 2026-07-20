import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const INSTRUCTIONS = [
  { raw: 'LOAD #7', plain: 'Put the number 7 into memory' },
  { raw: 'ADD R0', plain: 'Add what is in memory slot 0' },
  { raw: 'NOP', plain: 'Do nothing (placeholder)' },
  { raw: 'JMP 0', plain: 'Jump back to the first instruction' },
] as const

const PHASE_LABELS = {
  fetch: 'Fetch — grab the next instruction',
  decode: 'Decode — figure out what it means',
  execute: 'Execute — actually do the work',
} as const

type Phase = 'fetch' | 'decode' | 'execute'

export function FetchDecodeLesson({ onComplete }: { onComplete: () => void }) {
  const [pc, setPc] = useState(0)
  const [phase, setPhase] = useState<Phase>('fetch')
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const order: Phase[] = ['fetch', 'decode', 'execute']
    const t = window.setInterval(() => {
      setPhase((p) => {
        const i = order.indexOf(p)
        if (i < 2) return order[i + 1]
        setPc((c) => (c + 1) % INSTRUCTIONS.length)
        return 'fetch'
      })
    }, 1100)
    return () => window.clearInterval(t)
  }, [running])

  const instr = INSTRUCTIONS[pc]

  return (
    <div className="lesson-panel">
      <p className="lede">
        A CPU does the same three steps, over and over, incredibly fast: <strong>grab</strong> the next instruction,{' '}
        <strong>understand</strong> what it says, and <strong>do</strong> it. Then repeat. Watch it happen below in slow
        motion.
      </p>
      <div className="mode-toggle observe-bar">
        <button type="button" className={running ? 'active' : ''} onClick={() => setRunning(true)}>
          Run
        </button>
        <button type="button" className={!running ? 'active' : ''} onClick={() => setRunning(false)}>
          Pause
        </button>
      </div>

      <div className="cpu-card">
        <div className="cpu-reg">
          <span className="reg-label">Instruction #</span>
          <motion.span key={pc} className="reg-value" initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}>
            {pc + 1}
          </motion.span>
        </div>
        <div className="mem-strip">
          {INSTRUCTIONS.map((m, i) => (
            <motion.div
              key={m.raw}
              className={`mem-cell ${i === pc ? 'active' : ''}`}
              animate={{
                outlineColor: i === pc ? 'var(--signal)' : 'transparent',
                scale: i === pc ? 1.03 : 1,
              }}
            >
              <span className="mem-addr">{i + 1}</span>
              <span className="mem-text">{m.raw}</span>
            </motion.div>
          ))}
        </div>
        <div className="phase-pipeline">
          {(['fetch', 'decode', 'execute'] as const).map((p) => (
            <div key={p} className={`phase-node ${phase === p ? 'lit' : ''}`}>
              <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${pc}-${phase}`}
            className="ir-display"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span className="ir-phase-label">{PHASE_LABELS[phase]}</span>
            {phase === 'fetch' && <span>Reading instruction #{pc + 1} from the list…</span>}
            {phase === 'decode' && (
              <span>
                It says: <strong>"{instr.raw}"</strong> → {instr.plain}
              </span>
            )}
            {phase === 'execute' && <span>Doing it now. Then moving to the next instruction.</span>}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="micro">
        This loop — fetch, decode, execute — is the heartbeat of every computer. Your phone runs it billions of times
        per second. You just watched four instructions tick by in slow motion.
      </p>

      <ConnectionCard
        title="The rhythm inside every processor"
        body={
          <>
            From the simplest microcontroller to the fastest supercomputer, every general-purpose processor runs this
            same loop. Faster chips do it at higher frequencies — but the pattern never changes.
          </>
        }
        appearsIn={["your phone's processor", 'servers in the map lab', 'the CPU overlay in Devices']}
        hook="You are ready to finish Foundations and unlock real machines in your collection."
      />
      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete}>
          Finish chapter
        </button>
      </div>
    </div>
  )
}
