import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase = 'idle' | 'direct-crash' | 'direct-result' | 'queue-crash' | 'queue-recover' | 'spike'

export function DistQueue({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [backlog, setBacklog] = useState(0)
  const [draining, setDraining] = useState(false)
  const [spikeDone, setSpikeDone] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const crashSeen = phase === 'direct-result'
  const queueCrashSeen = phase === 'queue-recover' || phase === 'spike'
  const canComplete = crashSeen && queueCrashSeen && spikeDone

  const startDirectCrash = () => {
    setPhase('direct-crash')
    setTimeout(() => setPhase('direct-result'), 1200)
  }

  const startQueueCrash = () => {
    setPhase('queue-crash')
    setBacklog(0)
    // Build up backlog while consumer is down
    let count = 0
    const tick = setInterval(() => {
      count += 5
      setBacklog(count)
      if (count >= 40) {
        clearInterval(tick)
        setTimeout(() => {
          setPhase('queue-recover')
          setDraining(true)
          // Drain
          let b = 40
          const drain = setInterval(() => {
            b -= 3
            setBacklog(Math.max(0, b))
            if (b <= 0) {
              clearInterval(drain)
              setDraining(false)
            }
          }, 200)
        }, 800)
      }
    }, 150)
  }

  const startSpike = () => {
    setPhase('spike')
    setBacklog(0)
    let count = 0
    const tick = setInterval(() => {
      count += 15
      setBacklog(count)
      if (count >= 120) {
        clearInterval(tick)
        // Drain slowly
        let b = 120
        const drain = setInterval(() => {
          b -= 8
          setBacklog(Math.max(0, b))
          if (b <= 0) {
            clearInterval(drain)
            setSpikeDone(true)
          }
        }, 200)
      }
    }, 120)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        A message queue sits between producers and consumers. When the consumer crashes or falls behind, the queue
        absorbs the pressure — preventing the producer from erroring or losing data.
      </p>

      <div className="dist-queue-stage">
        {/* Direct connection (no queue) */}
        {(phase === 'idle' || phase === 'direct-crash' || phase === 'direct-result') && (
          <motion.div
            className="dist-queue-scenario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h4>Without queue: direct connection</h4>
            <div className="dist-queue-flow">
              <div className="dist-queue-actor">
                <span className="swe-pat-node">Order Service</span>
                <span className="micro">producer</span>
                {phase === 'direct-crash' && <span className="micro" style={{ color: '#f59e0b' }}>sending order...</span>}
                {phase === 'direct-result' && <span className="micro" style={{ color: '#ef4444' }}>ERROR: Connection refused</span>}
              </div>
              <div className="dist-queue-arrow">→</div>
              <div className={`dist-queue-actor ${phase !== 'idle' ? 'dist-queue-actor--down' : ''}`}>
                <span className="swe-pat-node">Email Service</span>
                <span className="micro">{phase !== 'idle' ? 'CRASHED' : 'consumer'}</span>
              </div>
            </div>
            {phase === 'direct-result' && (
              <motion.p
                className="sec-owasp-result--danger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                Order lost. Customer never receives confirmation. Email Service crash propagated to Order Service.
              </motion.p>
            )}
          </motion.div>
        )}

        {/* With queue */}
        {(phase === 'queue-crash' || phase === 'queue-recover' || phase === 'spike') && (
          <motion.div
            className="dist-queue-scenario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h4>With queue (Kafka / RabbitMQ / SQS)</h4>
            <div className="dist-queue-flow">
              <div className="dist-queue-actor">
                <span className="swe-pat-node">Order Service</span>
                <span className="micro">producer</span>
                <span className="db-acid-ok micro">OK (writing to queue)</span>
              </div>
              <div className="dist-queue-arrow">→</div>
              <div className="dist-queue-queue">
                <span className="swe-pat-node">Queue</span>
                <div className="dist-queue-bar-wrap">
                  <motion.div
                    className="dist-queue-bar-fill"
                    animate={{ width: `${Math.min((backlog / 120) * 100, 100)}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
                <span className="micro">{backlog} msgs</span>
              </div>
              <div className="dist-queue-arrow">→</div>
              <div className={`dist-queue-actor ${phase === 'queue-crash' ? 'dist-queue-actor--down' : ''}`}>
                <span className="swe-pat-node">Email Service</span>
                <span className="micro">
                  {phase === 'queue-crash' ? 'CRASHED' : draining ? 'recovering, draining backlog...' : 'consumer (running)'}
                </span>
              </div>
            </div>

            {phase === 'queue-crash' && (
              <p className="micro" style={{ color: '#f59e0b', marginTop: '0.5rem' }}>
                Orders queue up in Kafka. Order Service never errors. Email Service will drain when it recovers.
              </p>
            )}
            {phase === 'queue-recover' && !draining && (
              <motion.p
                className="db-acid-ok"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                Backlog drained. All orders processed. No data lost.
              </motion.p>
            )}
            {phase === 'spike' && (
              <p className="micro" style={{ color: '#f59e0b', marginTop: '0.5rem' }}>
                1000 orders/sec arriving, Email Service processes 100/sec. Backlog grows — but producers never error.
                Queue acts as shock absorber.
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {phase === 'idle' && (
          <button type="button" className="btn primary" onClick={startDirectCrash}>
            Crash Email Service (no queue)
          </button>
        )}
        {phase === 'direct-result' && (
          <button type="button" className="btn primary" onClick={startQueueCrash}>
            Retry with queue: crash Email Service
          </button>
        )}
        {phase === 'queue-recover' && !draining && !spikeDone && (
          <button type="button" className="btn primary" onClick={startSpike}>
            Simulate 10x traffic spike
          </button>
        )}
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
        {phase === 'direct-crash' && <span className="hint">Simulation running...</span>}
        {phase === 'queue-crash' && backlog < 40 && <span className="hint">Backlog building...</span>}
        {draining && <span className="hint">Email Service draining backlog...</span>}
      </div>

      {canComplete && (
        <ConnectionCard
          title="Kafka, RabbitMQ, and SQS handle billions of messages daily"
          body={
            <>
              The queue is the shock absorber of the internet. Every ride-sharing app (trip requests), streaming service
              (view events), and bank (transaction events) uses message queues to decouple services that would otherwise
              fail together.
            </>
          }
          appearsIn={['Apache Kafka', 'AWS SQS/SNS', 'RabbitMQ', 'event-driven architecture']}
          hook="Queues decouple services. Observability tools let you see what those services are doing. The last distributed systems topic: logs, metrics, and traces."
        />
      )}
    </div>
  )
}
