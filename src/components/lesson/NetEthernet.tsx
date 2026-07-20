import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

interface FrameField {
  id: string
  label: string
  bytes: string
  color: string
  desc: string
}

const FRAME_FIELDS: FrameField[] = [
  {
    id: 'preamble', label: 'Preamble + SFD', bytes: '8 B', color: '#64748b',
    desc: 'Alternating 1-0 pattern that synchronises the receiver\'s clock. The Start Frame Delimiter (10101011) signals "real data follows."',
  },
  {
    id: 'dst-mac', label: 'Dest MAC', bytes: '6 B', color: '#6366f1',
    desc: 'The 48-bit hardware address of the intended recipient. Switches use this to decide which port to forward the frame to.',
  },
  {
    id: 'src-mac', label: 'Src MAC', bytes: '6 B', color: '#8b5cf6',
    desc: 'The sender\'s hardware address. Switches learn which port this MAC lives on by reading the source field.',
  },
  {
    id: 'type', label: 'EtherType', bytes: '2 B', color: '#0ea5e9',
    desc: 'Identifies the Layer 3 protocol inside the payload. 0x0800 = IPv4, 0x86DD = IPv6, 0x0806 = ARP.',
  },
  {
    id: 'payload', label: 'Payload', bytes: '46–1500 B', color: '#10b981',
    desc: 'The actual Layer 3 packet (e.g. an IP datagram). Minimum 46 bytes — shorter payloads are padded.',
  },
  {
    id: 'fcs', label: 'FCS', bytes: '4 B', color: '#f59e0b',
    desc: 'Frame Check Sequence — a CRC-32 checksum. The receiver recalculates it; if it doesn\'t match, the frame is silently dropped.',
  },
]

const EXAMPLE_MAC = 'AA:BB:CC:DD:EE:FF'

function formatMacInput(raw: string): string {
  const hex = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 12)
  const parts: string[] = []
  for (let i = 0; i < hex.length; i += 2) {
    parts.push(hex.slice(i, i + 2))
  }
  return parts.join(':').toUpperCase()
}

export function NetEthernet({ onComplete }: Props) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [visitedFields, setVisitedFields] = useState<Set<string>>(() => new Set())
  const [macInput, setMacInput] = useState('')
  const [frameSent, setFrameSent] = useState(false)
  const [done, setDone] = useState(false)

  const handleFieldClick = (id: string) => {
    setSelectedField(id === selectedField ? null : id)
    setVisitedFields((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const formattedMac = formatMacInput(macInput)
  const isMacValid = formattedMac.replace(/:/g, '').length === 12

  const sendFrame = () => {
    if (!isMacValid) return
    setFrameSent(true)
  }

  const allFieldsVisited = visitedFields.size === FRAME_FIELDS.length
  const canComplete = allFieldsVisited && frameSent

  const activeField = FRAME_FIELDS.find((f) => f.id === selectedField)

  const SVG_W = 460
  const SVG_H = 80
  const PAD = 10
  const totalParts = FRAME_FIELDS.length
  const fieldW = (SVG_W - PAD * 2) / totalParts
  const fieldH = 44

  return (
    <div className="lesson-panel">
      <p className="lede">
        An Ethernet frame is the <strong>Layer 2 envelope</strong> that carries data on a local network.
        Every IP packet, every ARP request, rides inside one of these frames.
      </p>
      <p className="micro">Click each field in the frame to see what it does, then build a frame below.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W }}
          role="img"
          aria-label="Ethernet frame structure"
        >
          {FRAME_FIELDS.map((field, i) => {
            const x = PAD + i * fieldW
            const isSelected = selectedField === field.id
            const isVisited = visitedFields.has(field.id)

            return (
              <g key={field.id} style={{ cursor: 'pointer' }} onClick={() => handleFieldClick(field.id)}>
                <motion.rect
                  x={x + 1} y={8}
                  width={fieldW - 2} height={fieldH}
                  rx={4}
                  fill={field.color}
                  opacity={isSelected ? 1 : isVisited ? 0.7 : 0.4}
                  stroke={isSelected ? '#fff' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                  animate={{ opacity: isSelected ? 1 : isVisited ? 0.7 : 0.4 }}
                  transition={{ duration: 0.15 }}
                />
                <text
                  x={x + fieldW / 2} y={24}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={9}
                  fontWeight={600}
                  pointerEvents="none"
                >
                  {field.label}
                </text>
                <text
                  x={x + fieldW / 2} y={42}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize={8}
                  pointerEvents="none"
                >
                  {field.bytes}
                </text>
              </g>
            )
          })}
          <text x={SVG_W / 2} y={SVG_H - 4} textAnchor="middle" fill="var(--text-muted,#888)" fontSize={9}>
            ← click each field →
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {activeField && (
          <motion.div
            key={activeField.id}
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h3 style={{ margin: '0 0 0.25rem' }}>{activeField.label}</h3>
            <p style={{ margin: 0 }}>{activeField.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lesson-instruction" style={{ marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>MAC Address Anatomy</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontFamily: 'monospace', fontSize: 16 }}>
          <span style={{ color: '#6366f1', fontWeight: 700 }}>AA:BB:CC</span>
          <span style={{ color: 'var(--text-muted, #888)' }}>:</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>DD:EE:FF</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
          <span className="micro"><span style={{ color: '#6366f1', fontWeight: 600 }}>First 3 bytes</span> = OUI (vendor ID, assigned by IEEE)</span>
          <span className="micro"><span style={{ color: '#10b981', fontWeight: 600 }}>Last 3 bytes</span> = Device-specific (assigned by manufacturer)</span>
        </div>
        <p className="micro" style={{ margin: '0.5rem 0 0' }}>
          Example: {EXAMPLE_MAC} — the OUI <strong>AA:BB:CC</strong> identifies the vendor, <strong>DD:EE:FF</strong> is unique to the NIC.
        </p>
      </div>

      <div className="lesson-instruction" style={{ marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Build a Frame</h3>
        <p className="micro" style={{ margin: '0 0 0.5rem' }}>
          Type a destination MAC address (12 hex digits) and send a frame.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={macInput}
            onChange={(e) => { setMacInput(e.target.value); setFrameSent(false) }}
            placeholder="e.g. AABBCCDDEEFF"
            maxLength={17}
            style={{
              fontFamily: 'monospace', fontSize: 14, padding: '0.35rem 0.5rem',
              border: '1px solid var(--border, #333)', borderRadius: 6,
              background: 'var(--bg-input, #1a1a2e)', color: 'var(--text, #eee)',
              width: '15ch',
            }}
            disabled={frameSent}
          />
          <span className="micro" style={{ fontFamily: 'monospace' }}>→ {formattedMac || '??:??:??:??:??:??'}</span>
          <button
            type="button"
            className="btn ghost"
            disabled={!isMacValid || frameSent}
            onClick={sendFrame}
          >
            Send frame
          </button>
        </div>

        <AnimatePresence>
          {frameSent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{ marginTop: '0.5rem' }}
            >
              <p className="micro" style={{ margin: 0 }}>
                Frame sent to <strong style={{ fontFamily: 'monospace' }}>{formattedMac}</strong>:
                Preamble → Dest MAC → Src MAC (02:00:00:00:00:01) → EtherType 0x0800 → Payload → FCS ✓
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {canComplete && (
        <ConnectionCard
          title="The envelope of Layer 2"
          body={
            <>
              Every piece of data on a local Ethernet segment is wrapped in this frame structure.
              Switches read the destination MAC to forward, learn the source MAC to build their
              tables, and check the FCS to discard corrupted frames — all in microseconds.
            </>
          }
          appearsIn={['packet analysis', 'switch forwarding', 'ARP resolution']}
          hook="Every frame on a local network carries a MAC address — even IP packets ride inside one."
        />
      )}

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!canComplete || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!canComplete && (
          <span className="hint">
            {!allFieldsVisited
              ? `Click all frame fields (${FRAME_FIELDS.length - visitedFields.size} remaining) and send a frame.`
              : 'Now type a destination MAC and send a frame.'}
          </span>
        )}
      </div>
    </div>
  )
}
