import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface Program {
  name: string
  color: string
  pages: { vAddr: string; pFrame: number | null; inRam: boolean }[]
}

const PROGRAMS: Program[] = [
  {
    name: 'Chrome',
    color: '#60a5fa',
    pages: [
      { vAddr: '0x0000', pFrame: 2, inRam: true },
      { vAddr: '0x1000', pFrame: 7, inRam: true },
    ],
  },
  {
    name: 'Slack',
    color: '#a78bfa',
    pages: [
      { vAddr: '0x0000', pFrame: 4, inRam: true },
      { vAddr: '0x1000', pFrame: 9, inRam: false },
    ],
  },
  {
    name: 'VS Code',
    color: '#34d399',
    pages: [
      { vAddr: '0x0000', pFrame: 1, inRam: true },
      { vAddr: '0x1000', pFrame: 6, inRam: true },
    ],
  },
]

type AnimStep = 'idle' | 'fault-trigger' | 'disk-load' | 'table-update' | 'done'

export function MemVirtual({ onComplete }: { onComplete: () => void }) {
  const [animStep, setAnimStep] = useState<AnimStep>('idle')
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS)
  const [showCard, setShowCard] = useState(false)
  const [faultCount, setFaultCount] = useState(0)

  const triggerFault = () => {
    if (animStep !== 'idle') return
    setAnimStep('fault-trigger')
    setTimeout(() => {
      setAnimStep('disk-load')
      setTimeout(() => {
        setAnimStep('table-update')
        setPrograms((prev) =>
          prev.map((prog, pi) =>
            pi === 1
              ? {
                  ...prog,
                  pages: prog.pages.map((p, i) =>
                    i === 1 ? { ...p, pFrame: 11, inRam: true } : p,
                  ),
                }
              : prog,
          ),
        )
        setTimeout(() => {
          setAnimStep('done')
          setFaultCount((c) => c + 1)
          setShowCard(true)
          setTimeout(() => setAnimStep('idle'), 1000)
        }, 600)
      }, 800)
    }, 600)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Each program believes its memory starts at address <code>0x0000</code>. The{' '}
        <strong>Memory Management Unit (MMU)</strong> silently translates each virtual address to a real physical
        frame in RAM. Programs never see each other's memory — even when using the same addresses.
      </p>
      <p className="micro">
        The three programs below each have a private page table. Click "Simulate page fault" to see Slack access a
        page that is not currently in RAM.
      </p>

      <div className="mem-virtual-board">
        {programs.map((prog, pi) => (
          <div key={prog.name} className="mem-virtual-program" style={{ borderColor: prog.color }}>
            <span className="mem-virtual-prog-name" style={{ color: prog.color }}>
              {prog.name}
            </span>
            <div className="mem-virtual-page-table">
              {prog.pages.map((page, i) => (
                <motion.div
                  key={page.vAddr}
                  className={`mem-virtual-page ${!page.inRam ? 'mem-virtual-page--on-disk' : ''}`}
                  animate={{
                    backgroundColor:
                      pi === 1 && i === 1 && animStep === 'table-update'
                        ? 'rgba(52,211,153,0.2)'
                        : page.inRam
                        ? 'var(--surface-2, #1e293b)'
                        : 'var(--surface-3, #334155)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="mem-virtual-vaddr">{page.vAddr}</span>
                  <span className="mem-virtual-arrow">→</span>
                  <span className="mem-virtual-pframe">
                    {page.inRam ? `Frame ${page.pFrame}` : '💾 disk'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mem-virtual-ram">
        <span className="mem-virtual-ram-label">Physical RAM (frames)</span>
        <div className="mem-virtual-frames">
          {Array.from({ length: 12 }, (_, i) => {
            const owner = programs.find((p) => p.pages.some((pg) => pg.pFrame === i && pg.inRam))
            return (
              <motion.div
                key={i}
                className="mem-virtual-frame"
                style={{ backgroundColor: owner ? `${owner.color}33` : undefined }}
                animate={{
                  outline:
                    animStep === 'table-update' && i === 11
                      ? '2px solid #34d399'
                      : '2px solid transparent',
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="mem-virtual-frame-num">{i}</span>
                {owner && (
                  <span className="mem-virtual-frame-owner" style={{ color: owner.color }}>
                    {owner.name[0]}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {animStep === 'fault-trigger' && (
          <motion.div
            className="mem-virtual-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ Slack accessed <code>0x1000</code> — page not in RAM! OS trap fired.
          </motion.div>
        )}
        {animStep === 'disk-load' && (
          <motion.div
            className="mem-virtual-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            💾 OS loading Slack's page from disk into frame 11…
          </motion.div>
        )}
        {(animStep === 'table-update' || animStep === 'done') && (
          <motion.div
            className="mem-virtual-status mem-virtual-status--ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ✓ Page table updated. Slack's <code>0x1000</code> → frame 11. Resuming execution.
          </motion.div>
        )}
      </AnimatePresence>

      {showCard && (
        <ConnectionCard
          title="This is why you can run Chrome, Slack, and VS Code simultaneously"
          body={
            <>
              Virtual memory gives each process a private, contiguous address space — even when physical RAM is
              fragmented across many frames. When a page is not in RAM, the OS fetches it from disk (a page fault)
              and updates the page table. The process never notices — it just resumes a few milliseconds later.
            </>
          }
          appearsIn={['the paging lab next', 'operating system design', 'process isolation and security']}
          hook="You watched the MMU translate one address. Next: place multiple process pages into physical frames yourself."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={triggerFault} disabled={animStep !== 'idle'}>
          Simulate page fault ({faultCount} so far)
        </button>
        <button type="button" className="btn primary" onClick={onComplete} disabled={faultCount === 0}>
          Continue to paging
        </button>
        {faultCount === 0 && <span className="hint">Trigger a page fault to continue.</span>}
      </div>
    </div>
  )
}
