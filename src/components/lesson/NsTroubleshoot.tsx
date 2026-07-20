import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Tool = 'ping-gw' | 'ping-remote' | 'ping-dns' | 'traceroute'
type TestResult = 'pending' | 'running' | 'success' | 'fail'

type DiagStep = {
  id: Tool
  label: string
  command: string
  successMsg: string
  failMsg: string
  layer: string
  layerCheck: string
}

const DIAG_STEPS: DiagStep[] = [
  {
    id: 'ping-gw',
    label: '1. Ping default gateway',
    command: 'ping 192.168.1.1',
    successMsg: 'Reply from 192.168.1.1: time=1ms — Layer 1-2 OK (cable, NIC, switch all working).',
    failMsg: 'No reply — check physical connection, NIC status, and switch port.',
    layer: 'Physical + Data Link',
    layerCheck: 'Can we reach our own gateway?',
  },
  {
    id: 'ping-remote',
    label: '2. Ping remote IP',
    command: 'ping 8.8.8.8',
    successMsg: 'Reply from 8.8.8.8: time=12ms — Layer 3 OK (routing works, packets leave the network).',
    failMsg: 'No reply — routing issue. Check default route, NAT, or upstream router.',
    layer: 'Network',
    layerCheck: 'Can packets reach the internet by IP?',
  },
  {
    id: 'ping-dns',
    label: '3. Ping by domain name',
    command: 'ping google.com',
    successMsg: 'google.com → 142.250.80.46, Reply: time=14ms — DNS resolution working.',
    failMsg: 'Cannot resolve — DNS server unreachable or misconfigured. Check /etc/resolv.conf.',
    layer: 'Application (DNS)',
    layerCheck: 'Can we resolve names to IPs?',
  },
  {
    id: 'traceroute',
    label: '4. Traceroute',
    command: 'traceroute example.com',
    successMsg: 'Full path visible — 8 hops to destination, no drops.',
    failMsg: 'Packets stop at hop 5 — the issue is at that router or link.',
    layer: 'Path analysis',
    layerCheck: 'Where exactly do packets stop?',
  },
]

const TRACE_HOPS = [
  { hop: 1, ip: '192.168.1.1', ms: '1', label: 'Gateway' },
  { hop: 2, ip: '10.0.0.1', ms: '3', label: 'ISP edge' },
  { hop: 3, ip: '72.14.215.85', ms: '5', label: 'ISP core' },
  { hop: 4, ip: '108.170.250.33', ms: '8', label: 'Peering' },
  { hop: 5, ip: '142.251.65.174', ms: '10', label: 'Provider' },
  { hop: 6, ip: '93.184.216.34', ms: '12', label: 'Destination' },
]

const LAYERS_BOTTOM_UP = [
  { num: 1, name: 'Physical', check: 'Cable plugged in? Link light on?', color: '#fb7185' },
  { num: 2, name: 'Data Link', check: 'MAC address, ARP, switch port active?', color: '#f472b6' },
  { num: 3, name: 'Network', check: 'IP configured? Can ping gateway? Routing?', color: '#e879f9' },
  { num: 4, name: 'Transport', check: 'Port open? Firewall blocking? TCP handshake?', color: '#c084fc' },
  { num: 5, name: 'Application', check: 'DNS resolving? Service running? Correct config?', color: '#818cf8' },
]

const SVG_W = 460
const SVG_H = 180

export function NsTroubleshoot({ onComplete }: Props) {
  const [results, setResults] = useState<Record<Tool, TestResult>>({
    'ping-gw': 'pending',
    'ping-remote': 'pending',
    'ping-dns': 'pending',
    'traceroute': 'pending',
  })
  const [currentTool, setCurrentTool] = useState<Tool | null>(null)
  const [showTrace, setShowTrace] = useState(false)
  const [done, setDone] = useState(false)

  const runTool = (tool: Tool) => {
    const toolOrder: Tool[] = ['ping-gw', 'ping-remote', 'ping-dns', 'traceroute']
    const idx = toolOrder.indexOf(tool)

    for (let i = 0; i < idx; i++) {
      if (results[toolOrder[i]] === 'pending') return
    }

    setCurrentTool(tool)
    setResults((prev) => ({ ...prev, [tool]: 'running' }))

    setTimeout(() => {
      setResults((prev) => ({ ...prev, [tool]: 'success' }))
      if (tool === 'traceroute') setShowTrace(true)
    }, 800)
  }

  const allDone = Object.values(results).every((r) => r === 'success')

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          Effective network troubleshooting is <strong>methodical, not random</strong>. The
          bottom-up approach starts at the physical layer and works up: if a lower layer is
          broken, higher layers can't function.
        </p>
        <p>
          A host can't reach <code>example.com</code>. Work through these diagnostic tools
          in order to isolate the problem.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="Network troubleshooting path">
          {/* Host */}
          <rect x={20} y={60} width={70} height={40} rx={8} fill="var(--surface-2, #1e293b)" stroke="#ef4444" strokeWidth={1.5} />
          <text x={55} y={76} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9} fontWeight={600}>Broken Host</text>
          <text x={55} y={90} textAnchor="middle" fill="#ef4444" fontSize={8}>10.0.1.50</text>

          {/* Gateway */}
          <rect x={130} y={60} width={60} height={40} rx={8}
            fill={results['ping-gw'] === 'success' ? '#10b98122' : 'var(--surface-2, #1e293b)'}
            stroke={results['ping-gw'] === 'success' ? '#10b981' : 'var(--border, #334155)'}
          />
          <text x={160} y={76} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9} fontWeight={600}>Gateway</text>
          <text x={160} y={90} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>192.168.1.1</text>

          {/* Internet cloud */}
          <ellipse cx={255} cy={80} rx={40} ry={25}
            fill={results['ping-remote'] === 'success' ? '#10b98122' : 'var(--surface-2, #1e293b)'}
            stroke={results['ping-remote'] === 'success' ? '#10b981' : 'var(--border, #334155)'}
          />
          <text x={255} y={84} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9} fontWeight={600}>Internet</text>

          {/* DNS */}
          <rect x={320} y={30} width={50} height={30} rx={6}
            fill={results['ping-dns'] === 'success' ? '#10b98122' : 'var(--surface-2, #1e293b)'}
            stroke={results['ping-dns'] === 'success' ? '#10b981' : 'var(--border, #334155)'}
          />
          <text x={345} y={49} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={8} fontWeight={600}>DNS</text>

          {/* Destination */}
          <rect x={380} y={60} width={70} height={40} rx={8}
            fill={results['traceroute'] === 'success' ? '#10b98122' : 'var(--surface-2, #1e293b)'}
            stroke={results['traceroute'] === 'success' ? '#10b981' : 'var(--border, #334155)'}
          />
          <text x={415} y={76} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9} fontWeight={600}>example.com</text>
          <text x={415} y={90} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>93.184.216.34</text>

          {/* Links */}
          <line x1={90} y1={80} x2={130} y2={80} stroke="var(--border, #334155)" strokeWidth={1.5} />
          <line x1={190} y1={80} x2={215} y2={80} stroke="var(--border, #334155)" strokeWidth={1.5} />
          <line x1={295} y1={75} x2={320} y2={50} stroke="var(--border, #334155)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={295} y1={80} x2={380} y2={80} stroke="var(--border, #334155)" strokeWidth={1.5} />

          {/* Progress dots */}
          {results['ping-gw'] === 'success' && (
            <motion.circle cx={110} cy={80} r={5} fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} />
          )}
          {results['ping-remote'] === 'success' && (
            <motion.circle cx={205} cy={80} r={5} fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} />
          )}
          {results['traceroute'] === 'success' && (
            <motion.circle cx={340} cy={80} r={5} fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} />
          )}

          {/* Legend */}
          <text x={SVG_W / 2} y={SVG_H - 8} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>
            Test each hop systematically: gateway → remote IP → DNS → full path
          </text>
        </svg>
      </div>

      {/* Diagnostic steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '0.5rem 0' }}>
        {DIAG_STEPS.map((step, i) => {
          const result = results[step.id]
          const canRun = i === 0 || results[DIAG_STEPS[i - 1].id] === 'success'
          const isActive = currentTool === step.id

          return (
            <motion.div
              key={step.id}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${result === 'success' ? '#10b981' : result === 'running' ? '#f59e0b' : 'var(--border, #334155)'}`,
                background: result === 'success' ? '#10b98108' : 'transparent',
                opacity: canRun || result !== 'pending' ? 1 : 0.4,
              }}
              animate={result === 'running' ? { borderColor: ['#f59e0b', '#f59e0b88', '#f59e0b'] } : {}}
              transition={result === 'running' ? { repeat: Infinity, duration: 1 } : {}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{step.label}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted, #888)' }}>({step.layer})</span>
                </div>
                {result === 'pending' && canRun && (
                  <button type="button" className="btn ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => runTool(step.id)}>
                    Run
                  </button>
                )}
                {result === 'running' && <span style={{ fontSize: 11, color: '#f59e0b' }}>Running…</span>}
                {result === 'success' && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>✓ Pass</span>}
              </div>
              <p className="micro" style={{ margin: '4px 0 0', color: 'var(--text-muted, #888)' }}>
                <code style={{ fontSize: 11 }}>$ {step.command}</code> — {step.layerCheck}
              </p>
              <AnimatePresence>
                {result === 'success' && isActive && (
                  <motion.p
                    className="micro"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ margin: '6px 0 0', color: '#10b981' }}
                  >
                    {step.successMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Traceroute output */}
      {showTrace && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '0.75rem 0',
            padding: '10px 14px',
            borderRadius: 8,
            background: 'var(--surface-2, #1e293b)',
            fontFamily: 'monospace',
            fontSize: 11,
          }}
        >
          <p style={{ margin: '0 0 6px', fontWeight: 600, fontFamily: 'inherit', fontSize: 12 }}>
            $ traceroute example.com
          </p>
          {TRACE_HOPS.map((hop, i) => (
            <motion.div
              key={hop.hop}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              style={{ display: 'flex', gap: 8, padding: '2px 0' }}
            >
              <span style={{ width: 20, textAlign: 'right', color: 'var(--text-muted, #888)' }}>{hop.hop}</span>
              <span style={{ width: 130 }}>{hop.ip}</span>
              <span style={{ width: 40, color: '#10b981' }}>{hop.ms}ms</span>
              <span style={{ color: 'var(--text-muted, #888)' }}>{hop.label}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Bottom-up methodology */}
      <div style={{ margin: '1rem 0' }}>
        <p className="micro" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          Bottom-up troubleshooting methodology:
        </p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {LAYERS_BOTTOM_UP.map((layer) => (
            <div
              key={layer.num}
              style={{
                flex: 1,
                minWidth: 80,
                padding: '6px 8px',
                borderRadius: 6,
                border: `1px solid ${layer.color}`,
                background: `${layer.color}11`,
                fontSize: 10,
              }}
            >
              <div style={{ fontWeight: 700, color: layer.color }}>L{layer.num} {layer.name}</div>
              <div style={{ color: 'var(--text-muted, #888)', marginTop: 2 }}>{layer.check}</div>
            </div>
          ))}
        </div>
      </div>

      <ConnectionCard
        title="Finding the break"
        body={
          <>
            The key insight: each test validates a specific layer. If ping to the gateway fails,
            don't bother testing DNS — fix layers 1-2 first. If ping works by IP but not by name,
            the issue is DNS, not routing. Traceroute reveals the exact hop where packets stop,
            narrowing the problem to a specific link or router.
          </>
        }
        appearsIn={['help desk', 'network operations', 'incident response']}
        hook="Troubleshooting is a method, not a guess. Start at the bottom of the stack and work up."
      />

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!allDone || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!allDone && (
          <span className="hint">
            Run each diagnostic tool in order to continue.
          </span>
        )}
      </div>
    </div>
  )
}
