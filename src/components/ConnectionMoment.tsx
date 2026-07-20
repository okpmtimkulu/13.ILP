import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Props = {
  open: boolean
  title: string
  body: string
  hook?: string
  ctaLabel?: string
  onContinue: () => void
}

export function ConnectionMoment({ open, title, body, hook, ctaLabel = 'Continue', onContinue }: Props) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="connection-moment-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connection-moment-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="connection-moment-card"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <p className="connection-moment-eyebrow">One more beat</p>
            <h2 id="connection-moment-title" className="connection-moment-title">
              {title}
            </h2>
            <p className="connection-moment-body">{body}</p>
            {hook ? <p className="connection-moment-hook">{hook}</p> : null}
            <button type="button" className="btn primary connection-moment-cta" onClick={onContinue}>
              {ctaLabel}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
