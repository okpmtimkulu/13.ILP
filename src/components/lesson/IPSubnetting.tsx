import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

function ipToNum(a: number, b: number, c: number, d: number) {
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0
}

function numToIp(n: number): string {
  return `${(n >>> 24) & 0xff}.${(n >>> 16) & 0xff}.${(n >>> 8) & 0xff}.${n & 0xff}`
}

function getSubnets(baseIp: number, baseCidr: number, newCidr: number) {
  const count = 1 << (newCidr - baseCidr)
  const blockSize = 1 << (32 - newCidr)
  const subnets = []
  for (let i = 0; i < count; i++) {
    const network = baseIp + i * blockSize
    const broadcast = network + blockSize - 1
    subnets.push({
      network,
      firstUsable: network + 1,
      lastUsable: broadcast - 1,
      broadcast,
      hosts: blockSize - 2,
    })
  }
  return subnets
}

export function IPSubnetting({ onComplete }: Props) {
  const [cidr, setCidr] = useState(24)
  const [done, setDone] = useState(false)

  const baseIp = ipToNum(10, 0, 0, 0)
  const baseCidr = 24
  const subnets = getSubnets(baseIp, baseCidr, cidr)
  const totalHosts = (1 << (32 - baseCidr)) - 2
  const barWidth = 660

  return (
    <div className="lesson-panel">
      <p className="lede">
        Subnetting divides a single network into smaller segments. By borrowing bits from the host portion, you create
        multiple subnets — each with fewer hosts. <strong>CIDR notation</strong> (e.g. /25, /26) tells you exactly how
        many bits identify the network.
      </p>

      <div className="lesson-interactive">
        <div className="lesson-instruction">
          <p>
            Drag the slider to increase the prefix length. Watch the address space split into more subnets, each with
            fewer hosts.
          </p>
        </div>

        <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
          <label style={{ fontSize: '0.9rem' }}>
            <strong>10.0.0.0 /</strong>
            <input
              type="range"
              min={baseCidr}
              max={30}
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              style={{ verticalAlign: 'middle', margin: '0 0.5rem', width: 160 }}
            />
            <strong>{cidr}</strong>
          </label>
          <div className="micro" style={{ marginTop: '0.25rem' }}>
            {subnets.length} subnet{subnets.length > 1 ? 's' : ''} × {subnets[0].hosts} usable hosts
            {' '}(original: {totalHosts} hosts)
          </div>
        </div>

        <svg
          viewBox="0 0 720 180"
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0.5rem auto' }}
          aria-label="Subnet address space visualization"
        >
          <rect x="30" y="20" width={barWidth} height="30" rx="4" fill="var(--surface, #2c313a)" stroke="var(--border)" />

          {subnets.map((s, i) => {
            const w = barWidth / subnets.length
            const hue = (i * 360) / subnets.length
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <rect
                  x={30 + i * w + 1}
                  y="21"
                  width={w - 2}
                  height="28"
                  rx="3"
                  fill={`hsl(${hue}, 55%, 55%)`}
                  opacity={0.7}
                />
                {w > 20 && (
                  <text
                    x={30 + i * w + w / 2}
                    y="40"
                    textAnchor="middle"
                    fontSize={w > 80 ? 11 : 8}
                    fill="#fff"
                    fontWeight="600"
                  >
                    /{cidr}
                  </text>
                )}
              </motion.g>
            )
          })}

          <text x="30" y="72" fontSize="11" fontWeight="600" fill="var(--fg)">Subnet details:</text>

          {subnets.slice(0, 6).map((s, i) => {
            const y = 88 + i * 15
            return (
              <text key={i} x="30" y={y} fontSize="10" fill="var(--fg-muted, #888)" fontFamily="monospace">
                {numToIp(s.network)}/{cidr}  →  usable {numToIp(s.firstUsable)} – {numToIp(s.lastUsable)}
                {'  '}broadcast {numToIp(s.broadcast)}
              </text>
            )
          })}

          {subnets.length > 6 && (
            <text x="30" y={88 + 6 * 15} fontSize="10" fill="var(--fg-muted, #888)" fontStyle="italic">
              …and {subnets.length - 6} more subnet{subnets.length - 6 > 1 ? 's' : ''}
            </text>
          )}
        </svg>

        <motion.div
          key={cidr}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ textAlign: 'center', margin: '0.5rem 0', fontSize: '0.85rem' }}
        >
          <strong>Bits borrowed:</strong> {cidr - baseCidr} | <strong>Subnets:</strong> {subnets.length} |{' '}
          <strong>Hosts/subnet:</strong> {subnets[0].hosts} |{' '}
          <strong>Block size:</strong> {1 << (32 - cidr)}
        </motion.div>

        <ConnectionCard
          title="Dividing address space"
          body={
            <>
              Each time you add one bit to the prefix, you double the number of subnets and halve the hosts per subnet.
              Subnetting lets you match network segments to actual needs — a point-to-point link only needs 2 hosts (/30),
              while a floor of workstations might need 200 (/24). Waste fewer addresses, avoid overlap.
            </>
          }
          appearsIn={['network planning', 'IP allocation', 'route summarization']}
          hook="Subnetting is how one network becomes many — and getting it right saves addresses and prevents overlap."
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
