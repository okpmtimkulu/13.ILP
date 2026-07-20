import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Action = 'permit' | 'deny'
type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'Any'

type AclRule = {
  id: number
  action: Action
  protocol: Protocol
  src: string
  dst: string
  port: string
  desc: string
}

const DEFAULT_RULES: AclRule[] = [
  { id: 10, action: 'permit', protocol: 'TCP', src: '10.0.1.0/24', dst: 'Any', port: '443', desc: 'Allow internal network HTTPS out' },
  { id: 20, action: 'permit', protocol: 'TCP', src: '10.0.1.0/24', dst: 'Any', port: '80', desc: 'Allow internal network HTTP out' },
  { id: 30, action: 'permit', protocol: 'UDP', src: '10.0.1.0/24', dst: '8.8.8.8', port: '53', desc: 'Allow DNS queries to Google DNS' },
  { id: 40, action: 'permit', protocol: 'ICMP', src: '10.0.1.0/24', dst: 'Any', port: '—', desc: 'Allow ping for troubleshooting' },
  { id: 50, action: 'deny', protocol: 'TCP', src: 'Any', dst: '10.0.1.0/24', port: '22', desc: 'Block inbound SSH from outside' },
]

const IMPLICIT_DENY: AclRule = {
  id: 999, action: 'deny', protocol: 'Any', src: 'Any', dst: 'Any', port: 'Any', desc: 'Implicit deny — blocks everything not explicitly permitted',
}

type TestPacket = {
  protocol: Protocol
  src: string
  dst: string
  port: string
  label: string
}

const TEST_PACKETS: TestPacket[] = [
  { protocol: 'TCP', src: '10.0.1.50', dst: '93.184.216.34', port: '443', label: 'Internal host → HTTPS' },
  { protocol: 'UDP', src: '10.0.1.50', dst: '8.8.8.8', port: '53', label: 'Internal host → DNS' },
  { protocol: 'TCP', src: '203.0.113.5', dst: '10.0.1.10', port: '22', label: 'External → SSH into server' },
  { protocol: 'TCP', src: '10.0.1.50', dst: '93.184.216.34', port: '3306', label: 'Internal → MySQL (not allowed)' },
]

const SVG_W = 460
const SVG_H = 160

function matchesRule(rule: AclRule, pkt: TestPacket): boolean {
  if (rule.protocol !== 'Any' && rule.protocol !== pkt.protocol) return false
  if (rule.src !== 'Any' && !pkt.src.startsWith(rule.src.replace('/24', '').slice(0, -1))) return false
  if (rule.dst !== 'Any' && !pkt.dst.startsWith(rule.dst.replace('/24', '').slice(0, -1))) return false
  if (rule.port !== '—' && rule.port !== 'Any' && rule.port !== pkt.port) return false
  return true
}

export function NsACL({ onComplete }: Props) {
  const [testIdx, setTestIdx] = useState<number | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const [matchedRule, setMatchedRule] = useState<number | null>(null)
  const [highlightRow, setHighlightRow] = useState<number | null>(null)
  const [testedPackets, setTestedPackets] = useState<Set<number>>(() => new Set())
  const [done, setDone] = useState(false)

  const allRules = [...DEFAULT_RULES, IMPLICIT_DENY]

  const testPacket = (pktIdx: number) => {
    if (evaluating) return
    const pkt = TEST_PACKETS[pktIdx]
    setTestIdx(pktIdx)
    setEvaluating(true)
    setMatchedRule(null)
    setHighlightRow(null)

    let ruleIdx = 0
    const step = () => {
      setHighlightRow(ruleIdx)
      const rule = allRules[ruleIdx]
      if (matchesRule(rule, pkt)) {
        setTimeout(() => {
          setMatchedRule(ruleIdx)
          setEvaluating(false)
          setTestedPackets((prev) => {
            const next = new Set(prev)
            next.add(pktIdx)
            return next
          })
        }, 400)
      } else if (ruleIdx < allRules.length - 1) {
        ruleIdx++
        setTimeout(step, 350)
      } else {
        setTimeout(() => {
          setMatchedRule(allRules.length - 1)
          setEvaluating(false)
          setTestedPackets((prev) => {
            const next = new Set(prev)
            next.add(pktIdx)
            return next
          })
        }, 400)
      }
    }
    setTimeout(step, 200)
  }

  const allTested = testedPackets.size >= TEST_PACKETS.length
  const matchedAction = matchedRule !== null ? allRules[matchedRule].action : null

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          An <strong>Access Control List</strong> (ACL) is an ordered set of rules evaluated
          <strong> top-to-bottom</strong>. Each rule either permits or denies traffic matching
          its criteria. The <strong>first match wins</strong> — once a packet matches a rule,
          evaluation stops.
        </p>
        <p>
          Every ACL ends with an <strong>implicit deny</strong>: if no rule matches, the packet
          is dropped. This "default deny" posture is fundamental to network security.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="Firewall between two zones">
          {/* Internal zone */}
          <rect x={10} y={20} width={140} height={120} rx={10} fill="var(--surface-2, #1e293b)" opacity={0.4} />
          <text x={80} y={40} textAnchor="middle" fill="#10b981" fontSize={10} fontWeight={700}>Internal Zone</text>
          <text x={80} y={55} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>10.0.1.0/24</text>
          <rect x={40} y={70} width={80} height={24} rx={5} fill="var(--surface-3, #2d3748)" stroke="var(--border, #334155)" />
          <text x={80} y={86} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9}>Hosts</text>
          <rect x={40} y={100} width={80} height={24} rx={5} fill="var(--surface-3, #2d3748)" stroke="var(--border, #334155)" />
          <text x={80} y={116} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9}>Servers</text>

          {/* Firewall */}
          <rect x={185} y={30} width={90} height={100} rx={8} fill="var(--surface-2, #1e293b)" stroke="#ef4444" strokeWidth={2} />
          <text x={230} y={55} textAnchor="middle" fill="#ef4444" fontSize={11} fontWeight={800}>Firewall</text>
          <text x={230} y={72} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>ACL Rules</text>
          <text x={230} y={86} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>Top → Bottom</text>
          <text x={230} y={118} textAnchor="middle" fill="#ef444488" fontSize={7}>implicit deny ✕</text>

          {/* External zone */}
          <rect x={310} y={20} width={140} height={120} rx={10} fill="var(--surface-2, #1e293b)" opacity={0.4} />
          <text x={380} y={40} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight={700}>External Zone</text>
          <text x={380} y={55} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>Internet</text>
          <rect x={340} y={70} width={80} height={24} rx={5} fill="var(--surface-3, #2d3748)" stroke="var(--border, #334155)" />
          <text x={380} y={86} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9}>Web servers</text>
          <rect x={340} y={100} width={80} height={24} rx={5} fill="var(--surface-3, #2d3748)" stroke="var(--border, #334155)" />
          <text x={380} y={116} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9}>Attackers</text>

          {/* Arrows */}
          <line x1={150} y1={80} x2={185} y2={80} stroke="var(--border, #334155)" strokeWidth={1.5} markerEnd="url(#acl-arr)" />
          <line x1={275} y1={80} x2={310} y2={80} stroke="var(--border, #334155)" strokeWidth={1.5} markerEnd="url(#acl-arr)" />

          <defs>
            <marker id="acl-arr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border, #334155)" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* ACL Table */}
      <div style={{ overflowX: 'auto', margin: '0.5rem 0' }}>
        <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border, #334155)' }}>
              {['#', 'Action', 'Proto', 'Source', 'Destination', 'Port'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '4px 6px', color: 'var(--text-muted, #888)', fontWeight: 600, fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRules.map((rule, i) => {
              const isHighlighted = highlightRow === i
              const isMatched = matchedRule === i
              return (
                <motion.tr
                  key={rule.id}
                  animate={{
                    backgroundColor: isMatched
                      ? rule.action === 'permit' ? '#10b98122' : '#ef444422'
                      : isHighlighted ? '#f59e0b22' : 'transparent',
                  }}
                  style={{ borderBottom: '1px solid var(--border, #33415544)' }}
                >
                  <td style={{ padding: '4px 6px', fontWeight: 600 }}>{rule.id}</td>
                  <td style={{
                    padding: '4px 6px',
                    fontWeight: 700,
                    color: rule.action === 'permit' ? '#10b981' : '#ef4444',
                  }}>
                    {rule.action.toUpperCase()}
                  </td>
                  <td style={{ padding: '4px 6px' }}>{rule.protocol}</td>
                  <td style={{ padding: '4px 6px' }}><code style={{ fontSize: 10 }}>{rule.src}</code></td>
                  <td style={{ padding: '4px 6px' }}><code style={{ fontSize: 10 }}>{rule.dst}</code></td>
                  <td style={{ padding: '4px 6px' }}>{rule.port}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="micro" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Test packets — click to evaluate against the ACL:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {TEST_PACKETS.map((pkt, i) => {
          const tested = testedPackets.has(i)
          const isActive = testIdx === i
          return (
            <motion.button
              key={pkt.label}
              type="button"
              className="btn ghost"
              disabled={evaluating}
              onClick={() => testPacket(i)}
              style={{
                textAlign: 'left',
                fontSize: 12,
                padding: '8px 12px',
                border: isActive && matchedAction
                  ? `1px solid ${matchedAction === 'permit' ? '#10b981' : '#ef4444'}`
                  : '1px solid var(--border, #334155)',
                background: tested ? 'var(--surface-2, #1e293b)' : 'transparent',
              }}
              animate={isActive && evaluating ? { scale: [1, 1.01, 1] } : {}}
              transition={{ repeat: evaluating ? Infinity : 0, duration: 0.6 }}
            >
              <span style={{ fontWeight: 600 }}>{pkt.label}</span>
              <span style={{ marginLeft: 8, color: 'var(--text-muted, #888)', fontSize: 11 }}>
                {pkt.protocol} {pkt.src}→{pkt.dst}:{pkt.port}
              </span>
              {tested && isActive && matchedAction && (
                <span style={{
                  marginLeft: 8,
                  fontWeight: 700,
                  color: matchedAction === 'permit' ? '#10b981' : '#ef4444',
                }}>
                  {matchedAction === 'permit' ? '✓ PERMIT' : '✕ DENY'}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {matchedRule !== null && testIdx !== null && (
          <motion.div
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '0.75rem' }}
          >
            <p>
              <strong>Matched rule #{allRules[matchedRule].id}:</strong> {allRules[matchedRule].desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '0.75rem', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #334155)', fontSize: 12 }}>
        <strong>Stateful vs Stateless:</strong> A <em>stateless</em> firewall evaluates each packet
        independently — you need rules for both directions. A <em>stateful</em> firewall tracks
        connection state: once an outbound connection is permitted, return traffic is automatically
        allowed without an explicit inbound rule.
      </div>

      <ConnectionCard
        title="Permit or deny"
        body={
          <>
            ACLs are evaluated sequentially — the most specific rules go at the top, and the
            implicit deny at the bottom catches everything else. Misorderd rules are a common
            source of security holes. Stateful firewalls reduce rule complexity by tracking
            established connections.
          </>
        }
        appearsIn={['network security', 'firewall configuration', 'zone-based policy']}
        hook="ACLs are the first line of defense — every packet is checked against the rules, top to bottom, first match wins."
      />

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!allTested || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!allTested && (
          <span className="hint">
            Test all {TEST_PACKETS.length} packets to continue ({TEST_PACKETS.length - testedPackets.size} remaining).
          </span>
        )}
      </div>
    </div>
  )
}
