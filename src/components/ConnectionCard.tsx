import type { ReactNode } from 'react'

type Props = {
  title: string
  /** Main insight in second person */
  body: ReactNode
  /** Where this idea shows up again */
  appearsIn?: string[]
  /** One line that pulls toward the next step */
  hook?: string
}

export function ConnectionCard({ title, body, appearsIn, hook }: Props) {
  return (
    <aside className="connection-card" aria-label="How this connects">
      <p className="connection-card-eyebrow">You just saw</p>
      <h3 className="connection-card-title">{title}</h3>
      <div className="connection-card-body">{body}</div>
      {appearsIn && appearsIn.length > 0 ? (
        <p className="connection-card-list">
          <span className="connection-card-list-label">You will meet this again in </span>
          {appearsIn.join(', ')}.
        </p>
      ) : null}
      {hook ? <p className="connection-card-hook">{hook}</p> : null}
    </aside>
  )
}
