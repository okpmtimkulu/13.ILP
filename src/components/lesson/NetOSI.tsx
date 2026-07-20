import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

const LAYERS = [
  {
    num: 7, name: 'Application', color: '#6366f1', proto: 'HTTP, DNS, FTP, SMTP',
    desc: 'Where user-facing software interacts with the network. Your browser, email client, and API calls all live here.',
    header: 'App Data',
  },
  {
    num: 6, name: 'Presentation', color: '#818cf8', proto: 'TLS/SSL, JPEG, ASCII',
    desc: 'Handles data translation, encryption, and compression. TLS encrypts here before handing down to the session layer.',
    header: 'Enc',
  },
  {
    num: 5, name: 'Session', color: '#a78bfa', proto: 'NetBIOS, RPC',
    desc: 'Establishes, maintains, and tears down sessions between applications. Keeps track of whose turn it is to talk.',
    header: 'Ses',
  },
  {
    num: 4, name: 'Transport', color: '#c084fc', proto: 'TCP, UDP',
    desc: 'Segments data and provides reliable (TCP) or fast (UDP) delivery. Adds port numbers so the right app gets the data.',
    header: 'TCP',
  },
  {
    num: 3, name: 'Network', color: '#e879f9', proto: 'IP, ICMP, OSPF',
    desc: 'Adds source and destination IP addresses. Routers operate here to forward packets across networks.',
    header: 'IP',
  },
  {
    num: 2, name: 'Data Link', color: '#f472b6', proto: 'Ethernet, Wi-Fi, ARP',
    desc: 'Frames data with MAC addresses for local delivery. Switches operate here. Error detection via FCS.',
    header: 'ETH',
  },
  {
    num: 1, name: 'Physical', color: '#fb7185', proto: 'Cables, radio, light',
    desc: 'Converts frames into electrical signals, light pulses, or radio waves on the physical medium.',
    header: 'Bits',
  },
] as const

export function NetOSI({ onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [visitedLayers, setVisitedLayers] = useState<Set<number>>(() => new Set())

  const handleSelect = (idx: number) => {
    setSelected(idx === selected ? null : idx)
    setVisitedLayers((prev) => {
      const next = new Set(prev)
      next.add(idx)
      return next
    })
  }

  const allVisited = visitedLayers.size === LAYERS.length
  const selectedLayer = selected !== null ? LAYERS[selected] : null

  const LW = 220
  const LH = 38
  const GAP = 4
  const PAD = 20
  const SVG_W = 420
  const SVG_H = PAD * 2 + LAYERS.length * (LH + GAP)

  return (
    <div className="lesson-panel">
      <p className="lede">
        The OSI model splits network communication into <strong>seven layers</strong>. Data starts at
        the top (Application) and is <em>encapsulated</em> with a new header at each layer as it
        travels down to the wire.
      </p>
      <p className="micro">Click each layer to see what it does. Visit all seven to continue.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W, overflow: 'visible' }}
          role="img"
          aria-label="OSI model layers with encapsulation"
        >
          {LAYERS.map((layer, i) => {
            const y = PAD + i * (LH + GAP)
            const isSelected = selected === i
            const isVisited = visitedLayers.has(i)

            const encapWidth = LW + (LAYERS.length - i) * 18
            const encapX = (SVG_W - encapWidth) / 2

            return (
              <g key={layer.num}>
                <motion.rect
                  x={encapX}
                  y={y}
                  width={encapWidth}
                  height={LH}
                  rx={6}
                  fill={layer.color}
                  opacity={isSelected ? 1 : isVisited ? 0.8 : 0.5}
                  stroke={isSelected ? '#fff' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                  style={{ cursor: 'pointer' }}
                  animate={{ opacity: isSelected ? 1 : isVisited ? 0.8 : 0.5 }}
                  whileHover={{ opacity: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleSelect(i)}
                />
                <text
                  x={SVG_W / 2}
                  y={y + LH / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  fontSize={13}
                  fontWeight={600}
                  pointerEvents="none"
                >
                  L{layer.num} — {layer.name}
                </text>
                {i > 0 && (
                  <text
                    x={encapX + 8}
                    y={y + LH / 2 + 1}
                    dominantBaseline="central"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={9}
                    fontWeight={500}
                    pointerEvents="none"
                  >
                    +{layer.header}
                  </text>
                )}
              </g>
            )
          })}

          <text
            x={SVG_W / 2}
            y={SVG_H - 4}
            textAnchor="middle"
            fill="var(--text-muted, #888)"
            fontSize={10}
          >
            ← wider = more encapsulation headers →
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {selectedLayer && (
          <motion.div
            key={selectedLayer.num}
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h3 style={{ margin: '0 0 0.25rem' }}>
              Layer {selectedLayer.num}: {selectedLayer.name}
            </h3>
            <p style={{ margin: '0 0 0.25rem' }}>{selectedLayer.desc}</p>
            <p className="micro" style={{ margin: 0 }}>
              Protocols: {selectedLayer.proto}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="micro" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Layers explored: {visitedLayers.size} / {LAYERS.length}
      </p>

      {allVisited && (
        <ConnectionCard
          title="Seven layers, one packet"
          body={
            <>
              Each layer adds its own header as data moves down the stack — this is encapsulation.
              At the receiving end the process reverses: each layer strips its header and passes the
              payload up. Troubleshooting starts by identifying which layer is failing.
            </>
          }
          appearsIn={['CCNA fundamentals', 'network troubleshooting', 'protocol design']}
          hook="When something breaks on a network, the first question is always: which layer?"
        />
      )}

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
            Click every layer to explore the full stack ({LAYERS.length - visitedLayers.size} remaining).
          </span>
        )}
      </div>
    </div>
  )
}
