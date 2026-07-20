import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Tab = 'standards' | 'channels' | 'security'

const STANDARDS = [
  { gen: '802.11b', wifi: '—', freq: '2.4 GHz', speed: '11 Mbps', year: 1999, bar: 4 },
  { gen: '802.11a', wifi: '—', freq: '5 GHz', speed: '54 Mbps', year: 1999, bar: 10 },
  { gen: '802.11g', wifi: '—', freq: '2.4 GHz', speed: '54 Mbps', year: 2003, bar: 10 },
  { gen: '802.11n', wifi: 'Wi-Fi 4', freq: '2.4 / 5 GHz', speed: '600 Mbps', year: 2009, bar: 40 },
  { gen: '802.11ac', wifi: 'Wi-Fi 5', freq: '5 GHz', speed: '3.5 Gbps', year: 2013, bar: 70 },
  { gen: '802.11ax', wifi: 'Wi-Fi 6/6E', freq: '2.4 / 5 / 6 GHz', speed: '9.6 Gbps', year: 2020, bar: 100 },
]

const CHANNELS_24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const NON_OVERLAPPING = new Set([1, 6, 11])

const SVG_W = 440
const SVG_H = 220
const AP_X = SVG_W / 2
const AP_Y = 70

export function NsWireless({ onComplete }: Props) {
  const [tab, setTab] = useState<Tab>('standards')
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(() => new Set(['standards']))
  const [done, setDone] = useState(false)

  const selectTab = (t: Tab) => {
    setTab(t)
    setVisitedTabs((prev) => {
      const next = new Set(prev)
      next.add(t)
      return next
    })
  }

  const allVisited = visitedTabs.size >= 3

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          Wireless LANs use radio waves instead of cables. An <strong>Access Point</strong> (AP)
          broadcasts an <strong>SSID</strong> (network name) and manages a <strong>BSS</strong> (Basic
          Service Set) — the group of devices associated with it.
        </p>
        <p>
          Key challenges: limited spectrum means channels overlap, signals weaken with distance
          and obstacles, and shared medium means security requires encryption.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="Wireless access point and devices">
          {/* Signal rings */}
          {[80, 60, 40].map((r, i) => (
            <motion.circle
              key={r}
              cx={AP_X} cy={AP_Y} r={r}
              fill="none"
              stroke="var(--signal, #6366f1)"
              strokeWidth={1}
              opacity={0.15 + i * 0.1}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 + i * 0.1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            />
          ))}

          {/* AP */}
          <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <circle cx={AP_X} cy={AP_Y} r={18} fill="var(--signal, #6366f1)" />
            <text x={AP_X} y={AP_Y + 4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>AP</text>
          </motion.g>
          <text x={AP_X} y={AP_Y - 24} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={10} fontWeight={600}>
            SSID: LabNetwork
          </text>

          {/* Devices around AP */}
          {[
            { x: AP_X - 100, y: AP_Y + 60, label: 'Laptop' },
            { x: AP_X + 100, y: AP_Y + 50, label: 'Phone' },
            { x: AP_X - 60, y: AP_Y + 100, label: 'IoT Sensor' },
            { x: AP_X + 60, y: AP_Y + 100, label: 'Tablet' },
          ].map((dev, i) => (
            <motion.g
              key={dev.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <rect x={dev.x - 24} y={dev.y - 10} width={48} height={24} rx={5}
                fill="var(--surface-2, #1e293b)" stroke="var(--border, #334155)" />
              <text x={dev.x} y={dev.y + 4} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={8} fontWeight={600}>
                {dev.label}
              </text>
              <line x1={dev.x} y1={dev.y - 10} x2={AP_X} y2={AP_Y + 18}
                stroke="var(--signal, #6366f1)" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.4} />
            </motion.g>
          ))}

          <text x={AP_X} y={SVG_H - 4} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>
            BSS — all devices share the same channel and AP
          </text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
        {(['standards', 'channels', 'security'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`btn ${tab === t ? 'primary' : 'ghost'}`}
            onClick={() => selectTab(t)}
            style={{ fontSize: 12, textTransform: 'capitalize' }}
          >
            {t === 'standards' ? '802.11 Standards' : t === 'channels' ? 'Channels' : 'Security'}
            {visitedTabs.has(t) && t !== tab ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'standards' && (
          <motion.div
            key="standards"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STANDARDS.map((s) => (
                <div key={s.gen} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ width: 80, fontWeight: 600 }}>{s.gen}</span>
                  <span style={{ width: 70, color: 'var(--text-muted, #888)' }}>{s.wifi || '—'}</span>
                  <span style={{ width: 85, color: 'var(--text-muted, #888)', fontSize: 11 }}>{s.freq}</span>
                  <div style={{ flex: 1, height: 12, background: 'var(--surface-2, #1e293b)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'var(--signal, #6366f1)', borderRadius: 4 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.bar}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                  <span style={{ width: 65, textAlign: 'right', fontSize: 11 }}>{s.speed}</span>
                </div>
              ))}
            </div>
            <p className="micro" style={{ marginTop: '0.5rem' }}>
              Each generation brought wider channels, MIMO antennas, and better modulation.
              Wi-Fi 6 (802.11ax) introduced OFDMA to serve many devices efficiently.
            </p>
          </motion.div>
        )}

        {tab === 'channels' && (
          <motion.div
            key="channels"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <p className="micro" style={{ marginBottom: '0.5rem' }}>
              <strong>2.4 GHz band:</strong> 11 channels in the US, but each is 22 MHz wide and they
              overlap. Only channels <strong>1, 6, and 11</strong> don't overlap — using adjacent
              channels causes interference.
            </p>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', justifyContent: 'center', marginBottom: '0.75rem' }}>
              {CHANNELS_24.map((ch) => {
                const isGood = NON_OVERLAPPING.has(ch)
                return (
                  <motion.div
                    key={ch}
                    initial={{ height: 0 }}
                    animate={{ height: isGood ? 50 : 28 }}
                    transition={{ duration: 0.3, delay: ch * 0.04 }}
                    style={{
                      width: 28,
                      background: isGood ? '#10b981' : '#ef444466',
                      borderRadius: '4px 4px 0 0',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: 4,
                      border: `1px solid ${isGood ? '#10b981' : '#ef4444'}`,
                      borderBottom: 'none',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 600, color: isGood ? '#fff' : '#ef4444' }}>{ch}</span>
                  </motion.div>
                )
              })}
            </div>
            <p className="micro">
              <strong>5 GHz band:</strong> Many more non-overlapping channels (typically 20+ at 20 MHz each),
              but shorter range due to higher frequency. <strong>6 GHz</strong> (Wi-Fi 6E) adds even more clean spectrum.
            </p>
          </motion.div>
        )}

        {tab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                {
                  name: 'WPA2 (2004)',
                  color: '#f59e0b',
                  status: 'Still widely used',
                  details: 'Uses a Pre-Shared Key (PSK) or 802.1X/RADIUS. AES-CCMP encryption. Vulnerable to offline dictionary attacks against the 4-way handshake if PSK is weak.',
                },
                {
                  name: 'WPA3 (2018)',
                  color: '#10b981',
                  status: 'Current standard',
                  details: 'Replaces PSK with SAE (Simultaneous Authentication of Equals) — a zero-knowledge proof that prevents offline attacks. Forward secrecy means capturing today\'s traffic is useless if the key is later compromised.',
                },
              ].map((sec) => (
                <div
                  key={sec.name}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${sec.color}`,
                    background: `${sec.color}11`,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: sec.color }}>{sec.name} <span style={{ fontWeight: 400, fontSize: 11 }}>— {sec.status}</span></div>
                  <p className="micro" style={{ margin: '4px 0 0' }}>{sec.details}</p>
                </div>
              ))}
            </div>
            <p className="micro" style={{ marginTop: '0.5rem' }}>
              Enterprise networks use <strong>802.1X</strong> with a RADIUS server for per-user
              authentication instead of a shared password.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectionCard
        title="Network without wires"
        body={
          <>
            Wireless adds convenience but introduces unique challenges: shared medium means
            collision avoidance (CSMA/CA, not CSMA/CD), signal strength varies with distance
            and obstacles, and the open air means encryption is non-negotiable. Roaming between
            APs (802.11r) enables seamless movement across a campus.
          </>
        }
        appearsIn={['campus networks', 'home Wi-Fi', 'IoT deployment']}
        hook="Wireless adds freedom but also complexity — channels overlap, signals attenuate, and security must be airtight."
      />

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!allVisited || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!allVisited && (
          <span className="hint">
            Explore all three tabs to continue ({3 - visitedTabs.size} remaining).
          </span>
        )}
      </div>
    </div>
  )
}
