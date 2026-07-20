import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase =
  | 'idle'
  | 'user-call'
  | 'trap'
  | 'kernel-check'
  | 'disk-read'
  | 'copy-buffer'
  | 'return'
  | 'done'

const PHASES: { id: Phase; label: string; space: 'user' | 'kernel'; desc: string }[] = [
  { id: 'user-call', label: 'Program calls read(fd)', space: 'user', desc: 'User program executes the read() library call. rax = 0 (syscall #read), rbx = fd 3.' },
  { id: 'trap', label: 'SYSCALL instruction', space: 'user', desc: 'CPU executes SYSCALL — traps into kernel mode. Privilege level switches from ring 3 → ring 0.' },
  { id: 'kernel-check', label: 'Kernel validates fd', space: 'kernel', desc: 'Kernel checks fd table: fd 3 is valid, points to "/home/user/data.txt". Access permissions OK.' },
  { id: 'disk-read', label: 'Kernel reads from disk', space: 'kernel', desc: 'Kernel issues DMA read request to disk controller. Waits for hardware interrupt. Process is BLOCKED.' },
  { id: 'copy-buffer', label: 'Copy to user buffer', space: 'kernel', desc: 'Disk interrupt fires. Kernel copies data from kernel buffer → user-space buffer at address 0x7fff…' },
  { id: 'return', label: 'Return to user mode', space: 'user', desc: 'SYSRET instruction: privilege switches back ring 0 → ring 3. rax = bytes read (128).' },
]

export function OSSyscall({ onComplete }: { onComplete: () => void }) {
  const [phaseIdx, setPhaseIdx] = useState(-1)
  const [running, setRunning] = useState(false)
  const [cycleCount, setCycleCount] = useState(0)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    if (!running) return
    if (phaseIdx >= PHASES.length - 1) {
      setRunning(false)
      const newCount = cycleCount + 1
      setCycleCount(newCount)
      if (newCount >= 2) setShowCard(true)
      return
    }
    const t = setTimeout(() => setPhaseIdx((i) => i + 1), 1100)
    return () => clearTimeout(t)
  }, [running, phaseIdx, cycleCount])

  const startRun = () => {
    setPhaseIdx(-1)
    setRunning(true)
    setTimeout(() => setPhaseIdx(0), 100)
  }

  const currentPhase = phaseIdx >= 0 ? PHASES[phaseIdx] : null

  return (
    <div className="lesson-panel">
      <p className="lede">
        Every interaction between user code and hardware crosses an invisible boundary: user space and kernel
        space. The <strong>system call</strong> is the only legal crossing point. Watch a single{' '}
        <code>read()</code> call cross that boundary and come back.
      </p>

      <div className="os-syscall-board">
        <div className={`os-syscall-band os-syscall-band--user ${currentPhase?.space === 'user' ? 'os-syscall-band--active' : ''}`}>
          <span className="os-syscall-band-label">User Space (ring 3)</span>
          <div className="os-syscall-program-box">
            <span className="os-syscall-prog-title">program</span>
            <code className="os-syscall-code">
              {'int n = read(3, buf, 128);'}
            </code>
          </div>
          <div className="os-syscall-regs">
            <span className="os-syscall-reg">rax = {phaseIdx >= 0 ? '0 (read)' : '—'}</span>
            <span className="os-syscall-reg">rbx = {phaseIdx >= 0 ? '3 (fd)' : '—'}</span>
          </div>
        </div>

        <div className="os-syscall-boundary">
          <motion.div
            className="os-syscall-boundary-line"
            animate={{
              boxShadow:
                phaseIdx === 1 || phaseIdx === 5
                  ? '0 0 16px var(--signal, #7c3aed)'
                  : 'none',
            }}
            transition={{ duration: 0.3 }}
          />
          <AnimatePresence>
            {(phaseIdx === 1 || phaseIdx === 5) && (
              <motion.div
                className={`os-syscall-arrow ${phaseIdx === 1 ? 'os-syscall-arrow--down' : 'os-syscall-arrow--up'}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {phaseIdx === 1 ? '↓ SYSCALL' : '↑ SYSRET'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`os-syscall-band os-syscall-band--kernel ${currentPhase?.space === 'kernel' ? 'os-syscall-band--active' : ''}`}>
          <span className="os-syscall-band-label">Kernel Space (ring 0)</span>
          <div className="os-syscall-kernel-steps">
            {['kernel-check', 'disk-read', 'copy-buffer'].map((id) => {
              const phase = PHASES.find((p) => p.id === id)!
              const reached = PHASES.findIndex((p) => p.id === id) <= phaseIdx
              return (
                <motion.div
                  key={id}
                  className={`os-syscall-kstep ${reached ? 'os-syscall-kstep--active' : ''}`}
                  animate={{ opacity: reached ? 1 : 0.4 }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.label}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentPhase && (
          <motion.div
            key={currentPhase.id}
            className="os-syscall-desc"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <strong>{currentPhase.label}:</strong> {currentPhase.desc}
          </motion.div>
        )}
      </AnimatePresence>

      {showCard && (
        <ConnectionCard
          title="Every file read, network request, and console.log crosses this boundary"
          body={
            <>
              In a browser, when JavaScript calls <code>fetch()</code>, it eventually calls a kernel network
              syscall. When Node.js writes to stdout, it calls the write syscall. The boundary exists to protect
              the kernel from buggy or malicious user code — kernel code runs with full hardware access and cannot
              be allowed to crash.
            </>
          }
          appearsIn={['threads and concurrency next', 'operating systems courses', 'security and privilege separation']}
          hook="You watched the kernel boundary. Next: two paths of execution inside one process — threads."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={startRun} disabled={running}>
          {cycleCount === 0 ? 'Run read()' : 'Run again'}
        </button>
        <button type="button" className="btn primary" onClick={onComplete} disabled={cycleCount < 2}>
          Continue to threads
        </button>
        {cycleCount < 2 && <span className="hint">Watch 2 complete cycles to continue.</span>}
      </div>
    </div>
  )
}
