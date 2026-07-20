import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

const FULL_ADDR = '2001:0db8:85a3:0000:0000:8a2e:0370:7334'

function simplifyIPv6(addr: string): { step1: string; step2: string } {
  const groups = addr.split(':')
  const noLeading = groups.map((g) => g.replace(/^0+/, '') || '0')
  const step1 = noLeading.join(':')

  let longest = { start: -1, len: 0 }
  let cur = { start: -1, len: 0 }
  for (let i = 0; i < noLeading.length; i++) {
    if (noLeading[i] === '0') {
      if (cur.start === -1) cur.start = i
      cur.len++
      if (cur.len > longest.len) longest = { ...cur }
    } else {
      cur = { start: -1, len: 0 }
    }
  }

  let step2 = step1
  if (longest.len >= 2) {
    const before = noLeading.slice(0, longest.start).join(':')
    const after = noLeading.slice(longest.start + longest.len).join(':')
    step2 = `${before}::${after}`
  }

  return { step1, step2 }
}

const IPV4_HEADER_FIELDS = [
  'Version', 'IHL', 'ToS', 'Total Length',
  'Identification', 'Flags', 'Fragment Offset',
  'TTL', 'Protocol', 'Header Checksum',
  'Source Address', 'Destination Address',
  'Options (variable)',
]

const IPV6_HEADER_FIELDS = [
  'Version', 'Traffic Class', 'Flow Label',
  'Payload Length', 'Next Header', 'Hop Limit',
  'Source Address (128 bits)',
  'Destination Address (128 bits)',
]

export function IPv6Basics({ onComplete }: Props) {
  const [showSimplify, setShowSimplify] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [done, setDone] = useState(false)

  const { step1, step2 } = simplifyIPv6(FULL_ADDR)

  return (
    <div className="lesson-panel">
      <p className="lede">
        IPv4 provides ~4.3 billion addresses (2³²). The internet exhausted them. IPv6 uses <strong>128-bit</strong>{' '}
        addresses — enough for 3.4 × 10³⁸ unique addresses, more than every grain of sand on Earth.
      </p>

      <div className="lesson-interactive">
        <div className="lesson-instruction">
          <p>Explore IPv6 address simplification rules and see how the header compares to IPv4.</p>
        </div>

        <svg
          viewBox="0 0 720 100"
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0 auto' }}
          aria-label="IPv6 address groups"
        >
          {FULL_ADDR.split(':').map((group, i) => {
            const x = 14 + i * 88
            const isZero = group === '0000'
            return (
              <g key={i}>
                <rect
                  x={x}
                  y="10"
                  width="78"
                  height="36"
                  rx="5"
                  fill={isZero ? 'var(--signal, #61afef)' : 'var(--surface, #2c313a)'}
                  opacity={isZero ? 0.2 : 0.6}
                  stroke={isZero ? 'var(--signal, #61afef)' : 'var(--border)'}
                />
                <text
                  x={x + 39}
                  y="34"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="monospace"
                  fill={isZero ? 'var(--signal, #61afef)' : 'var(--fg)'}
                  fontWeight="600"
                >
                  {group}
                </text>
                {i < 7 && (
                  <text x={x + 83} y="34" fontSize="14" fill="var(--fg-muted, #888)" fontWeight="600">:</text>
                )}
                <text x={x + 39} y="62" textAnchor="middle" fontSize="9" fill="var(--fg-muted, #888)">
                  16 bits
                </text>
              </g>
            )
          })}
          <text x="360" y="86" textAnchor="middle" fontSize="11" fill="var(--fg-muted, #888)">
            8 groups × 16 bits = 128 bits total
          </text>
        </svg>

        {!showSimplify && (
          <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
            <button type="button" className="btn ghost" onClick={() => setShowSimplify(true)}>
              Show simplification rules
            </button>
          </div>
        )}

        {showSimplify && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ margin: '1rem 0', textAlign: 'center' }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <p className="micro" style={{ marginBottom: '0.25rem' }}><strong>Rule 1:</strong> Remove leading zeros in each group</p>
              <code style={{ fontSize: '0.9rem' }}>{FULL_ADDR}</code>
              <br />
              <span style={{ fontSize: '1.2rem' }}>↓</span>
              <br />
              <code style={{ fontSize: '0.9rem', color: 'var(--signal, #61afef)' }}>{step1}</code>
            </div>
            <div>
              <p className="micro" style={{ marginBottom: '0.25rem' }}><strong>Rule 2:</strong> Replace longest run of all-zero groups with ::</p>
              <code style={{ fontSize: '0.9rem' }}>{step1}</code>
              <br />
              <span style={{ fontSize: '1.2rem' }}>↓</span>
              <br />
              <code style={{ fontSize: '0.9rem', color: '#3ecf8e' }}>{step2}</code>
            </div>

            {!showCompare && (
              <div style={{ marginTop: '1rem' }}>
                <button type="button" className="btn ghost" onClick={() => setShowCompare(true)}>
                  Compare IPv4 vs IPv6 headers
                </button>
              </div>
            )}
          </motion.div>
        )}

        {showCompare && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <svg
              viewBox="0 0 720 260"
              style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0.5rem auto' }}
              aria-label="IPv4 vs IPv6 header comparison"
            >
              <text x="175" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#e06c75">
                IPv4 Header (13 fields)
              </text>
              {IPV4_HEADER_FIELDS.map((f, i) => {
                const col = i % 2
                const row = Math.floor(i / 2)
                return (
                  <g key={f}>
                    <rect
                      x={10 + col * 170}
                      y={30 + row * 28}
                      width="165"
                      height="24"
                      rx="3"
                      fill="#e06c75"
                      opacity={0.15}
                      stroke="#e06c75"
                      strokeOpacity={0.3}
                    />
                    <text
                      x={92 + col * 170}
                      y={46 + row * 28}
                      textAnchor="middle"
                      fontSize="9"
                      fill="var(--fg)"
                    >
                      {f}
                    </text>
                  </g>
                )
              })}

              <text x="545" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#61afef">
                IPv6 Header (8 fields)
              </text>
              {IPV6_HEADER_FIELDS.map((f, i) => (
                <g key={f}>
                  <rect
                    x={380}
                    y={30 + i * 28}
                    width="330"
                    height="24"
                    rx="3"
                    fill="#61afef"
                    opacity={0.15}
                    stroke="#61afef"
                    strokeOpacity={0.3}
                  />
                  <text
                    x={545}
                    y={46 + i * 28}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--fg)"
                  >
                    {f}
                  </text>
                </g>
              ))}
            </svg>

            <p className="micro" style={{ textAlign: 'center' }}>
              IPv6 is <strong>simpler</strong>: no checksum (handled by lower layers), no fragmentation fields (handled by source),
              and no options field (replaced by extension headers).
            </p>
          </motion.div>
        )}

        <ConnectionCard
          title="An address for everything"
          body={
            <>
              IPv6 doesn't just solve the address shortage — it eliminates the need for NAT, simplifies headers for
              faster routing, and includes built-in support for auto-configuration (SLAAC). Every IoT sensor, phone, and
              server can have its own globally routable address.
            </>
          }
          appearsIn={['modern networks', 'IoT', 'dual-stack deployment']}
          hook="IPv4 ran out of addresses. IPv6 has enough for every grain of sand on Earth."
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
