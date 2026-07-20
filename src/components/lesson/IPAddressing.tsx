import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

const CLASSES = [
  { name: 'A', range: '1.0.0.0 – 126.255.255.255', mask: '/8', bits: '0xxxxxxx', color: '#e06c75' },
  { name: 'B', range: '128.0.0.0 – 191.255.255.255', mask: '/16', bits: '10xxxxxx', color: '#e5c07b' },
  { name: 'C', range: '192.0.0.0 – 223.255.255.255', mask: '/24', bits: '110xxxxx', color: '#61afef' },
] as const

function octetToBits(value: number): boolean[] {
  return Array.from({ length: 8 }, (_, i) => ((value >> (7 - i)) & 1) === 1)
}

function bitsToOctet(bits: boolean[]): number {
  return bits.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0)
}

function getAddressClass(firstOctet: number): string {
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  return 'C'
}

export function IPAddressing({ onComplete }: Props) {
  const [octets, setOctets] = useState([
    [true, true, false, false, false, false, false, false],   // 192
    [true, false, true, false, true, false, false, false],     // 168
    [false, false, false, false, false, false, false, true],   // 1
    [false, true, true, false, false, true, false, false],     // 100
  ])
  const [cidr] = useState(24)
  const [done, setDone] = useState(false)
  const [toggled, setToggled] = useState(false)

  const decValues = octets.map(bitsToOctet)
  const addrClass = getAddressClass(decValues[0])
  const totalBits = 32

  const toggleBit = (octetIdx: number, bitIdx: number) => {
    setToggled(true)
    setOctets((prev) => {
      const next = prev.map((o) => [...o])
      next[octetIdx][bitIdx] = !next[octetIdx][bitIdx]
      return next
    })
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Every device on an IP network needs a unique address. An IPv4 address is a <strong>32-bit number</strong>,
        written as four decimal octets separated by dots. The subnet mask splits those 32 bits into a{' '}
        <strong>network portion</strong> and a <strong>host portion</strong>.
      </p>

      <div className="lesson-interactive">
        <div className="lesson-instruction">
          <p>Click any bit to toggle it on or off. Watch the decimal value of each octet change.</p>
        </div>

        <svg
          viewBox="0 0 720 260"
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0 auto' }}
          aria-label="IPv4 address with binary representation"
        >
          <defs>
            <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--signal, #61afef)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--signal, #61afef)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="hostGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e5c07b" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#e5c07b" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          <rect x="10" y="50" width={cidr / totalBits * 700} height="160" rx="6" fill="url(#netGrad)" />
          <rect x={10 + cidr / totalBits * 700} y="50" width={(1 - cidr / totalBits) * 700} height="160" rx="6" fill="url(#hostGrad)" />

          <text x="10" y="40" fontSize="11" fill="var(--signal, #61afef)" fontWeight="600">
            Network (/{cidr})
          </text>
          <text x={10 + cidr / totalBits * 700 + 4} y="40" fontSize="11" fill="#e5c07b" fontWeight="600">
            Host
          </text>

          {octets.map((bits, oi) => {
            const ox = 10 + oi * 178
            return (
              <g key={oi}>
                <text x={ox + 70} y="74" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--fg)">
                  {decValues[oi]}
                </text>
                {oi < 3 && (
                  <text x={ox + 165} y="74" textAnchor="middle" fontSize="26" fill="var(--fg-muted, #888)">.</text>
                )}

                {bits.map((b, bi) => {
                  const bx = ox + bi * 20
                  const globalBit = oi * 8 + bi
                  const isNetwork = globalBit < cidr
                  return (
                    <g key={bi} style={{ cursor: 'pointer' }} onClick={() => toggleBit(oi, bi)}>
                      <rect
                        x={bx}
                        y="90"
                        width="18"
                        height="24"
                        rx="3"
                        fill={isNetwork ? 'var(--signal, #61afef)' : '#e5c07b'}
                        opacity={b ? 0.85 : 0.15}
                      />
                      <text
                        x={bx + 9}
                        y="107"
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="600"
                        fill={b ? '#fff' : 'var(--fg-muted, #888)'}
                      >
                        {b ? '1' : '0'}
                      </text>
                    </g>
                  )
                })}

                <text x={ox + 70} y="136" textAnchor="middle" fontSize="10" fill="var(--fg-muted, #888)">
                  {bits.map((b) => (b ? '1' : '0')).join('')}
                </text>
              </g>
            )
          })}

          <text x="360" y="165" textAnchor="middle" fontSize="14" fill="var(--fg)" fontWeight="600">
            {decValues.join('.')} / {cidr}
          </text>
          <text x="360" y="185" textAnchor="middle" fontSize="12" fill="var(--fg-muted, #888)">
            Subnet mask: 255.255.255.0
          </text>
          <text x="360" y="205" textAnchor="middle" fontSize="12" fill="var(--fg-muted, #888)">
            Class {addrClass} address
          </text>
        </svg>

        {toggled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ margin: '1rem 0' }}
          >
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {CLASSES.map((c) => (
                <div
                  key={c.name}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${addrClass === c.name ? c.color : 'var(--border)'}`,
                    opacity: addrClass === c.name ? 1 : 0.5,
                    fontSize: '0.8rem',
                  }}
                >
                  <strong style={{ color: c.color }}>Class {c.name}</strong>
                  <br />
                  <span className="micro">{c.range}</span>
                  <br />
                  <span className="micro">Default mask: {c.mask}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <ConnectionCard
          title="Every device needs an address"
          body={
            <>
              An IP address encodes two pieces of information in one number: <strong>which network</strong> the device
              belongs to, and <strong>which host</strong> it is on that network. The subnet mask tells routers where to
              draw the line between the two. Without this split, routers couldn't forward packets efficiently.
            </>
          }
          appearsIn={['network design', 'subnetting', 'DHCP configuration']}
          hook="An IP address is two things in one: which network you're on, and which host you are."
        />

        <div className="lesson-actions">
          <button
            type="button"
            className="btn primary"
            disabled={done}
            onClick={() => { setDone(true); onComplete() }}
          >
            {done ? 'Completed' : 'Mark complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
