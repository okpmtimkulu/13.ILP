import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type StageStatus = 'idle' | 'running' | 'pass' | 'fail'

type Stage = {
  id: string
  label: string
  duration: string
  detail: string
}

const STAGES: Stage[] = [
  { id: 'lint', label: 'Lint', duration: '1.2s', detail: 'ESLint: 0 errors, 0 warnings' },
  { id: 'unit', label: 'Unit Tests', duration: '3.2s', detail: '47 tests passed' },
  { id: 'integration', label: 'Integration Tests', duration: '11.8s', detail: '12 tests passed against test DB' },
  { id: 'build', label: 'Build', duration: '8.4s', detail: 'TypeScript compiled, bundle: 284KB' },
  { id: 'staging', label: 'Deploy Staging', duration: '14s', detail: 'Container started, health check: 200 OK' },
  { id: 'production', label: 'Deploy Production', duration: '22s', detail: 'Blue-green: new container up, traffic shifted, old terminated after 30s' },
]

const FAIL_STAGE = 'unit'

export function SweCICD({ onComplete }: { onComplete: () => void }) {
  const [statuses, setStatuses] = useState<Record<string, StageStatus>>(
    Object.fromEntries(STAGES.map((s) => [s.id, 'idle']))
  )
  const [running, setRunning] = useState(false)
  const [failMode, setFailMode] = useState(false)
  const [pipelineDone, setPipelineDone] = useState(false)
  const [failSeen, setFailSeen] = useState(false)
  const [successSeen, setSuccessSeen] = useState(false)
  const [done, setDone] = useState(false)

  const runPipeline = (fail: boolean) => {
    setRunning(true)
    setPipelineDone(false)
    setStatuses(Object.fromEntries(STAGES.map((s) => [s.id, 'idle'])))

    let idx = 0
    const runNext = () => {
      if (idx >= STAGES.length) {
        setRunning(false)
        setPipelineDone(true)
        setSuccessSeen(true)
        return
      }
      const stage = STAGES[idx]
      setStatuses((prev) => ({ ...prev, [stage.id]: 'running' }))
      const delay = fail && stage.id === FAIL_STAGE ? 600 : 800

      setTimeout(() => {
        if (fail && stage.id === FAIL_STAGE) {
          setStatuses((prev) => ({ ...prev, [stage.id]: 'fail' }))
          setRunning(false)
          setPipelineDone(true)
          setFailSeen(true)
          return
        }
        setStatuses((prev) => ({ ...prev, [stage.id]: 'pass' }))
        idx++
        setTimeout(runNext, 200)
      }, delay)
    }

    runNext()
  }

  const canComplete = failSeen && successSeen

  const statusIcon: Record<StageStatus, string> = {
    idle: '○',
    running: '◌',
    pass: '✓',
    fail: '✗',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        A CI/CD pipeline runs automatically on every commit. Each stage is a quality gate — a failure stops the deploy.
        Watch the full green pipeline, then watch a test failure halt it before reaching production.
      </p>

      <div className="swe-cicd-stage">
        <div className="swe-cicd-trigger">
          <span className="micro">Trigger: git push to main</span>
        </div>

        <div className="swe-cicd-pipeline">
          {STAGES.map((stage, i) => {
            const status = statuses[stage.id]
            const isRunning = status === 'running'
            const isPass = status === 'pass'
            const isFail = status === 'fail'
            return (
              <div key={stage.id} className="swe-cicd-stage-row">
                {i > 0 && (
                  <div className={`swe-cicd-connector ${isPass || statuses[STAGES[i - 1].id] === 'pass' ? 'swe-cicd-connector--active' : ''}`} />
                )}
                <motion.div
                  className={`swe-cicd-box ${isRunning ? 'swe-cicd-box--running' : isPass ? 'swe-cicd-box--pass' : isFail ? 'swe-cicd-box--fail' : 'swe-cicd-box--idle'}`}
                  animate={{
                    scale: isRunning ? [1, 1.03, 1] : 1,
                  }}
                  transition={{ repeat: isRunning ? Infinity : 0, duration: 0.6 }}
                >
                  <span className="swe-cicd-status-icon">{statusIcon[status]}</span>
                  <span className="swe-cicd-label">{stage.label}</span>
                  {(isPass || isFail) && (
                    <AnimatePresence>
                      <motion.span
                        className="micro swe-cicd-detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        {isFail ? '47 tests: 1 FAILED — deploy stopped' : stage.detail} ({stage.duration})
                      </motion.span>
                    </AnimatePresence>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>

        {pipelineDone && !successSeen && failSeen && (
          <motion.p
            className="sec-owasp-result--danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Pipeline stopped at Unit Tests. No code reached staging or production. Fix and re-push to try again.
          </motion.p>
        )}
        {pipelineDone && successSeen && (
          <motion.p
            className="db-acid-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Full pipeline green. Production deploy complete. Blue-green: zero downtime.
          </motion.p>
        )}
      </div>

      <div className="lesson-actions">
        {!running && !failSeen && (
          <button type="button" className="btn primary" onClick={() => { setFailMode(true); runPipeline(true) }}>
            Fail a test → watch pipeline stop
          </button>
        )}
        {!running && failSeen && !successSeen && (
          <button type="button" className="btn primary" onClick={() => { setFailMode(false); runPipeline(false) }}>
            Fix and re-push → full green pipeline
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
        {running && <span className="hint">Pipeline running...</span>}
        {!canComplete && !running && (
          <span className="hint">
            {!failSeen ? 'Run the failing pipeline first' : !successSeen ? 'Now run the green pipeline' : ''}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="'Works on my machine' ends where CI/CD begins"
          body={
            <>
              Every company from startups to Google uses automated pipelines. Without them, deployments are manual,
              error-prone, and unpredictable. With them, shipping code is boring — and boring is good in production.
            </>
          }
          appearsIn={['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI']}
          hook="CI/CD catches integration errors. Debugging finds errors in code that passed all the tests. Next: how to binary-search a bug."
        />
      )}
    </div>
  )
}
