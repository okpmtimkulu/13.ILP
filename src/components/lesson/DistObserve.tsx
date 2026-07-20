import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Panel = 'logs' | 'metrics' | 'traces'

const LOG_LINES = [
  { level: 'INFO', service: 'api-gateway', msg: 'GET /users/42 200 12ms', user: '42' },
  { level: 'INFO', service: 'auth-service', msg: 'Token verified user_id=42', user: '42' },
  { level: 'WARN', service: 'user-service', msg: 'DB query slow 820ms', user: '42' },
  { level: 'ERROR', service: 'user-service', msg: 'DB connection timeout user_id=99', user: '99' },
  { level: 'INFO', service: 'api-gateway', msg: 'GET /orders 200 8ms', user: '15' },
  { level: 'ERROR', service: 'email-service', msg: 'SMTP error sending to user_id=42', user: '42' },
  { level: 'INFO', service: 'api-gateway', msg: 'POST /orders 201 45ms', user: '7' },
  { level: 'INFO', service: 'user-service', msg: 'Cache hit user_id=15', user: '15' },
]

const TRACE_SPANS = [
  { service: 'API Gateway', start: 0, duration: 1000, isSlowDB: false },
  { service: 'Auth Service', start: 10, duration: 45, isSlowDB: false },
  { service: 'User Service', start: 60, duration: 910, isSlowDB: false },
  { service: 'Database', start: 80, duration: 820, isSlowDB: true },
]

const LATENCY_POINTS = [12, 8, 15, 11, 820, 14, 9, 13, 10, 780, 12, 850, 11, 8]

export function DistObserve({ onComplete }: { onComplete: () => void }) {
  const [panel, setPanel] = useState<Panel>('logs')
  const [seen, setSeen] = useState<Set<Panel>>(new Set(['logs']))
  const [logFilter, setLogFilter] = useState('')
  const [latencySpike, setLatencySpike] = useState(false)
  const [alertFired, setAlertFired] = useState(false)
  const [bottleneckFound, setBottleneckFound] = useState(false)
  const [done, setDone] = useState(false)

  const switchPanel = (p: Panel) => {
    setPanel(p)
    setSeen((prev) => new Set([...prev, p]))
  }

  const filteredLogs = LOG_LINES.filter((l) => {
    if (!logFilter) return true
    if (logFilter === 'ERROR') return l.level === 'ERROR'
    if (logFilter.startsWith('user_id:')) {
      const uid = logFilter.split(':')[1]
      return l.user === uid
    }
    return l.msg.toLowerCase().includes(logFilter.toLowerCase()) || l.service.includes(logFilter)
  })

  const introduceSlowQuery = () => {
    setLatencySpike(true)
    setTimeout(() => setAlertFired(true), 800)
  }

  const allSeen = seen.size === 3
  const canComplete = allSeen && (alertFired || bottleneckFound)

  const levelColor: Record<string, string> = {
    INFO: '#94a3b8',
    WARN: '#f59e0b',
    ERROR: '#ef4444',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Observability has three pillars: <strong>Logs</strong> (what happened), <strong>Metrics</strong> (how much),
        and <strong>Traces</strong> (where time went). Without all three, production debugging is guesswork.
      </p>

      <div className="dist-obs-tabs">
        {(['logs', 'metrics', 'traces'] as Panel[]).map((p) => (
          <button
            key={p}
            type="button"
            className={`db-nosql-tab ${panel === p ? 'db-nosql-tab--active' : ''} ${seen.has(p) ? 'db-nosql-tab--seen' : ''}`}
            onClick={() => switchPanel(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {panel === 'logs' && (
          <motion.div
            key="logs"
            className="dist-obs-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="dist-obs-filter">
              <input
                className="db-query-input"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                placeholder='Filter: "ERROR" or "user_id:42"'
              />
              {logFilter && (
                <button type="button" className="btn primary" onClick={() => setLogFilter('')}>Clear</button>
              )}
            </div>
            <div className="dist-obs-logs">
              {filteredLogs.map((l, i) => (
                <motion.div
                  key={i}
                  className="dist-obs-log-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <span className="micro" style={{ color: levelColor[l.level], minWidth: '3rem' }}>{l.level}</span>
                  <span className="micro" style={{ color: '#6366f1', minWidth: '8rem' }}>{l.service}</span>
                  <span className="micro">{l.msg}</span>
                </motion.div>
              ))}
              {filteredLogs.length === 0 && <span className="micro">No matching logs</span>}
            </div>
          </motion.div>
        )}

        {panel === 'metrics' && (
          <motion.div
            key="metrics"
            className="dist-obs-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Request latency p99 (ms):</p>
            <div className="dist-obs-chart">
              {[...LATENCY_POINTS, ...(latencySpike ? [820, 850, 810] : [])].map((val, i) => {
                const h = Math.min((val / 850) * 80, 80)
                const isSpike = val > 200
                return (
                  <motion.div
                    key={i}
                    className={`dist-obs-bar ${isSpike ? 'dist-obs-bar--spike' : ''}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}px` }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.03 }}
                    title={`${val}ms`}
                  />
                )
              })}
            </div>
            <div className="dist-obs-chart-labels">
              <span className="micro">time →</span>
              {alertFired && (
                <motion.span
                  className="dist-obs-alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  ALERT: p99 latency &gt; 500ms
                </motion.span>
              )}
            </div>
            <button type="button" className="btn primary" onClick={introduceSlowQuery} disabled={latencySpike}>
              Introduce slow DB query
            </button>
          </motion.div>
        )}

        {panel === 'traces' && (
          <motion.div
            key="traces"
            className="dist-obs-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Request trace — total: 1000ms across 4 services:</p>
            <div className="dist-obs-trace">
              {TRACE_SPANS.map((span, i) => {
                const left = (span.start / 1000) * 100
                const width = (span.duration / 1000) * 100
                return (
                  <motion.div
                    key={i}
                    className="dist-obs-span-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <span className="dist-obs-span-svc micro">{span.service}</span>
                    <div className="dist-obs-span-bar-wrap">
                      <motion.div
                        className={`dist-obs-span-bar ${span.isSlowDB ? 'dist-obs-span-bar--slow' : ''}`}
                        style={{ marginLeft: `${left}%`, width: `${width}%` }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="micro">{span.duration}ms{span.isSlowDB ? ' ← bottleneck' : ''}</span>
                  </motion.div>
                )
              })}
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={() => setBottleneckFound(true)}
              disabled={bottleneckFound}
            >
              Identify bottleneck
            </button>
            {bottleneckFound && (
              <motion.p
                className="db-acid-ok"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                Database span: 820ms of 1000ms total. The slow query from the Logs panel is the root cause.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lesson-actions">
        {canComplete && !done && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(true)
              onComplete()
            }}
          >
            Continue
          </button>
        )}
        {!canComplete && (
          <span className="hint">
            {!allSeen
              ? `Explore all 3 pillars (${seen.size}/3)`
              : !alertFired && !bottleneckFound
              ? 'Use metrics or traces to find the performance bottleneck'
              : ''}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="Logs, metrics, and traces: the three pillars of observability"
          body={
            <>
              Datadog, Grafana, Honeycomb, and Jaeger implement these three pillars. The key insight: logs are
              high-cardinality events (queryable), metrics are aggregated numbers (graphable), traces are
              request-scoped timelines (debuggable). You need all three.
            </>
          }
          appearsIn={['Datadog', 'Grafana + Prometheus', 'OpenTelemetry', 'Jaeger distributed tracing']}
          hook="Distributed systems are built by engineers. The choices engineers make affect millions of people. The final chapter is about that responsibility."
        />
      )}
    </div>
  )
}
