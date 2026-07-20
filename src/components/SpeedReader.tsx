import { useEffect, useMemo, useRef, useState } from 'react'

const MIN_WPM = 150
const MAX_WPM = 900

function currentReadingText(): { text: string; source: string } {
  const selection = window.getSelection()?.toString().trim() ?? ''
  if (selection.split(/\s+/).length >= 3) {
    return { text: selection, source: 'Selected text' }
  }

  const root = document.querySelector<HTMLElement>('.lesson-page') ?? document.querySelector<HTMLElement>('main')
  if (!root) return { text: '', source: 'Current page' }

  const copy = root.cloneNode(true) as HTMLElement
  copy
    .querySelectorAll(
      'button, input, textarea, select, script, style, svg, canvas, nav, [aria-hidden="true"], [data-speed-reader-ignore]',
    )
    .forEach((element) => element.remove())

  return {
    text: (copy.innerText || copy.textContent || '').replace(/\s+/g, ' ').trim(),
    source: document.querySelector<HTMLElement>('.lesson-title')?.innerText.trim() || document.title || 'Current page',
  }
}

export function SpeedReader() {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [words, setWords] = useState<string[]>([])
  const [source, setSource] = useState('Current page')
  const [index, setIndex] = useState(0)
  const [wpm, setWpm] = useState(300)
  const [chunkSize, setChunkSize] = useState(1)
  const [playing, setPlaying] = useState(false)

  const chunk = useMemo(() => words.slice(index, index + chunkSize).join(' '), [chunkSize, index, words])
  const percent = words.length ? Math.min(100, Math.round(((index + chunkSize) / words.length) * 100)) : 0
  const minutesLeft = words.length ? Math.max(0, (words.length - index) / wpm) : 0

  const loadReader = () => {
    const content = currentReadingText()
    setWords(content.text ? content.text.split(/\s+/).filter(Boolean) : [])
    setSource(content.source)
    setIndex(0)
    setPlaying(false)
    setOpen(true)
  }

  const close = () => {
    setPlaying(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!playing || words.length === 0) return
    const delay = (60_000 / wpm) * chunkSize
    const timer = window.setTimeout(() => {
      setIndex((current) => {
        const next = current + chunkSize
        if (next >= words.length) {
          setPlaying(false)
          return Math.max(0, words.length - chunkSize)
        }
        return next
      })
    }, delay)
    return () => window.clearTimeout(timer)
  }, [chunkSize, index, playing, words.length, wpm])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault()
        if (words.length) setPlaying((value) => !value)
      }
      if (event.key === 'ArrowRight') {
        setIndex((value) => Math.min(Math.max(0, words.length - chunkSize), value + chunkSize))
      }
      if (event.key === 'ArrowLeft') setIndex((value) => Math.max(0, value - chunkSize))
    }
    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [chunkSize, open, words.length])

  return (
    <>
      <button type="button" className="speed-reader-fab" onClick={loadReader} data-speed-reader-ignore>
        Speed reader
      </button>

      {open ? (
        <div className="speed-reader-backdrop" role="presentation" data-speed-reader-ignore>
          <div
            ref={dialogRef}
            className="speed-reader-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="speed-reader-title"
            tabIndex={-1}
          >
            <header className="speed-reader-head">
              <div>
                <p className="speed-reader-eyebrow">Reading mode</p>
                <h2 id="speed-reader-title">{source}</h2>
              </div>
              <button type="button" className="speed-reader-close" onClick={close} aria-label="Close speed reader">
                ×
              </button>
            </header>

            {words.length ? (
              <>
                <div className="speed-reader-stage" aria-live="polite" aria-atomic="true">
                  <span>{chunk}</span>
                </div>

                <input
                  className="speed-reader-progress"
                  type="range"
                  min={0}
                  max={Math.max(0, words.length - 1)}
                  value={index}
                  onChange={(event) => {
                    setPlaying(false)
                    setIndex(Number(event.target.value))
                  }}
                  aria-label="Reading position"
                />

                <div className="speed-reader-meta">
                  <span>{percent}% complete</span>
                  <span>{minutesLeft < 1 ? '< 1 min left' : `${Math.ceil(minutesLeft)} min left`}</span>
                  <span>{words.length.toLocaleString()} words</span>
                </div>

                <div className="speed-reader-controls">
                  <label>
                    Speed
                    <span>{wpm} WPM</span>
                    <input
                      type="range"
                      min={MIN_WPM}
                      max={MAX_WPM}
                      step={25}
                      value={wpm}
                      onChange={(event) => setWpm(Number(event.target.value))}
                    />
                  </label>

                  <label>
                    Words at once
                    <select value={chunkSize} onChange={(event) => setChunkSize(Number(event.target.value))}>
                      <option value={1}>1 word</option>
                      <option value={2}>2 words</option>
                      <option value={3}>3 words</option>
                    </select>
                  </label>
                </div>

                <div className="speed-reader-actions">
                  <button type="button" className="btn ghost" onClick={() => { setPlaying(false); setIndex(0) }}>
                    Restart
                  </button>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => {
                      if (!playing && index >= words.length - chunkSize) setIndex(0)
                      setPlaying((value) => !value)
                    }}
                  >
                    {playing ? 'Pause' : index >= words.length - chunkSize ? 'Read again' : 'Start reading'}
                  </button>
                </div>
                <p className="speed-reader-shortcuts">Space to play or pause · Arrow keys to move · Esc to close</p>
              </>
            ) : (
              <div className="speed-reader-empty">
                <p>There isn’t enough readable text on this screen.</p>
                <p>Open a lesson, or select a passage before launching the reader.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
