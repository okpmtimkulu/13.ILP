import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deviceCatalog, getDevice } from '../content/devices'
import { getRevealedDevices, markDeviceRevealed } from '../lib/deviceReveal'
import type { DeviceId } from '../lib/progress'
import { loadProgress } from '../lib/progress'

const REVEAL_COPY: Partial<Record<DeviceId, string>> = {
  'pc-starter':
    'You unlocked this tower because you already watched fetch and decode on a toy CPU. The chip in this diagram is the same rhythm, just packaged with memory and heat.',
  'phone-slim':
    'You cleared the map and the LLM lab. This slab is how those ideas show up in your pocket: SoC, modem, and neural blocks sharing one power budget.',
  'server-home':
    'You laid cables and parked a data centre. This box is the small version of “work runs somewhere on Earth.”',
  'server-commercial':
    'Commercial racks are the same physics as the home lab, just more failure domains and shared power.',
  'robot-arm':
    'All three main tracks are done. This arm is the reward: sensing, planning, and motion in one loop.',
  'vacuum-tube':
    'You finished the golden path. This skin is the same boolean story with thermionic glow instead of silicon.',
}

export function Devices() {
  const { inventory } = loadProgress()
  const [selected, setSelected] = useState<DeviceId | null>(inventory[0] ?? null)
  const [overlayId, setOverlayId] = useState<string | null>(null)
  const [revealedLocal, setRevealedLocal] = useState(() => new Set<DeviceId>(getRevealedDevices()))

  const device = selected ? getDevice(selected) : undefined
  const overlay = device?.overlays.find((o) => o.id === overlayId)

  const revealFor = selected && !revealedLocal.has(selected) && REVEAL_COPY[selected] ? selected : null

  const dismissReveal = () => {
    if (!revealFor) return
    markDeviceRevealed(revealFor)
    setRevealedLocal((prev) => new Set([...prev, revealFor]))
  }

  const pickDevice = (id: DeviceId) => {
    setSelected(id)
    setOverlayId(null)
  }

  return (
    <div className="page devices">
      <header className="page-head">
        <h1>Your collection</h1>
        <p className="subtitle">
          Each unlock is tied to something you proved in the labs. Tap a machine to zoom in; first open shows why it is
          yours.
        </p>
      </header>

      <AnimatePresence>
        {revealFor ? (
          <motion.div
            className="device-reveal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="device-reveal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="device-reveal-card"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <p className="device-reveal-eyebrow" id="device-reveal-title">
                New in your collection
              </p>
              <p className="device-reveal-body">{REVEAL_COPY[revealFor]}</p>
              <button type="button" className="btn primary" onClick={dismissReveal}>
                Look inside
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {inventory.length === 0 ? (
        <div className="empty-state">
          <p>Nothing in the garage yet. Finish a track and your first build shows up here.</p>
          <Link to="/learn/fundamentals" className="btn primary">
            Open fundamentals
          </Link>
        </div>
      ) : (
        <div className="devices-layout">
          <aside className="device-list">
            {inventory.map((id) => {
              const d = getDevice(id)
              if (!d) return null
              return (
                <button
                  key={id}
                  type="button"
                  className={selected === id ? 'active' : ''}
                  onClick={() => pickDevice(id)}
                >
                  <span className="d-name">{d.name}</span>
                  <span className="d-tag">{d.tagline}</span>
                </button>
              )
            })}
          </aside>

          {device && (
            <section className="device-detail">
              <h2>{device.name}</h2>
              <p className="muted">{device.tagline}</p>

              <div className="layer-stack">
                {device.layers.map((layer, i) => (
                  <motion.div
                    key={layer.id}
                    className="layer-card"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="layer-idx">{i + 1}</span>
                    <div>
                      <h3>{layer.label}</h3>
                      <p>{layer.blurb}</p>
                      {layer.lessonCallout ? <p className="layer-lesson-callout">{layer.lessonCallout}</p> : null}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="overlay-picker">
                <label htmlFor="ov">Algorithm overlay</label>
                <select
                  id="ov"
                  value={overlayId ?? ''}
                  onChange={(e) => setOverlayId(e.target.value || null)}
                >
                  <option value="">Choose…</option>
                  {device.overlays.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <AnimatePresence mode="wait">
                {overlay && (
                  <motion.div
                    key={overlay.id}
                    className="overlay-panel"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <p>{overlay.description}</p>
                    <div className="flow-preview" aria-hidden>
                      {device.layers.map((_, i) => (
                        <span
                          key={i}
                          className="flow-node"
                          data-active={
                            overlay.id === 'fetch' || overlay.id === 'scheduler'
                              ? i === 2
                                ? 'true'
                                : undefined
                              : undefined
                          }
                        />
                      ))}
                      <motion.span
                        className="flow-dot"
                        animate={{ x: [0, 120, 240, 360] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}
        </div>
      )}

      <p className="micro footer-hint">
        {deviceCatalog.length} machine types exist in the catalog. More appear as you finish tracks.
      </p>
    </div>
  )
}
