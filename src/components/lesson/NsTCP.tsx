import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Phase = 'idle' | 'syn' | 'synack' | 'ack' | 'established' | 'data' | 'fin' | 'done'

const HANDSHAKE_STEPS: { phase: Phase; label: string; desc: string; dir: 'right' | 'left' }[] = [
  { phase: 'syn', label: 'SYN', desc: 'Client picks a random sequence number (ISN=1000) and sends SYN to initiate.', dir: 'right' },
  { phase: 'synack', label: 'SYN-ACK', desc: 'Server acknowledges (ACK=1001) and sends its own sequence number (ISN=5000).', dir: 'left' },
  { phase: 'ack', label: 'ACK', desc: 'Client acknowledges (ACK=5001). Connection is now ESTABLISHED.', dir: 'right' },
]

const WINDOW_SEGMENTS = [
  { seq: 1001, status: 'acked' as const },
  { seq: 1501, status: 'acked' as const },
  { seq: 2001, status: 'sent' as const },
  { seq: 2501, status: 'sent' as const },
  { seq: 3001, status: 'unsent' as const },
  { seq: 3501, status: 'unsent' as const },
]

const SVG_W = 460
const SVG_H = 320
const CLIENT_X = 70
const SERVER_X = 390
const HOST_Y_TOP = 40
const HOST_Y_BOT = 300

export function NsTCP({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [stepIdx, setStepIdx] = useState(-1)
  const [showWindow, setShowWindow] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null }
  }
  useEffect(() => () => clearTimer(), [])

  const runHandshake = () => {
    if (phase !== 'idle') return
    let i = 0
    const step = () => {
      setStepIdx(i)
      setPhase(HANDSHAKE_STEPS[i].phase)
      if (i < HANDSHAKE_STEPS.length - 1) {
        i++
        timerRef.current = window.setTimeout(step, 1200)
      } else {
        timerRef.current = window.setTimeout(() => {
          setPhase('established')
          timerRef.current = window.setTimeout(() => {
            setPhase('data')
            setShowWindow(true)
            timerRef.current = window.setTimeout(() => setPhase('done'), 2000)
          }, 1000)
        }, 1000)
      }
    }
    step()
  }

  const packetY = (progress: number) => HOST_Y_TOP + 80 + progress * 120
  const currentStep = stepIdx >= 0 && stepIdx < HANDSHAKE_STEPS.length ? HANDSHAKE_STEPS[stepIdx] : null

  const packetColor = (p: Phase) => {
    if (p === 'syn') return '#6366f1'
    if (p === 'synack') return '#10b981'
    if (p === 'ack') return '#f59e0b'
    return '#8b5cf6'
  }

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          TCP (<strong>Transmission Control Protocol</strong>) is connection-oriented: before any data
          flows, the client and server perform a <strong>three-way handshake</strong> to synchronize
          sequence numbers and agree on connection parameters.
        </p>
        <p>
          Every byte sent gets a sequence number, and the receiver acknowledges what it received.
          If an ACK doesn't arrive in time, TCP retransmits. The <strong>sliding window</strong> lets
          a sender push multiple segments before waiting for acknowledgment, maximizing throughput.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W }}
          role="img"
          aria-label="TCP three-way handshake animation"
        >
          {/* Host columns */}
          <rect x={CLIENT_X - 30} y={HOST_Y_TOP} width={60} height={28} rx={6} fill="var(--surface-2, #1e293b)" stroke="var(--border, #334155)" />
          <text x={CLIENT_X} y={HOST_Y_TOP + 17} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={11} fontWeight={600}>Client</text>

          <rect x={SERVER_X - 30} y={HOST_Y_TOP} width={60} height={28} rx={6} fill="var(--surface-2, #1e293b)" stroke="var(--border, #334155)" />
          <text x={SERVER_X} y={HOST_Y_TOP + 17} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={11} fontWeight={600}>Server</text>

          <line x1={CLIENT_X} y1={HOST_Y_TOP + 30} x2={CLIENT_X} y2={HOST_Y_BOT} stroke="var(--border, #334155)" strokeDasharray="4 3" />
          <line x1={SERVER_X} y1={HOST_Y_TOP + 30} x2={SERVER_X} y2={HOST_Y_BOT} stroke="var(--border, #334155)" strokeDasharray="4 3" />

          {/* Handshake arrows */}
          {HANDSHAKE_STEPS.map((s, i) => {
            if (stepIdx < i) return null
            const y = HOST_Y_TOP + 80 + i * 60
            const fromX = s.dir === 'right' ? CLIENT_X : SERVER_X
            const toX = s.dir === 'right' ? SERVER_X : CLIENT_X
            return (
              <g key={s.phase}>
                <motion.line
                  x1={fromX} y1={y} x2={toX} y2={y + 30}
                  stroke={packetColor(s.phase)}
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.text
                  x={(fromX + toX) / 2}
                  y={y + (s.dir === 'right' ? 8 : 22)}
                  textAnchor="middle"
                  fill={packetColor(s.phase)}
                  fontSize={11}
                  fontWeight={700}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {s.label}
                </motion.text>
              </g>
            )
          })}

          {phase === 'established' && (
            <motion.text
              x={SVG_W / 2} y={HOST_Y_BOT - 10}
              textAnchor="middle"
              fill="#10b981"
              fontSize={12}
              fontWeight={700}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ✓ ESTABLISHED
            </motion.text>
          )}

          {(phase === 'data' || phase === 'done') && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line
                x1={CLIENT_X} y1={HOST_Y_BOT - 40} x2={SERVER_X} y2={HOST_Y_BOT - 20}
                stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <text x={(CLIENT_X + SERVER_X) / 2} y={HOST_Y_BOT - 38} textAnchor="middle" fill="#8b5cf6" fontSize={10} fontWeight={600}>
                DATA seq=1001
              </text>
              <motion.line
                x1={SERVER_X} y1={HOST_Y_BOT - 15} x2={CLIENT_X} y2={HOST_Y_BOT}
                stroke="#10b981" strokeWidth={2} markerEnd="url(#arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
              <motion.text
                x={(CLIENT_X + SERVER_X) / 2} y={HOST_Y_BOT - 3}
                textAnchor="middle" fill="#10b981" fontSize={10} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                ACK=1501
              </motion.text>
            </motion.g>
          )}

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </div>

      <AnimatePresence>
        {currentStep && (
          <motion.div
            key={currentStep.phase}
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p><strong>{currentStep.label}:</strong> {currentStep.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showWindow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ margin: '1rem 0' }}
        >
          <p className="micro" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            TCP Sliding Window — sender can push segments ahead of ACKs
          </p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {WINDOW_SEGMENTS.map((seg) => (
              <motion.div
                key={seg.seq}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (seg.seq - 1001) / 3000 }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background: seg.status === 'acked' ? '#10b98133' : seg.status === 'sent' ? '#f59e0b33' : 'var(--surface-2, #1e293b)',
                  border: `1px solid ${seg.status === 'acked' ? '#10b981' : seg.status === 'sent' ? '#f59e0b' : 'var(--border, #334155)'}`,
                  color: seg.status === 'acked' ? '#10b981' : seg.status === 'sent' ? '#f59e0b' : 'var(--text-muted, #888)',
                }}
              >
                SEQ {seg.seq} — {seg.status === 'acked' ? '✓ ACKed' : seg.status === 'sent' ? '⏳ Sent' : '… Queued'}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <ConnectionCard
        title="Reliable delivery, guaranteed"
        body={
          <>
            TCP's three-way handshake ensures both sides agree before data flows. Sequence numbers
            track every byte. If a segment goes missing, the receiver's gap in ACKs triggers
            retransmission. The sliding window balances throughput with reliability — wider windows
            mean more data in flight before waiting for acknowledgment.
          </>
        }
        appearsIn={['web traffic', 'file transfers', 'database connections']}
        hook="TCP is the workhorse of the internet — it guarantees every byte arrives, in order, or retransmits."
      />

      <div className="lesson-actions">
        {phase === 'idle' && (
          <button type="button" className="btn primary" onClick={runHandshake}>
            Start handshake
          </button>
        )}
        {phase !== 'idle' && (
          <button
            type="button"
            className="btn primary"
            disabled={phase !== 'done' || done}
            onClick={() => { setDone(true); onComplete() }}
          >
            {done ? 'Completed' : phase !== 'done' ? 'Watch the handshake…' : 'Mark complete'}
          </button>
        )}
      </div>
    </div>
  )
}
