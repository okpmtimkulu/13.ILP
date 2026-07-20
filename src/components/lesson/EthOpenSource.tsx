import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const LAYERS: {
  layer: string
  projects: string[]
  color: string
  delay: number
}[] = [
  { layer: '0-1 (Fundamentals + Hardware)', projects: ['Linux kernel (1991, 30M+ lines, 5000+ contributors)'], color: '#ef4444', delay: 0 },
  { layer: '2-3 (OS)', projects: ['glibc (C standard library)', 'systemd'], color: '#f59e0b', delay: 0.1 },
  { layer: '4-5 (Networks + Web)', projects: ['OpenSSL', 'curl', 'nginx'], color: '#eab308', delay: 0.2 },
  { layer: '6 (Compilers)', projects: ['LLVM/Clang', 'GCC'], color: '#10b981', delay: 0.3 },
  { layer: '7-8 (Math + DSA)', projects: ['NumPy', 'SciPy'], color: '#06b6d4', delay: 0.4 },
  { layer: '9 (Paradigms)', projects: ['Python runtime (CPython)', 'Node.js'], color: '#38bdf8', delay: 0.5 },
  { layer: '10 (Databases)', projects: ['PostgreSQL', 'Redis', 'SQLite'], color: '#6366f1', delay: 0.6 },
  { layer: '11 (Security)', projects: ['OpenSSL', "Let's Encrypt (Certbot)"], color: '#8b5cf6', delay: 0.7 },
  { layer: '12 (AI/ML)', projects: ['PyTorch', 'HuggingFace Transformers'], color: '#a855f7', delay: 0.8 },
  { layer: '13 (SWE)', projects: ['Git', 'GitHub Actions (runner)', 'Jest'], color: '#ec4899', delay: 0.9 },
  { layer: '14 (Distributed)', projects: ['etcd', 'Kafka', 'Kubernetes'], color: '#f43f5e', delay: 1.0 },
]

export function EthOpenSource({ onComplete }: { onComplete: () => void }) {
  const [animating, setAnimating] = useState(false)
  const [animDone, setAnimDone] = useState(false)
  const [done, setDone] = useState(false)

  const startAnim = () => {
    setAnimating(true)
    const totalDelay = LAYERS[LAYERS.length - 1].delay * 1000 + 600
    setTimeout(() => {
      setAnimDone(true)
    }, totalDelay)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        The ILP Lab curriculum — every concept you have learned — runs on open-source software written and maintained
        by hundreds of thousands of volunteers over five decades.
      </p>

      <div className="eth-oss-stage">
        {!animating && (
          <button type="button" className="btn primary" onClick={startAnim}>
            Reveal the open-source stack
          </button>
        )}

        <div className="eth-oss-layers">
          {animating && LAYERS.map((layer, i) => (
            <motion.div
              key={i}
              className="eth-oss-layer"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: layer.delay, type: 'spring', stiffness: 320, damping: 22 }}
            >
              <div className="eth-oss-layer-header" style={{ borderColor: layer.color }}>
                <span className="micro" style={{ color: layer.color }}>Layer {layer.layer}</span>
              </div>
              <div className="eth-oss-layer-projects">
                {layer.projects.map((p, j) => (
                  <motion.span
                    key={j}
                    className="eth-oss-project"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: layer.delay + j * 0.05 }}
                  >
                    {p}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {animDone && (
          <motion.div
            className="eth-oss-counter"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <span className="eth-oss-counter-number">~200 million</span>
            <span className="eth-oss-counter-label">
              lines of free code, written by hundreds of thousands of people over 50 years.
            </span>
            <p className="micro" style={{ marginTop: '0.5rem' }}>
              The Linux kernel alone has over 5,000 contributors. Every time you run a website, open a database,
              or train a model, you are standing on their work.
            </p>
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {animDone && !done && (
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
        {!animating && <span className="hint">Reveal the open-source stack to continue</span>}
        {animating && !animDone && <span className="hint">Animation in progress...</span>}
      </div>

      {animDone && (
        <ConnectionCard
          title="Open source is not just a license — it is the infrastructure of the internet"
          body={
            <>
              Every major cloud provider — AWS, GCP, Azure — runs on Linux. Every database, every web server, every
              programming language runtime used in production has open-source roots. You can build anything at all
              because someone gave away the foundation.
            </>
          }
          appearsIn={['Linux Foundation', 'Apache Software Foundation', 'CNCF (Kubernetes, etcd)']}
          hook="Open source embodies the first ACM Code of Ethics principle: contribute to society. The final step connects all the ethics you have learned to a formal code."
        />
      )}
    </div>
  )
}
