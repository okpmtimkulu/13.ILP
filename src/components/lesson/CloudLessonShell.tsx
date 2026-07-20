import { type ReactNode, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = {
  title: string
  lede: ReactNode
  visual: ReactNode
  card: {
    title: string
    body: ReactNode
    appearsIn: string[]
    hook: string
  }
  onComplete: () => void
}

export function CloudLessonShell({ title, lede, visual, card, onComplete }: Props) {
  const [done, setDone] = useState(false)

  return (
    <div className="lesson-panel cloud-lesson">
      <h3 className="cloud-lesson-title">{title}</h3>
      <div className="lede">{lede}</div>
      <div className="cloud-lesson-visual">{visual}</div>
      <ConnectionCard title={card.title} body={card.body} appearsIn={card.appearsIn} hook={card.hook} />
      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={done}
          onClick={() => {
            setDone(true)
            onComplete()
          }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
      </div>
    </div>
  )
}
