import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type DoraPhase = 'idle' | 'discover' | 'offer' | 'request' | 'ack' | 'leased' | 'done'

const DORA_STEPS: { phase: DoraPhase; label: string; dir: 'right' | 'left'; desc: string; color: string }[] = [
  {
    phase: 'discover', label: 'DHCP Discover', dir: 'right', color: '#f59e0b',
    desc: 'New device broadcasts "I need an IP address!" to 255.255.255.255 (everyone on the local network hears this).',
  },
  {
    phase: 'offer', label: 'DHCP Offer', dir: 'left', color: '#10b981',
    desc: 'DHCP server responds with an available IP address (192.168.1.50), subnet mask, gateway, DNS server, and a lease time.',
  },
  {
    phase: 'request', label: 'DHCP Request', dir: 'right', color: '#3b82f6',
    desc: 'Device broadcasts "I accept 192.168.1.50" — broadcast so other DHCP servers (if any) know it was taken.',
  },
  {
    phase: 'ack', label: 'DHCP ACK', dir: 'left', color: '#8b5cf6',
    desc: 'Server confirms: "192.168.1.50 is yours for 24 hours." The device configures its network interface.',
  },
]

const LEASE_INFO = [
  { label: 'IP Address', value: '192.168.1.50' },
  { label: 'Subnet Mask', value: '255.255.255.0 (/24)' },
  { label: 'Default Gateway', value: '192.168.1.1' },
  { label: 'DNS Server', value: '8.8.8.8' },
  { label: 'Lease Duration', value: '24 hours' },
  { label: 'DHCP Server', value: '192.168.1.1' },
]

const SVG_W = 460
const SVG_H = 280
const DEVICE_X = 80
const SERVER_X = 380

export function NsDHCP({ onComplete }: Props) {
  const [phase, setPhase] = useState<DoraPhase>('idle')
  const [stepIdx, setStepIdx] = useState(-1)
  const [showLease, setShowLease] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null }
  }
  useEffect(() => () => clearTimer(), [])

  const runDORA = () => {
    if (phase !== 'idle') return
    let i = 0
    const step = () => {
      setStepIdx(i)
      setPhase(DORA_STEPS[i].phase)
      if (i < DORA_STEPS.length - 1) {
        i++
        timerRef.current = window.setTimeout(step, 1400)
      } else {
        timerRef.current = window.setTimeout(() => {
          setPhase('leased')
          setShowLease(true)
          timerRef.current = window.setTimeout(() => setPhase('done'), 1500)
        }, 1200)
      }
    }
    step()
  }

  const currentStep = stepIdx >= 0 && stepIdx < DORA_STEPS.length ? DORA_STEPS[stepIdx] : null

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          When a device joins a network, it has no IP address. <strong>DHCP</strong> (Dynamic Host
          Configuration Protocol) automates assignment using a four-step process remembered as
          <strong> DORA</strong>: Discover → Offer → Request → Acknowledge.
        </p>
        <p>
          The server maintains a <strong>pool</strong> of available addresses and tracks leases.
          Before the lease expires, the client can request a renewal to keep its address.
        </p>
      </div>

      <p className="micro" style={{ textAlign: 'center' }}>Watch a new device obtain its address.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="DHCP DORA process">
          {/* Device */}
          <rect x={DEVICE_X - 35} y={20} width={70} height={36} rx={8} fill="var(--surface-2, #1e293b)" stroke="var(--border, #334155)" strokeWidth={1.5} />
          <text x={DEVICE_X} y={34} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={10} fontWeight={600}>New Device</text>
          <text x={DEVICE_X} y={48} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>
            {phase === 'idle' ? 'IP: ???' : phase === 'leased' || phase === 'done' ? 'IP: 192.168.1.50' : 'IP: 0.0.0.0'}
          </text>

          {/* Server */}
          <rect x={SERVER_X - 40} y={20} width={80} height={36} rx={8} fill="var(--surface-2, #1e293b)" stroke="var(--border, #334155)" strokeWidth={1.5} />
          <text x={SERVER_X} y={34} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={10} fontWeight={600}>DHCP Server</text>
          <text x={SERVER_X} y={48} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>192.168.1.1</text>

          {/* Timelines */}
          <line x1={DEVICE_X} y1={60} x2={DEVICE_X} y2={SVG_H - 10} stroke="var(--border, #334155)" strokeDasharray="3 3" />
          <line x1={SERVER_X} y1={60} x2={SERVER_X} y2={SVG_H - 10} stroke="var(--border, #334155)" strokeDasharray="3 3" />

          {/* DORA arrows */}
          {DORA_STEPS.map((s, i) => {
            if (stepIdx < i) return null
            const y = 80 + i * 45
            const fromX = s.dir === 'right' ? DEVICE_X : SERVER_X
            const toX = s.dir === 'right' ? SERVER_X : DEVICE_X
            return (
              <motion.g key={s.phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <line x1={fromX} y1={y} x2={toX} y2={y + 25} stroke={s.color} strokeWidth={2} />
                <text
                  x={(fromX + toX) / 2}
                  y={y + (s.dir === 'right' ? 6 : 20)}
                  textAnchor="middle"
                  fill={s.color}
                  fontSize={10}
                  fontWeight={700}
                >
                  {s.label}
                </text>
                {s.dir === 'right' && (
                  <text x={(fromX + toX) / 2} y={y + 18} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={7}>
                    broadcast →
                  </text>
                )}
              </motion.g>
            )
          })}

          {/* DORA letter labels */}
          {DORA_STEPS.map((s, i) => {
            if (stepIdx < i) return null
            const y = 80 + i * 45
            return (
              <motion.text
                key={`letter-${s.phase}`}
                x={20}
                y={y + 14}
                fill={s.color}
                fontSize={16}
                fontWeight={800}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {'DORA'[i]}
              </motion.text>
            )
          })}

          {(phase === 'leased' || phase === 'done') && (
            <motion.text
              x={SVG_W / 2} y={SVG_H - 10}
              textAnchor="middle"
              fill="#10b981"
              fontSize={12}
              fontWeight={700}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Address assigned — lease active
            </motion.text>
          )}
        </svg>
      </div>

      <AnimatePresence mode="wait">
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

      {showLease && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '1rem 0' }}>
          <p className="micro" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Lease information received:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 13 }}>
            {LEASE_INFO.map((item) => (
              <motion.div
                key={item.label}
                style={{ display: 'contents' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: LEASE_INFO.indexOf(item) * 0.1 }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-muted, #888)' }}>{item.label}</span>
                <span><code>{item.value}</code></span>
              </motion.div>
            ))}
          </div>
          <p className="micro" style={{ marginTop: '0.75rem' }}>
            At 50% of the lease (T1 = 12h), the client unicasts a renewal request. At 87.5% (T2 ≈ 21h),
            it broadcasts to any DHCP server. If no renewal is received by expiry, the address is released.
          </p>
        </motion.div>
      )}

      <ConnectionCard
        title="Automatic addressing"
        body={
          <>
            DHCP eliminates manual IP configuration for every device on a network. The server
            tracks which addresses are in use, reclaims expired leases, and can push additional
            configuration like NTP servers, TFTP boot files, and VLAN assignments. In large
            networks, DHCP relay agents forward requests across subnets.
          </>
        }
        appearsIn={['home networks', 'enterprise networks', 'DHCP relay']}
        hook="DHCP means no human has to manually configure every device on the network — it's self-service IP addressing."
      />

      <div className="lesson-actions">
        {phase === 'idle' && (
          <button type="button" className="btn primary" onClick={runDORA}>
            Join network (start DORA)
          </button>
        )}
        {phase !== 'idle' && (
          <button
            type="button"
            className="btn primary"
            disabled={phase !== 'done' || done}
            onClick={() => { setDone(true); onComplete() }}
          >
            {done ? 'Completed' : phase !== 'done' ? 'DORA in progress…' : 'Mark complete'}
          </button>
        )}
      </div>
    </div>
  )
}
