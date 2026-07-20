import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Register = { name: string; value: number }

const INITIAL_REGISTERS: Register[] = [
  { name: 'R0', value: 5 },
  { name: 'R1', value: 3 },
  { name: 'R2', value: 0 },
  { name: 'R3', value: 0 },
]

function toBinary4(n: number): string {
  return (n & 0xf).toString(2).padStart(4, '0')
}

export function MemRegisters({ onComplete }: { onComplete: () => void }) {
  const [registers, setRegisters] = useState<Register[]>(INITIAL_REGISTERS)
  const [lastOp, setLastOp] = useState<string | null>(null)
  const [addDone, setAddDone] = useState(false)

  const cycleValue = (i: number) => {
    setRegisters((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, value: (r.value + 1) % 16 } : r)),
    )
  }

  const doAdd = () => {
    const sum = (registers[0].value + registers[1].value) & 0xf
    setRegisters((prev) =>
      prev.map((r, idx) => (idx === 2 ? { ...r, value: sum } : r)),
    )
    setLastOp(`ADD R0(${registers[0].value}) + R1(${registers[1].value}) = ${sum}  [0 cycles latency]`)
    setAddDone(true)
  }

  const doMove = () => {
    const val = registers[2].value
    setRegisters((prev) =>
      prev.map((r, idx) => (idx === 3 ? { ...r, value: val } : r)),
    )
    setLastOp(`MOVE R2(${val}) → R3  [0 cycles latency]`)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Registers are the CPU's own private scratchpad — four tiny slots wired directly into the arithmetic unit.
        Access costs <strong>zero extra cycles</strong> because there is no bus, no wait, no distance.
      </p>
      <p className="micro">Click a register value to cycle it. Then try ADD and MOVE.</p>

      <div className="mem-register-board">
        <div className="mem-reg-group">
          {registers.map((r, i) => (
            <motion.div
              key={r.name}
              className="mem-reg-cell"
              whileTap={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <span className="mem-reg-name">{r.name}</span>
              <button
                type="button"
                className="mem-reg-value"
                onClick={() => cycleValue(i)}
                aria-label={`${r.name} value, click to cycle`}
              >
                {r.value}
              </button>
              <span className="mem-reg-binary">{toBinary4(r.value)}</span>
            </motion.div>
          ))}
        </div>

        <div className="mem-alu-box">
          <span className="mem-alu-label">ALU</span>
          <div className="mem-alu-buttons">
            <button type="button" className="btn primary" onClick={doAdd}>
              ADD R0 + R1 → R2
            </button>
            <button type="button" className="btn" onClick={doMove} disabled={registers[2].value === 0 && !addDone}>
              MOVE R2 → R3
            </button>
          </div>
        </div>
      </div>

      {lastOp && (
        <motion.div
          className="mem-op-log"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <span className="micro">{lastOp}</span>
        </motion.div>
      )}

      {addDone && (
        <ConnectionCard
          title="This is what the CPU does billions of times per second"
          body={
            <>
              Every addition, every comparison, every array index in every program you have ever run passed through a
              register file exactly like this one. Real CPUs have 16–32 registers and can retire multiple operations
              per clock cycle — but the principle is identical.
            </>
          }
          appearsIn={['the cache lab next', 'compiler code generation', 'assembly language courses']}
          hook="Registers are fast because they are close. The next question is: what happens when you need more data than four slots can hold?"
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!addDone}>
          Continue to cache
        </button>
        {!addDone && <span className="hint">Click ADD R0 + R1 → R2 to see the ALU in action.</span>}
      </div>
    </div>
  )
}
