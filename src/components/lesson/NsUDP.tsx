import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Mode = 'reliable' | 'fast'

const SCENARIOS = [
  { label: 'Voice / video call', pref: 'fast' as const, why: 'A dropped frame is invisible; a delayed frame causes stuttering.' },
  { label: 'DNS query', pref: 'fast' as const, why: 'Tiny request + response. If lost, just re-ask — still faster than TCP setup.' },
  { label: 'Live game state', pref: 'fast' as const, why: 'Old positions are useless; the latest state overwrites everything.' },
  { label: 'File download', pref: 'reliable' as const, why: 'Every byte matters — a missing chunk corrupts the file.' },
  { label: 'Web page (HTTPS)', pref: 'reliable' as const, why: 'HTML must arrive intact and in order, or the page breaks.' },
  { label: 'Email (SMTP)', pref: 'reliable' as const, why: 'Losing a paragraph of an email is unacceptable.' },
]

const SVG_W = 480
const SVG_H = 260
const TCP_X = 120
const UDP_X = 360
const HOST_TOP = 30
const HOST_BOT = 230

const tcpPackets = [
  { label: 'SYN', y: 60, delay: 0 },
  { label: 'SYN-ACK', y: 90, delay: 0.3, reverse: true },
  { label: 'ACK', y: 120, delay: 0.6 },
  { label: 'DATA', y: 150, delay: 0.9 },
  { label: 'ACK', y: 180, delay: 1.2, reverse: true },
]

const udpPackets = [
  { label: 'DATA', y: 70, delay: 0 },
  { label: 'DATA', y: 100, delay: 0.15 },
  { label: 'DATA', y: 130, delay: 0.3 },
  { label: '✕ lost', y: 160, delay: 0.45, lost: true },
  { label: 'DATA', y: 190, delay: 0.6 },
]

export function NsUDP({ onComplete }: Props) {
  const [mode, setMode] = useState<Mode>('reliable')
  const [done, setDone] = useState(false)
  const [toggled, setToggled] = useState(false)

  const handleToggle = (m: Mode) => {
    setMode(m)
    if (!toggled) setToggled(true)
  }

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          <strong>UDP</strong> (User Datagram Protocol) sends data with no handshake, no sequence
          numbers, and no acknowledgments. Each datagram is independent — "fire and forget."
        </p>
        <p>
          That makes UDP <em>much</em> faster for time-sensitive traffic. The tradeoff: if a packet
          is lost, UDP won't retransmit. The application must handle it (or accept the loss).
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="TCP vs UDP comparison">
          {/* TCP side */}
          <text x={TCP_X} y={18} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={12} fontWeight={700}>TCP (reliable)</text>
          <rect x={TCP_X - 28} y={HOST_TOP} width={56} height={22} rx={5} fill="#6366f1" opacity={0.8} />
          <text x={TCP_X} y={HOST_TOP + 14} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={600}>Client</text>
          <rect x={TCP_X - 28} y={HOST_BOT} width={56} height={22} rx={5} fill="#6366f1" opacity={0.8} />
          <text x={TCP_X} y={HOST_BOT + 14} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={600}>Server</text>
          <line x1={TCP_X} y1={HOST_TOP + 24} x2={TCP_X} y2={HOST_BOT} stroke="var(--border, #334155)" strokeDasharray="3 3" />

          {tcpPackets.map((p) => {
            const fromX = p.reverse ? TCP_X + 30 : TCP_X - 30
            const toX = p.reverse ? TCP_X - 30 : TCP_X + 30
            return (
              <motion.g key={`${p.label}-${p.y}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: p.delay, duration: 0.3 }}>
                <line x1={fromX} y1={p.y} x2={toX} y2={p.y + 20} stroke="#6366f1" strokeWidth={1.5} />
                <text x={TCP_X + (p.reverse ? -36 : 36)} y={p.y + 12} textAnchor="middle" fill="#818cf8" fontSize={8} fontWeight={600}>{p.label}</text>
              </motion.g>
            )
          })}

          {/* Divider */}
          <line x1={SVG_W / 2} y1={10} x2={SVG_W / 2} y2={SVG_H - 10} stroke="var(--border, #334155)" strokeDasharray="6 4" />
          <text x={SVG_W / 2} y={SVG_H - 2} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={9}>← TCP | UDP →</text>

          {/* UDP side */}
          <text x={UDP_X} y={18} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={12} fontWeight={700}>UDP (fast)</text>
          <rect x={UDP_X - 28} y={HOST_TOP} width={56} height={22} rx={5} fill="#10b981" opacity={0.8} />
          <text x={UDP_X} y={HOST_TOP + 14} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={600}>Client</text>
          <rect x={UDP_X - 28} y={HOST_BOT} width={56} height={22} rx={5} fill="#10b981" opacity={0.8} />
          <text x={UDP_X} y={HOST_BOT + 14} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={600}>Server</text>
          <line x1={UDP_X} y1={HOST_TOP + 24} x2={UDP_X} y2={HOST_BOT} stroke="var(--border, #334155)" strokeDasharray="3 3" />

          {udpPackets.map((p) => (
            <motion.g key={`udp-${p.y}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: p.delay, duration: 0.2 }}>
              <line
                x1={UDP_X - 30} y1={p.y} x2={UDP_X + 30} y2={p.y + 20}
                stroke={p.lost ? '#ef4444' : '#10b981'}
                strokeWidth={1.5}
                strokeDasharray={p.lost ? '4 3' : 'none'}
              />
              <text x={UDP_X + 38} y={p.y + 12} textAnchor="start" fill={p.lost ? '#ef4444' : '#34d399'} fontSize={8} fontWeight={600}>{p.label}</text>
            </motion.g>
          ))}

          {/* Latency bars */}
          <rect x={TCP_X - 50} y={HOST_BOT + 30} width={100} height={10} rx={3} fill="#6366f133" stroke="#6366f1" />
          <rect x={TCP_X - 50} y={HOST_BOT + 30} width={100} height={10} rx={3} fill="#6366f1" opacity={0.6} />
          <text x={TCP_X} y={HOST_BOT + 52} textAnchor="middle" fill="#818cf8" fontSize={8}>~150ms setup</text>

          <rect x={UDP_X - 50} y={HOST_BOT + 30} width={100} height={10} rx={3} fill="#10b98133" stroke="#10b981" />
          <rect x={UDP_X - 50} y={HOST_BOT + 30} width={25} height={10} rx={3} fill="#10b981" opacity={0.6} />
          <text x={UDP_X} y={HOST_BOT + 52} textAnchor="middle" fill="#34d399" fontSize={8}>~0ms setup</text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
        <button
          type="button"
          className={`btn ${mode === 'reliable' ? 'primary' : 'ghost'}`}
          onClick={() => handleToggle('reliable')}
          style={{ fontSize: 13 }}
        >
          Reliable (TCP)
        </button>
        <button
          type="button"
          className={`btn ${mode === 'fast' ? 'primary' : 'ghost'}`}
          onClick={() => handleToggle('fast')}
          style={{ fontSize: 13 }}
        >
          Fast (UDP)
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SCENARIOS.map((s) => {
              const match = s.pref === mode
              return (
                <div
                  key={s.label}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px solid ${match ? (mode === 'fast' ? '#10b981' : '#6366f1') : 'var(--border, #334155)'}`,
                    background: match ? (mode === 'fast' ? '#10b98115' : '#6366f115') : 'transparent',
                    opacity: match ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {match ? '✓' : '✕'} {s.label}
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: 'var(--text-muted, #888)' }}>
                      — prefers {s.pref === 'fast' ? 'UDP' : 'TCP'}
                    </span>
                  </div>
                  {match && <p className="micro" style={{ margin: '4px 0 0' }}>{s.why}</p>}
                </div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <ConnectionCard
        title="Speed over guarantees"
        body={
          <>
            UDP's header is only 8 bytes (vs TCP's 20+). No handshake, no state, no retransmission.
            Applications that use UDP handle their own reliability when needed — for example, DNS
            retries at the application layer, and video codecs mask lost frames with interpolation.
          </>
        }
        appearsIn={['VoIP', 'gaming', 'DNS queries', 'live streaming']}
        hook="UDP trades reliability for speed — when a dropped packet matters less than a delayed one."
      />

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!toggled || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!toggled && <span className="hint">Toggle between Reliable and Fast to see which scenarios match.</span>}
      </div>
    </div>
  )
}
