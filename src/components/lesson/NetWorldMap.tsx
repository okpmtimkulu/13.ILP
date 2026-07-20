import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'
import { loadProgress, mergeProgress } from '../../lib/progress'

type Props = { onComplete: () => void }

const REGIONS = [
  { id: 'na', label: 'N. America', x: 16, y: 32 },
  { id: 'sa', label: 'S. America', x: 24, y: 68 },
  { id: 'eu', label: 'Europe', x: 48, y: 28 },
  { id: 'af', label: 'Africa', x: 50, y: 52 },
  { id: 'as', label: 'Asia', x: 72, y: 36 },
  { id: 'oc', label: 'Oceania', x: 82, y: 62 },
] as const

function normPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a]
}

function pairKey(p: [string, string]) {
  return `${p[0]}:${p[1]}`
}

export function NetWorldMap({ onComplete }: Props) {
  const saved = loadProgress()
  const [cables, setCables] = useState<[string, string][]>(() => saved.worldMap.cables)
  const [dc, setDc] = useState(() => saved.worldMap.dataCentersPlaced)
  const [picked, setPicked] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const cableSet = useMemo(() => new Set(cables.map(pairKey)), [cables])

  const naEuAsRoute = useMemo(() => {
    return (
      cableSet.has(pairKey(normPair('na', 'eu'))) && cableSet.has(pairKey(normPair('eu', 'as')))
    )
  }, [cableSet])

  const persist = (nextC: [string, string][], nextDc: number) => {
    setCables(nextC)
    setDc(nextDc)
    mergeProgress({ worldMap: { cables: nextC, dataCentersPlaced: nextDc } })
  }

  const onPick = (id: string) => {
    if (!picked) {
      setPicked(id)
      return
    }
    if (picked === id) {
      setPicked(null)
      return
    }
    const p = normPair(picked, id)
    const key = pairKey(p)
    if (!cableSet.has(key)) {
      persist([...cables, p], dc)
    }
    setPicked(null)
  }

  const placeDc = () => {
    if (dc >= 4) return
    persist(cables, dc + 1)
  }

  const canComplete = cables.length >= 2 && dc >= 1

  return (
    <div className="lesson-panel">
      <p className="lede">
        The internet is a physical thing — undersea cables connect continents and data centres
        pin computation to geography. Lay cables between regions and place data centres to see
        how the global network takes shape.
      </p>
      <p className="micro">
        Tap a region, then another to lay a cable. Place at least 1 data centre. Need: 2+ cables, 1+ DC.
      </p>

      <div className="map-stats">
        <span>
          Cables: <strong>{cables.length}</strong>
        </span>
        <span>
          Data centres: <strong>{dc}</strong>
        </span>
        <span className={picked ? 'pulse' : ''}>{picked ? `Connect ${picked} to…` : 'Pick a region'}</span>
      </div>

      <div className="map-frame">
        <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="ocean-wm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--ocean-a)" />
              <stop offset="100%" stopColor="var(--ocean-b)" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#ocean-wm)" rx="2" />
          <path
            className="land"
            d="M 12 28 L 28 26 L 32 40 L 22 48 L 14 42 Z M 20 58 L 32 54 L 34 72 L 24 78 Z M 44 22 L 58 24 L 56 38 L 46 36 Z M 48 46 L 58 50 L 54 62 L 48 58 Z M 68 30 L 88 34 L 86 52 L 70 48 Z M 78 58 L 90 62 L 88 72 L 80 70 Z"
          />
          {cables.map(([a, b]) => {
            const A = REGIONS.find((r) => r.id === a)!
            const B = REGIONS.find((r) => r.id === b)!
            return (
              <motion.line
                key={pairKey([a, b])}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="var(--cable)"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            )
          })}
        </svg>

        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`map-node ${picked === r.id ? 'picked' : ''}`}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            onClick={() => onPick(r.id)}
          >
            {r.label}
          </button>
        ))}

        {dc > 0 && (
          <div className="dc-badge" aria-label={`${dc} data centres placed`}>
            DC x{dc}
          </div>
        )}
      </div>

      {naEuAsRoute && (
        <p className="map-easter micro" role="status">
          You linked North America, Europe, and Asia. Real undersea cables follow similar great-circle routes.
        </p>
      )}

      {canComplete && !done && (
        <ConnectionCard
          title="Distance becomes latency"
          body={
            <>
              Cables on the map are a stand-in for every link between regions. Data centres mark where
              work is pinned to the ground. Every millisecond of round-trip time is dictated by these
              physical choices — fibre-optic signals travel at about two-thirds the speed of light.
            </>
          }
          appearsIn={['CDN routing', 'multi-region systems', 'why "where" matters for ML training']}
          hook="Every network you build sits on top of physical infrastructure just like this."
        />
      )}

      <div className="map-actions">
        <button type="button" className="btn ghost" onClick={placeDc} disabled={dc >= 4}>
          Place data centre
        </button>
        <button
          type="button"
          className="btn primary"
          disabled={!canComplete || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
      </div>

      {!canComplete && (
        <p className="hint" style={{ textAlign: 'center' }}>
          {cables.length < 2
            ? `Lay ${2 - cables.length} more cable${2 - cables.length > 1 ? 's' : ''} between regions.`
            : 'Place at least 1 data centre.'}
        </p>
      )}
    </div>
  )
}
