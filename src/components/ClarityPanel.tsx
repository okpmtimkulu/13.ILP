import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { askClarity } from '../lib/clarityAsk'

export function ClarityPanel() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErr(null)
    setAnswer(null)
    setLoading(true)
    try {
      const result = await askClarity(q, loc.pathname)
      if (result.ok) {
        setAnswer(result.answer)
      } else {
        setErr(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="clarity-dock">
      {!open ? (
        <button type="button" className="clarity-fab" onClick={() => setOpen(true)} aria-expanded={false}>
          Ask for clarity
        </button>
      ) : (
        <div className="clarity-sheet" role="dialog" aria-label="Clarity assistant">
          <div className="clarity-sheet-head">
            <h2 className="clarity-sheet-title">Clarity</h2>
            <button type="button" className="clarity-sheet-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <p className="clarity-sheet-note">
            Ask a question about what you are seeing. Answers follow the ILP stack (bits → CPU → network → models). Works
            when the dev server has an OpenAI key configured, or when you set a remote clarity API URL in the build.
          </p>
          <label className="clarity-label" htmlFor="clarity-q">
            Your question
          </label>
          <textarea
            id="clarity-q"
            className="clarity-input"
            rows={3}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Why does the adder need a carry bit?"
            disabled={loading}
          />
          <button type="button" className="btn primary clarity-submit" onClick={submit} disabled={loading || !q.trim()}>
            {loading ? 'Thinking…' : 'Get an answer'}
          </button>
          {err ? <p className="clarity-error">{err}</p> : null}
          {answer ? (
            <div className="clarity-answer">
              <p className="clarity-answer-label">Answer</p>
              <div className="clarity-answer-body">{answer}</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
