import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const DOCUMENTS = [
  'the cat sat on the mat',
  'the dog sat by the cat',
  'the mat is a flat mat',
]

type Pair = [string, number]
type Phase = 'idle' | 'map' | 'shuffle' | 'reduce' | 'done'

function mapDoc(doc: string): Pair[] {
  return doc.split(' ').map((w) => [w, 1])
}

function shufflePairs(pairs: Pair[]): Record<string, number[]> {
  const groups: Record<string, number[]> = {}
  for (const [word, count] of pairs) {
    if (!groups[word]) groups[word] = []
    groups[word].push(count)
  }
  return groups
}

function reducePairs(groups: Record<string, number[]>): Pair[] {
  return Object.entries(groups).map(([word, counts]) => [word, counts.reduce((a, b) => a + b, 0)])
    .sort((a, b) => (b[1] as number) - (a[1] as number))
}

export function DistMapreduce({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [workers, setWorkers] = useState(3)
  const [compareMode, setCompareMode] = useState(false)
  const [done, setDone] = useState(false)

  const allPairs: Pair[][] = DOCUMENTS.map(mapDoc)
  const flatPairs: Pair[] = allPairs.flat()
  const groups = shufflePairs(flatPairs)
  const result = reducePairs(groups)

  const advance = () => {
    setPhase((p) => {
      if (p === 'idle') return 'map'
      if (p === 'map') return 'shuffle'
      if (p === 'shuffle') return 'reduce'
      if (p === 'reduce') return 'done'
      return p
    })
  }

  const phaseLabel: Record<Phase, string> = {
    idle: 'Ready — 3 documents, 3 workers',
    map: 'MAP: each worker emits (word, 1) pairs',
    shuffle: 'SHUFFLE: pairs sorted and grouped by key',
    reduce: 'REDUCE: each group summed',
    done: 'Word count complete',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        MapReduce splits a computation into three stages: Map (process each record independently), Shuffle (group by
        key), Reduce (aggregate each group). Step through the word count example.
      </p>

      <div className="dist-mr-stage">
        <p className="micro">{phaseLabel[phase]}</p>

        <div className="dist-mr-docs">
          {DOCUMENTS.map((doc, i) => (
            <div key={i} className={`dist-mr-doc ${phase !== 'idle' ? 'dist-mr-doc--worker' : ''}`}>
              <span className="micro">Doc {i + 1} (Worker {i + 1})</span>
              <span className="dist-mr-doc-text">"{doc}"</span>
              <AnimatePresence>
                {phase === 'map' || phase === 'shuffle' || phase === 'reduce' || phase === 'done' ? (
                  <motion.div
                    className="dist-mr-pairs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    {allPairs[i].map(([w, c], j) => (
                      <motion.span
                        key={j}
                        className="dist-mr-pair"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: j * 0.04, type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        ({w}, {c})
                      </motion.span>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {(phase === 'shuffle' || phase === 'reduce' || phase === 'done') && (
            <motion.div
              className="dist-mr-groups"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">Shuffled groups:</p>
              {Object.entries(groups).slice(0, 6).map(([word, counts]) => (
                <div key={word} className="dist-mr-group">
                  <code>({word}, [{counts.join(', ')}])</code>
                </div>
              ))}
              {Object.keys(groups).length > 6 && <span className="micro">…{Object.keys(groups).length - 6} more</span>}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(phase === 'reduce' || phase === 'done') && (
            <motion.div
              className="dist-mr-result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">Final word count:</p>
              <div className="dist-mr-table">
                {result.slice(0, 8).map(([word, count]) => (
                  <div key={word} className="dist-mr-count-row">
                    <span>{word}</span>
                    <motion.div
                      className="dist-mr-count-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count as number) * 30}px` }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    />
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'done' && (
          <motion.div
            className="dist-mr-parallel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">
              <strong>1 worker:</strong> processes docs sequentially — 3x slower.
              <strong> 3 workers:</strong> each doc in parallel — 3 map phases run simultaneously.
              Scale to 1000 docs → 1000 workers, same wall-clock time.
            </p>
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {phase !== 'done' && (
          <button type="button" className="btn primary" onClick={advance}>
            {phase === 'idle' ? 'Start MAP phase' : phase === 'map' ? 'Start SHUFFLE phase' : phase === 'shuffle' ? 'Start REDUCE phase' : 'Continue'}
          </button>
        )}
        {phase === 'done' && !done && (
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
        {phase === 'idle' && <span className="hint">Step through the three phases</span>}
      </div>

      {phase === 'done' && (
        <ConnectionCard
          title="Google's original MapReduce paper (2004) triggered the big data movement"
          body={
            <>
              Hadoop, Spark, and Flink are all descendants of that paper. Spark improved on MapReduce by keeping
              intermediate results in memory (not disk), making it 100x faster for iterative algorithms like
              machine learning.
            </>
          }
          appearsIn={['Apache Spark', 'Hadoop MapReduce', 'Flink', 'Google BigQuery']}
          hook="MapReduce distributes computation. Sharding distributes data itself. Next: how to split a database across machines."
        />
      )}
    </div>
  )
}
